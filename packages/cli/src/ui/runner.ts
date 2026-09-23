/**
 * Runner — the bridge between the engine's frame loop and the CLI's async flow.
 *
 * Commands are sequential (`const config = await promptForConfig(...)`), while
 * the engine is an event-driven render loop. The runner reconciles the two: it
 * mounts the screen, hands control to `onKey`/`run`, and resolves a Promise when
 * the flow calls `done()`.
 *
 * Three invariants hold for every wizard:
 *   1. the terminal is restored on every exit path — errors, SIGINT and a
 *      process crash included;
 *   2. with no TTY the screen is never mounted: the caller gets a
 *      NonInteractiveError and follows the headless path;
 *   3. whatever the logger would write during the mount is held in the sink and
 *      re-emitted afterwards, so the frame is not torn.
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

/** Signals that the command has to carry on without an interactive UI (CI, pipe, --yes). */
export class NonInteractiveError extends Error {
  constructor(message = 'This terminal is not interactive.') {
    super(message);
    this.name = 'NonInteractiveError';
  }
}

/** The user abandoned the wizard (Ctrl+C, or a step that cancels the flow). */
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
  /** Access to the screen, for cases that need the scheduler or the capabilities. */
  readonly screen: Screen;
}

export interface WizardOptions<T> {
  /** Pure view, rebuilt every frame. */
  view: () => Node;
  /** Keys the view handles on its own. */
  onKey?: (event: KeyEvent, ctx: WizardContext<T>) => void;
  /**
   * Async work run with the screen alive — installing packages, writing files.
   * The UI keeps animating until the promise resolves.
   */
  run?: (ctx: WizardContext<T>) => Promise<void> | void;
  fps?: number;
  /** How to find the terminal. Injectable for tests; the default resolves it itself. */
  resolveStreams?: () => TerminalStreams | null;
}

export interface WizardResult<T> {
  readonly value: T;
  /** Mensagens que o logger reteve enquanto a tela estava montada. */
  readonly logs: readonly LogRecord[];
}

/**
 * True when there is a terminal to mount the screen on.
 *
 * Looking at `process.stdout.isTTY && process.stdin.isTTY` is not enough: that
 * is what made `npx zard-cli init` fall back to text mode on macOS and Linux,
 * where npm runs the binary through a shell and hands over stdin as a pipe. The
 * controlling terminal is still reachable, and it is what decides.
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
    // Teardown is ours: we intercept Ctrl+C to end the wizard with a message,
    // instead of killing the process from inside the engine.
    handleExitSignals: false,
  });

  let settled = false;
  let teardownDone = false;

  const teardown = (): void => {
    if (teardownDone) return;
    teardownDone = true;
    screen.unmount();
    // After the unmount: that is what returns the terminal to its normal state,
    // and closing the streams first would leave the alt-screen and raw mode on.
    streams.close();
    process.off('exit', teardown);
    process.off('SIGINT', onSignal);
    process.off('SIGTERM', onSignal);
  };

  // Safety net: if the process dies with the screen mounted, the terminal still
  // returns to normal (cursor visible, no raw mode, out of the alt-screen).
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
    // Last chance to show what was held: the screen is already down and whoever
    // handles the error above will only see the exception's message.
    flushRecords(endCapture());
    throw error;
  } finally {
    teardown();
  }
}
