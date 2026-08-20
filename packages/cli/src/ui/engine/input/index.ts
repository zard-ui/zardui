/**
 * input — a parser (a byte-level state machine, ADR-0008) that turns raw stdin
 * into semantic KeyEvent / MouseEvent / paste events.
 */

import { createEmitter, type Disposable } from '../events/index.js';

export type Key =
  | string
  | 'enter'
  | 'escape'
  | 'tab'
  | 'backspace'
  | 'delete'
  | 'insert'
  | 'home'
  | 'end'
  | 'pageup'
  | 'pagedown'
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'space';

export interface KeyEvent {
  readonly key: Key;
  readonly ctrl: boolean;
  readonly alt: boolean;
  readonly shift: boolean;
  readonly raw: string;
}
export type MouseButton = 'left' | 'middle' | 'right' | 'wheel-up' | 'wheel-down' | 'none';
export interface MouseEvent {
  readonly x: number;
  readonly y: number;
  readonly button: MouseButton;
  readonly action: 'press' | 'release' | 'move';
  readonly ctrl: boolean;
  readonly alt: boolean;
  readonly shift: boolean;
}
export interface InputManager {
  onKey(cb: (e: KeyEvent) => void): Disposable;
  onMouse(cb: (e: MouseEvent) => void): Disposable;
  onPaste(cb: (text: string) => void): Disposable;
  start(): void;
  stop(): void;
}
export interface InputOptions {
  readonly escTimeout?: number;
  readonly mouse?: boolean;
}

interface Decoded {
  key: Key;
  ctrl: boolean;
  shift: boolean;
  consumed: number;
}

const CSI_KEY: Record<number, Key> = {
  0x41: 'up',
  0x42: 'down',
  0x43: 'right',
  0x44: 'left',
  0x48: 'home',
  0x46: 'end',
};
const TILDE_KEY: Record<number, Key> = {
  1: 'home',
  2: 'insert',
  3: 'delete',
  4: 'end',
  5: 'pageup',
  6: 'pagedown',
  7: 'home',
  8: 'end',
};

/** Decodes one simple (non-escape) key from the start of `buf`. consumed=0 ⇒ incomplete. */
function decodeSimple(buf: Buffer): Decoded {
  const b = buf[0];
  if (b === undefined) return { key: '', ctrl: false, shift: false, consumed: 0 };
  if (b === 0x0d || b === 0x0a) return { key: 'enter', ctrl: false, shift: false, consumed: 1 };
  if (b === 0x09) return { key: 'tab', ctrl: false, shift: false, consumed: 1 };
  if (b === 0x7f || b === 0x08) return { key: 'backspace', ctrl: false, shift: false, consumed: 1 };
  if (b < 0x20) {
    // controle → ctrl+letra (0x01→'a')
    return { key: String.fromCharCode(b + 96), ctrl: true, shift: false, consumed: 1 };
  }
  if (b < 0x80) return { key: String.fromCharCode(b), ctrl: false, shift: false, consumed: 1 };
  // UTF-8 multibyte
  const len = b >= 0xf0 ? 4 : b >= 0xe0 ? 3 : b >= 0xc0 ? 2 : 1;
  if (buf.length < len) return { key: '', ctrl: false, shift: false, consumed: 0 };
  return { key: buf.subarray(0, len).toString('utf8'), ctrl: false, shift: false, consumed: len };
}

export function createInputManager(
  onData: (cb: (bytes: Buffer) => void) => Disposable,
  options: InputOptions = {},
): InputManager {
  const keys = createEmitter<KeyEvent>();
  const mouse = createEmitter<MouseEvent>();
  const paste = createEmitter<string>();
  const escTimeout = options.escTimeout ?? 50;

  // Explicit annotation: Buffer.concat returns Buffer<ArrayBufferLike>, which is
  // not assignable to the Buffer<ArrayBuffer> inferred from Buffer.alloc.
  let pending: Buffer = Buffer.alloc(0);
  let pasteMode = false;
  let pasteBuf = '';
  let escTimer: ReturnType<typeof setTimeout> | undefined;
  let sub: Disposable | undefined;

  const emitKey = (key: Key, ctrl: boolean, alt: boolean, shift: boolean, raw: string): void => {
    keys.emit({ key, ctrl, alt, shift, raw });
  };

  const PASTE_END = Buffer.from('\x1b[201~');

  /** Consumes ONE token from the start of `pending`; returns bytes consumed, or 0 (incomplete). */
  function step(): number {
    if (pending.length === 0) return 0;

    if (pasteMode) {
      const idx = pending.indexOf(PASTE_END);
      if (idx === -1) return 0; // aguarda o terminador
      pasteBuf += pending.subarray(0, idx).toString('utf8');
      paste.emit(pasteBuf);
      pasteBuf = '';
      pasteMode = false;
      return idx + PASTE_END.length;
    }

    const b0 = pending[0]!;
    if (b0 !== 0x1b) {
      const d = decodeSimple(pending);
      if (d.consumed === 0) return 0;
      emitKey(d.key, d.ctrl, false, d.shift, pending.subarray(0, d.consumed).toString('utf8'));
      return d.consumed;
    }

    // ── escape sequence ──
    if (pending.length === 1) return 0; // ESC sozinho → timeout decide
    const b1 = pending[1]!;

    // SS3: ESC O <final>
    if (b1 === 0x4f) {
      if (pending.length < 3) return 0;
      const f = pending[2]!;
      const key = CSI_KEY[f];
      if (key) emitKey(key, false, false, false, `\x1bO${String.fromCharCode(f)}`);
      return 3;
    }

    // CSI: ESC [ … <final>
    if (b1 === 0x5b) {
      let i = 2;
      while (i < pending.length) {
        const c = pending[i]!;
        if (c >= 0x30 && c <= 0x3f)
          i++; // parameter bytes (digits, ';', '<', '?')
        else break;
      }
      if (i >= pending.length) return 0; // the final byte is missing
      const final = pending[i]!;
      if (final < 0x40 || final > 0x7e) {
        // invalid: drop ESC[ and carry on
        return 2;
      }
      const paramStr = pending.subarray(2, i).toString('latin1');
      const consumed = i + 1;

      // bracketed paste start
      if (paramStr === '200' && final === 0x7e) {
        pasteMode = true;
        pasteBuf = '';
        return consumed;
      }
      // mouse SGR: ESC[<b;x;yM/m
      if (paramStr.startsWith('<')) {
        const parts = paramStr.slice(1).split(';').map(Number);
        const cb = parts[0] ?? 0;
        const x = (parts[1] ?? 1) - 1;
        const y = (parts[2] ?? 1) - 1;
        const wheel = (cb & 64) !== 0;
        const button: MouseButton = wheel
          ? (cb & 1) !== 0
            ? 'wheel-down'
            : 'wheel-up'
          : (['left', 'middle', 'right', 'none'][cb & 3] as MouseButton);
        const action = wheel ? 'press' : (cb & 32) !== 0 ? 'move' : final === 0x6d ? 'release' : 'press';
        mouse.emit({
          x,
          y,
          button,
          action,
          ctrl: (cb & 16) !== 0,
          alt: (cb & 8) !== 0,
          shift: (cb & 4) !== 0,
        });
        return consumed;
      }

      // navigation keys (with optional modifiers)
      const nums = paramStr.split(';');
      const mod = nums.length > 1 ? Number(nums[1]) : 0;
      const bits = mod > 0 ? mod - 1 : 0;
      const shift = (bits & 1) !== 0;
      const alt = (bits & 2) !== 0;
      const ctrl = (bits & 4) !== 0;
      const raw = `\x1b[${paramStr}${String.fromCharCode(final)}`;

      if (final === 0x7e) {
        const key = TILDE_KEY[Number(nums[0])];
        if (key) emitKey(key, ctrl, alt, shift, raw);
        return consumed;
      }
      if (final === 0x5a) {
        // CSI Z → shift+tab
        emitKey('tab', false, false, true, raw);
        return consumed;
      }
      const key = CSI_KEY[final];
      if (key) emitKey(key, ctrl, alt, shift, raw);
      return consumed;
    }

    // ESC + byte comum → alt+tecla
    const d = decodeSimple(pending.subarray(1));
    if (d.consumed === 0) return 0;
    emitKey(d.key, d.ctrl, true, d.shift, pending.subarray(0, 1 + d.consumed).toString('utf8'));
    return 1 + d.consumed;
  }

  function feed(chunk: Buffer): void {
    if (escTimer !== undefined) {
      clearTimeout(escTimer);
      escTimer = undefined;
    }
    pending = pending.length ? Buffer.concat([pending, chunk]) : chunk;

    for (;;) {
      const consumed = step();
      if (consumed <= 0) break;
      pending = pending.subarray(consumed);
      if (pending.length === 0) break;
    }

    // ESC isolado: aguarda escTimeout antes de emitir 'escape'
    if (pending.length === 1 && pending[0] === 0x1b) {
      escTimer = setTimeout(() => {
        escTimer = undefined;
        if (pending.length === 1 && pending[0] === 0x1b) {
          emitKey('escape', false, false, false, '\x1b');
          pending = Buffer.alloc(0);
        }
      }, escTimeout);
    }
  }

  return {
    onKey: cb => keys.on(cb),
    onMouse: cb => mouse.on(cb),
    onPaste: cb => paste.on(cb),
    start() {
      if (sub) return;
      sub = onData(feed);
    },
    stop() {
      sub?.dispose();
      sub = undefined;
      if (escTimer !== undefined) {
        clearTimeout(escTimer);
        escTimer = undefined;
      }
      pending = Buffer.alloc(0);
    },
  };
}
