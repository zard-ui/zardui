/**
 * Runner — a ponte entre o loop de frames da engine e o fluxo async da CLI.
 *
 * Os comandos são sequenciais (`const config = await promptForConfig(...)`),
 * enquanto a engine é um laço de render dirigido por eventos. O runner concilia
 * os dois: monta a tela, entrega o controle ao `onKey`/`run` e resolve uma
 * Promise quando o fluxo chama `done()`.
 *
 * Três invariantes valem para qualquer wizard:
 *   1. o terminal é restaurado em todos os caminhos de saída — inclusive erro,
 *      SIGINT e crash do processo;
 *   2. sem TTY a tela nunca é montada: quem chamou recebe NonInteractiveError e
 *      segue pelo caminho headless;
 *   3. o que o logger escreveria durante a montagem fica retido no sink e é
 *      reemitido depois, para não rasgar o frame.
 */

import {
  createScreen,
  createTerminal,
  resolveTerminalStreams,
  type KeyEvent,
  type Node,
  type Screen,
  type TerminalStreams,
} from './engine/index.js';
import { beginCapture, endCapture, type LogRecord } from './log-sink.js';
import { flushRecords } from './output.js';
import { zardTheme } from './theme.js';

/** Sinaliza que o comando precisa seguir sem UI interativa (CI, pipe, --yes). */
export class NonInteractiveError extends Error {
  constructor(message = 'This terminal is not interactive.') {
    super(message);
    this.name = 'NonInteractiveError';
  }
}

/** O usuário abandonou o wizard (Ctrl+C ou um passo que cancela o fluxo). */
export class WizardCancelledError extends Error {
  constructor(message = 'Operation cancelled.') {
    super(message);
    this.name = 'WizardCancelledError';
  }
}

export interface WizardContext<T> {
  /** Encerra a tela e resolve o wizard com este valor. */
  done(value: T): void;
  /** Encerra a tela e rejeita com WizardCancelledError. */
  cancel(message?: string): void;
  /** Agenda um novo frame depois de alterar o estado. */
  refresh(): void;
  /** Acesso à tela para casos que precisam do scheduler ou das capacidades. */
  readonly screen: Screen;
}

export interface WizardOptions<T> {
  /** View pura reconstruída a cada frame. */
  view: () => Node;
  /** Teclas que a view trata por conta própria. */
  onKey?: (event: KeyEvent, ctx: WizardContext<T>) => void;
  /**
   * Trabalho assíncrono executado com a tela viva — instalar pacotes, escrever
   * arquivos. A UI continua animando enquanto a promise não resolve.
   */
  run?: (ctx: WizardContext<T>) => Promise<void> | void;
  fps?: number;
  /** Como achar o terminal. Injetável para teste; o padrão resolve sozinho. */
  resolveStreams?: () => TerminalStreams | null;
}

export interface WizardResult<T> {
  readonly value: T;
  /** Mensagens que o logger reteve enquanto a tela estava montada. */
  readonly logs: readonly LogRecord[];
}

/**
 * true quando existe um terminal onde montar a tela.
 *
 * Não basta olhar `process.stdout.isTTY && process.stdin.isTTY`: era isso que
 * fazia `npx zard-cli init` sair em modo texto no macOS e no Linux, onde o npm
 * executa o binário por um shell e entrega o stdin como pipe. O terminal de
 * controle continua alcançável, e é ele que decide.
 */
export function isInteractive(resolve: () => TerminalStreams | null = resolveTerminalStreams): boolean {
  const streams = resolve();
  if (!streams) return false;

  streams.close();
  return true;
}

export async function runWizard<T>(options: WizardOptions<T>): Promise<WizardResult<T>> {
  const streams = (options.resolveStreams ?? resolveTerminalStreams)();
  if (!streams) throw new NonInteractiveError();

  const screen = createScreen({
    theme: zardTheme,
    fps: options.fps ?? 30,
    terminal: createTerminal({ stdin: streams.input, stdout: streams.output }),
    // O teardown é nosso: interceptamos Ctrl+C para encerrar o wizard com uma
    // mensagem, em vez de matar o processo direto de dentro da engine.
    handleExitSignals: false,
  });

  let settled = false;
  let teardownDone = false;

  const teardown = (): void => {
    if (teardownDone) return;
    teardownDone = true;
    screen.unmount();
    // Depois do unmount: é ele que devolve o terminal ao estado normal, e
    // fechar os streams antes deixaria o alt-screen e o raw mode ligados.
    streams.close();
    process.off('exit', teardown);
    process.off('SIGINT', onSignal);
    process.off('SIGTERM', onSignal);
  };

  // Rede de segurança: se o processo morrer com a tela montada, o terminal
  // ainda volta ao normal (cursor visível, sem raw mode, fora do alt-screen).
  function onSignal(): void {
    teardown();
    process.exit(130);
  }
  process.on('exit', teardown);
  process.on('SIGINT', onSignal);
  process.on('SIGTERM', onSignal);

  beginCapture();

  try {
    const value = await new Promise<T>((resolve, reject) => {
      const settle = (fn: () => void): void => {
        if (settled) return;
        settled = true;
        teardown();
        fn();
      };

      const ctx: WizardContext<T> = {
        done: v => settle(() => resolve(v)),
        cancel: message => settle(() => reject(new WizardCancelledError(message))),
        refresh: () => screen.scheduler.requestRender(),
        screen,
      };

      screen.setView(options.view);
      screen.onKey(event => {
        if (settled) return;
        if (event.ctrl && (event.key === 'c' || event.key === 'd')) {
          ctx.cancel();
          return;
        }
        options.onKey?.(event, ctx);
      });

      screen.mount();

      if (options.run) {
        void (async () => {
          try {
            await options.run?.(ctx);
          } catch (error) {
            settle(() => reject(error));
          }
        })();
      }
    });

    return { value, logs: endCapture() };
  } catch (error) {
    // Última chance de mostrar o que foi retido: a tela já caiu e quem trata o
    // erro acima só verá a mensagem da exceção.
    flushRecords(endCapture());
    throw error;
  } finally {
    teardown();
  }
}
