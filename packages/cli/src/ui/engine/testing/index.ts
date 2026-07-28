/**
 * testing — utilitários para teste/PoC. Um Terminal em memória que captura
 * writes de forma determinística (sem TTY) para snapshots e asserções de bytes.
 */

import type { ColorLevel } from '../ansi/index.js';
import type { Size } from '../frame/index.js';
import type { Terminal, TerminalCapabilities } from '../terminal/index.js';

export interface MockTerminal extends Terminal {
  /** Todos os chunks escritos, na ordem. */
  readonly writes: readonly string[];
  /** Último chunk escrito (o patch do frame). */
  readonly lastWrite: string;
  /** Concatenação de tudo. */
  output(): string;
  reset(): void;
  /** Injeta bytes no stdin simulado (dispara onData). */
  feed(bytes: string | Buffer): void;
  /** Simula um SIGWINCH com novo tamanho. */
  emitResize(size: Size): void;
}

export interface MockTerminalOptions {
  readonly size?: Size;
  readonly colors?: ColorLevel;
  readonly synchronizedOutput?: boolean;
}

export function createMockTerminal(options: MockTerminalOptions = {}): MockTerminal {
  let size = options.size ?? { cols: 80, rows: 24 };
  const writes: string[] = [];
  const dataCbs = new Set<(b: Buffer) => void>();
  const resizeCbs = new Set<(s: Size) => void>();
  const caps: TerminalCapabilities = {
    colors: options.colors ?? 'truecolor',
    unicode: true,
    mouse: true,
    synchronizedOutput: options.synchronizedOutput ?? true,
    isTTY: true,
  };

  return {
    caps,
    writes,
    get lastWrite() {
      return writes[writes.length - 1] ?? '';
    },
    output() {
      return writes.join('');
    },
    reset() {
      writes.length = 0;
    },
    feed(bytes) {
      const buf = typeof bytes === 'string' ? Buffer.from(bytes, 'utf8') : bytes;
      for (const cb of [...dataCbs]) cb(buf);
    },
    emitResize(next) {
      size = next;
      for (const cb of [...resizeCbs]) cb(next);
    },
    size() {
      return size;
    },
    write(bytes) {
      writes.push(bytes);
    },
    writeError() {},
    enterRawMode() {},
    exitRawMode() {},
    enterAltScreen() {},
    exitAltScreen() {},
    showCursor() {},
    enableMouse() {},
    onResize(cb) {
      resizeCbs.add(cb);
      return { dispose: () => resizeCbs.delete(cb) };
    },
    onData(cb) {
      dataCbs.add(cb);
      return { dispose: () => dataCbs.delete(cb) };
    },
    restore() {},
  };
}
