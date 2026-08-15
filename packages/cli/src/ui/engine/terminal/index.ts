/**
 * terminal — ÚNICA fronteira de I/O de baixo nível (ADR-0007). Ninguém mais
 * toca process.stdout/stdin. Detecta capacidades e faz raw mode/alt-screen.
 * (Fatia vertical / PoC: implementação real mínima.)
 */

import { closeSync, openSync } from 'node:fs';
import { ReadStream, WriteStream } from 'node:tty';

import type { ColorLevel } from '../ansi/index.js';
import { csi } from '../ansi/index.js';
import type { Disposable } from '../events/index.js';
import type { Size } from '../frame/index.js';

export type { ColorLevel } from '../ansi/index.js';

/** O par de streams em que a UI vai viver, e como devolvê-los. */
export interface TerminalStreams {
  readonly input: NodeJS.ReadStream;
  readonly output: NodeJS.WriteStream;
  /** true quando foi preciso abrir o terminal por fora dos fds herdados. */
  readonly fromControllingTerminal: boolean;
  /** Fecha o que abrimos; no-op quando são os fds padrão. */
  close(): void;
}

/**
 * Abre o terminal de controle do processo, ignorando os fds herdados.
 *
 * `/dev/tty` é o terminal ao qual o processo está ligado, independentemente do
 * que quem o invocou tenha feito com stdin e stdout. É o mecanismo que `fzf`,
 * `less` e o `git rebase -i` usam para continuar interativos dentro de um pipe;
 * no Windows, `CONIN$`/`CONOUT$` são o equivalente.
 *
 * Devolve null quando não há terminal nenhum — CI de verdade, um cron, um
 * contêiner sem tty —, e é isso que mantém o caminho headless funcionando onde
 * ele deve funcionar.
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

    // Sem isto a tela não reflui ao redimensionar a janela: o Node só liga o
    // SIGWINCH ao `process.stdout` que ele mesmo cria. `_refreshSize` é interno,
    // então o encadeamento opcional é proposital — sumindo, perde-se o reflow,
    // não a interface.
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
            /* já fechado */
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
 * Onde a UI deve ser desenhada.
 *
 * Os fds herdados vêm primeiro: quando os dois já são um terminal, não há o que
 * resolver. O resto existe por causa do `npx` — em POSIX ele executa o binário
 * através de um shell e o stdin do processo chega como pipe, o que fazia a CLI
 * concluir que ninguém podia responder e cair no modo texto. O terminal estava
 * lá o tempo todo; era o caminho até ele que tinha sumido.
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
 * Quantas cores este terminal aceita.
 *
 * Isto é o que decide se o gradiente do banner sai nos tons exatos do tema ou
 * quantizado — e a resposta precisa ser a mesma nas três plataformas, senão a
 * mesma CLI tem três aparências. `COLORTERM` sozinho não dá isso: o Windows
 * Terminal, o VS Code e o iTerm fazem 24 bits e não o definem, então cair no
 * `ansi16` do fim da função os trataria como terminais de 1990.
 *
 * A ordem é do mais explícito para o mais suposto: o que o usuário pediu
 * (NO_COLOR/FORCE_COLOR), o que o terminal declara, quem ele diz ser, e só
 * então o palpite pela plataforma.
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

  // O Windows Terminal e o console do Windows 10+ fazem 24 bits; nenhum dos
  // dois define COLORTERM ou TERM, então sem esta linha a CLI ficaria mais
  // pobre justamente onde ela foi desenvolvida.
  if (env['WT_SESSION'] !== undefined || env['ConEmuANSI'] === 'ON') return 'truecolor';

  const program = (env['TERM_PROGRAM'] ?? '').toLowerCase();
  if (TRUECOLOR_PROGRAMS.has(program)) return 'truecolor';
  if (TRUECOLOR_TERMS.some(known => term.includes(known))) return 'truecolor';

  // O Terminal.app do macOS anuncia xterm-256color e é honesto: 256 cores, sem
  // 24 bits. Cair no ramo genérico abaixo já daria isso, mas dizê-lo aqui
  // impede que uma regra futura sobre TERM o promova por engano.
  if (program === 'apple_terminal') return 'ansi256';

  if (term.includes('256')) return 'ansi256';

  // Windows sem nenhuma das pistas acima ainda é Windows 10 ou mais novo: o
  // Node 20, que a CLI exige, não roda em nada anterior.
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
