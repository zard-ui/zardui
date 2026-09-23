/**
 * terminal — the ONE low-level I/O boundary (ADR-0007). Nothing else touches
 * process.stdout/stdin. Detects capabilities and handles raw mode and the
 * alternate screen.
 */

import { closeSync, openSync } from 'node:fs';
import { ReadStream, WriteStream } from 'node:tty';

import type { ColorLevel } from '../ansi/index.js';
import { csi } from '../ansi/index.js';
import type { Disposable } from '../events/index.js';
import type { Size } from '../frame/index.js';

export type { ColorLevel } from '../ansi/index.js';

/** The pair of streams the UI will live on, and how to give them back. */
export interface TerminalStreams {
  readonly input: NodeJS.ReadStream;
  readonly output: NodeJS.WriteStream;
  /** True when the terminal had to be opened outside the inherited fds. */
  readonly fromControllingTerminal: boolean;
  /** Closes whatever we opened; a no-op when these are the standard fds. */
  close(): void;
}

/**
 * Opens the process's controlling terminal, ignoring the inherited fds.
 *
 * `/dev/tty` is the terminal the process is attached to, whatever the caller did
 * with stdin and stdout. It is the mechanism `fzf`, `less` and `git rebase -i`
 * use to stay interactive inside a pipe; on Windows, `CONIN$`/`CONOUT$` are the
 * equivalent.
 *
 * Returns null when there is no terminal at all — real CI, a cron job, a
 * container with no tty — and that is what keeps the headless path working
 * where it should.
 */
export function openControllingTerminal(): TerminalStreams | null {
  const [inPath, outPath] = process.platform === 'win32' ? ['CONIN$', 'CONOUT$'] : ['/dev/tty', '/dev/tty'];

  let inFd: number | undefined;
  let outFd: number | undefined;

  try {
    inFd = openSync(inPath as string, 'r');
    outFd = openSync(outPath as string, 'w');

    const input = new ReadStream(inFd);
    const output = new WriteStream(outFd);

    if (!input.isTTY || !output.isTTY) throw new Error('not a terminal');

    // Without this the screen does not reflow when the window is resized: Node
    // only wires SIGWINCH to the `process.stdout` it creates itself.
    // `_refreshSize` is internal, so the optional chaining is deliberate — if it
    // disappears, reflow is lost, not the interface.
    const onResize = (): void => (output as unknown as { _refreshSize?: () => void })._refreshSize?.();
    process.on('SIGWINCH', onResize);

    return {
      input,
      output,
      fromControllingTerminal: true,
      close() {
        process.off('SIGWINCH', onResize);
        for (const stream of [input, output]) {
          try {
            stream.destroy();
          } catch {
            /* already closed */
          }
        }
      },
    };
  } catch {
    for (const fd of [inFd, outFd]) {
      if (fd === undefined) continue;
      try {
        closeSync(fd);
      } catch {
        /* nunca chegou a abrir */
      }
    }
    return null;
  }
}

/**
 * Where the UI should be drawn.
 *
 * The inherited fds come first: when both are already a terminal, there is
 * nothing to resolve. The rest exists because of `npx` — on POSIX it runs the
 * binary through a shell and the process's stdin arrives as a pipe, which made
 * the CLI conclude nobody could answer and fall back to text mode. The terminal
 * was there the whole time; it was the route to it that had gone missing.
 */
export function resolveTerminalStreams(
  stdin: NodeJS.ReadStream = process.stdin,
  stdout: NodeJS.WriteStream = process.stdout,
  openTerminal: () => TerminalStreams | null = openControllingTerminal,
): TerminalStreams | null {
  if (stdin.isTTY && stdout.isTTY) {
    return { input: stdin, output: stdout, fromControllingTerminal: false, close: () => undefined };
  }

  return openTerminal();
}

export interface TerminalCapabilities {
  readonly colors: ColorLevel;
  readonly unicode: boolean;
  readonly mouse: boolean;
  readonly synchronizedOutput: boolean;
  readonly isTTY: boolean;
}
export interface Terminal {
  readonly caps: TerminalCapabilities;
  size(): Size;
  write(bytes: string): void;
  writeError(bytes: string): void;
  enterRawMode(): void;
  exitRawMode(): void;
  enterAltScreen(): void;
  exitAltScreen(): void;
  showCursor(visible: boolean): void;
  enableMouse(enabled: boolean): void;
  onResize(cb: (size: Size) => void): Disposable;
  onData(cb: (bytes: Buffer) => void): Disposable;
  restore(): void;
}
export interface TerminalOptions {
  readonly forceColor?: ColorLevel;
  readonly stdout?: NodeJS.WriteStream;
  readonly stdin?: NodeJS.ReadStream;
}

/** Emuladores que fazem 24 bits sem anunciar nada em COLORTERM. */
const TRUECOLOR_PROGRAMS = new Set([
  'vscode',
  'iterm.app',
  'hyper',
  'wezterm',
  'ghostty',
  'tabby',
  'rio',
  'warpterminal',
]);
const TRUECOLOR_TERMS = ['kitty', 'alacritty', 'wezterm', 'contour', 'foot', 'ghostty', 'direct'];

const FORCE_LEVELS: Record<string, ColorLevel> = {
  '0': 'none',
  '1': 'ansi16',
  '2': 'ansi256',
  '3': 'truecolor',
};

/**
 * How many colours this terminal accepts.
 *
 * This decides whether the banner's gradient comes out in the theme's exact
 * tones or quantized — and the answer has to be the same on all three platforms,
 * or the same CLI has three appearances. `COLORTERM` alone does not give that:
 * Windows Terminal, VS Code and iTerm all do 24-bit and none of them set it, so
 * falling through to the `ansi16` at the end would treat them as 1990 terminals.
 *
 * The order runs from the most explicit to the most assumed: what the user asked
 * for (NO_COLOR/FORCE_COLOR), what the terminal declares, who it says it is, and
 * only then a guess from the platform.
 */
export function detectColorLevel(
  env: NodeJS.ProcessEnv,
  isTTY: boolean,
  force?: ColorLevel,
  platform: NodeJS.Platform = process.platform,
): ColorLevel {
  if (force) return force;
  if (env['NO_COLOR'] !== undefined) return 'none';

  const forced = FORCE_LEVELS[(env['FORCE_COLOR'] ?? '').trim()];
  if (forced) return forced;

  if (!isTTY) return 'none';

  const term = (env['TERM'] ?? '').toLowerCase();
  if (term === 'dumb') return 'none';

  const colorterm = (env['COLORTERM'] ?? '').toLowerCase();
  if (colorterm.includes('truecolor') || colorterm.includes('24bit')) return 'truecolor';

  // Windows Terminal and the Windows 10+ console both do 24-bit; neither sets
  // COLORTERM or TERM, so without this line the CLI would look poorer exactly
  // where it was developed.
  if (env['WT_SESSION'] !== undefined || env['ConEmuANSI'] === 'ON') return 'truecolor';

  const program = (env['TERM_PROGRAM'] ?? '').toLowerCase();
  if (TRUECOLOR_PROGRAMS.has(program)) return 'truecolor';
  if (TRUECOLOR_TERMS.some(known => term.includes(known))) return 'truecolor';

  // macOS Terminal.app announces xterm-256color and means it: 256 colours, no
  // 24-bit. The generic branch below would give the same answer, but saying it
  // here stops a future TERM rule from promoting it by mistake.
  if (program === 'apple_terminal') return 'ansi256';

  if (term.includes('256')) return 'ansi256';

  // Windows with none of the hints above is still Windows 10 or newer: Node 20,
  // which the CLI requires, runs on nothing older.
  if (platform === 'win32') return 'truecolor';

  return 'ansi16';
}

export function createTerminal(options: TerminalOptions = {}): Terminal {
  const out = options.stdout ?? process.stdout;
  const inp = options.stdin ?? process.stdin;

  const caps: TerminalCapabilities = {
    colors: detectColorLevel(process.env, Boolean(out.isTTY), options.forceColor),
    unicode: (process.env['TERM'] ?? '') !== 'dumb',
    mouse: Boolean(out.isTTY),
    synchronizedOutput: Boolean(out.isTTY),
    isTTY: Boolean(out.isTTY),
  };

  let rawOn = false;
  let altOn = false;

  return {
    caps,
    size() {
      return { cols: out.columns ?? 80, rows: out.rows ?? 24 };
    },
    write(bytes) {
      out.write(bytes);
    },
    writeError(bytes) {
      process.stderr.write(bytes);
    },
    enterRawMode() {
      if (inp.isTTY && !rawOn) {
        inp.setRawMode(true);
        inp.resume();
        rawOn = true;
      }
    },
    exitRawMode() {
      if (inp.isTTY && rawOn) {
        inp.setRawMode(false);
        // enterRawMode's `resume()` holds a live reference in the event loop.
        // Without putting stdin back to paused, the process keeps running after
        // the wizard ends: the screen drops, the summary appears and the shell
        // never comes back — it looks as if the final enter did nothing.
        inp.pause();
        rawOn = false;
      }
    },
    enterAltScreen() {
      if (!altOn) {
        out.write(csi('?1049h'));
        altOn = true;
      }
    },
    exitAltScreen() {
      if (altOn) {
        out.write(csi('?1049l'));
        altOn = false;
      }
    },
    showCursor(visible) {
      out.write(csi(visible ? '?25h' : '?25l'));
    },
    enableMouse(enabled) {
      out.write(csi(enabled ? '?1000;1006h' : '?1000;1006l'));
    },
    onResize(cb) {
      const handler = (): void => cb({ cols: out.columns ?? 80, rows: out.rows ?? 24 });
      out.on('resize', handler);
      return { dispose: () => out.off('resize', handler) };
    },
    onData(cb) {
      inp.on('data', cb);
      return { dispose: () => inp.off('data', cb) };
    },
    restore() {
      // The attribute reset comes first, and before leaving the alt-screen: the
      // last frame almost always ends mid-colour, and without clearing SGR that
      // attribute still applies in the main buffer — the user's shell keeps
      // writing in colour after the CLI has exited.
      out.write('\x1b[0m');
      this.showCursor(true);
      this.enableMouse(false);
      this.exitAltScreen();
      this.exitRawMode();
    },
  };
}
