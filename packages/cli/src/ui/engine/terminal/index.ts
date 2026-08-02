/**
 * terminal — ÚNICA fronteira de I/O de baixo nível (ADR-0007). Ninguém mais
 * toca process.stdout/stdin. Detecta capacidades e faz raw mode/alt-screen.
 * (Fatia vertical / PoC: implementação real mínima.)
 */

import type { ColorLevel } from '../ansi/index.js';
import { csi } from '../ansi/index.js';
import type { Disposable } from '../events/index.js';
import type { Size } from '../frame/index.js';

export type { ColorLevel } from '../ansi/index.js';

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

function detectColor(out: NodeJS.WriteStream, force?: ColorLevel): ColorLevel {
  if (force) return force;
  const env = process.env;
  if (env['NO_COLOR'] !== undefined) return 'none';
  if (!out.isTTY) return 'none';
  const ct = (env['COLORTERM'] ?? '').toLowerCase();
  if (ct.includes('truecolor') || ct.includes('24bit')) return 'truecolor';
  const term = (env['TERM'] ?? '').toLowerCase();
  if (term.includes('256')) return 'ansi256';
  return 'ansi16';
}

export function createTerminal(options: TerminalOptions = {}): Terminal {
  const out = options.stdout ?? process.stdout;
  const inp = options.stdin ?? process.stdin;

  const caps: TerminalCapabilities = {
    colors: detectColor(out, options.forceColor),
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
        // O `resume()` de enterRawMode segura uma referência viva no event
        // loop. Sem devolver o stdin ao estado pausado, o processo continua
        // rodando depois que o wizard termina: a tela cai, o resumo aparece e
        // o shell nunca volta — parece que o enter final não fez nada.
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
      // O reset de atributos vem primeiro, e antes de sair do alt-screen: o
      // último frame quase sempre termina no meio de uma cor, e sem zerar o SGR
      // esse atributo continua valendo no buffer principal — o shell do usuário
      // fica escrevendo colorido depois que a CLI já saiu.
      out.write('\x1b[0m');
      this.showCursor(true);
      this.enableMouse(false);
      this.exitAltScreen();
      this.exitRawMode();
    },
  };
}
