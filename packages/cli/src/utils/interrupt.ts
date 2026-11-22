/**
 * What happens when the user presses Ctrl+C (or the terminal closes) in the middle of a command.
 *
 * Work that leaves something behind — `create` writing a project directory — registers a cleanup here
 * for as long as it owns that something. On a signal the cleanups run to completion, then the process
 * exits with 130 (128 + SIGINT), the code shells and CI read as "interrupted". Without a registered
 * cleanup nothing is installed: Node's default behaviour, and the wizard's own handler, stay as they are.
 */

import { CliError } from '@cli/utils/errors.js';
import { logger } from '@cli/utils/logger.js';
import { spawnSync } from 'node:child_process';

export const INTERRUPTED_EXIT_CODE = 130;

const KEPT_MESSAGE = 'Interrupted. What was already written was kept: run the command again to finish.';

/** The run was interrupted; the work was undone as far as it could be. Exits with 130, quietly. */
export class InterruptedError extends CliError {
  constructor(message: string) {
    super(message, 'INTERRUPTED');
    this.name = 'InterruptedError';
  }

  /**
   * Prints the message, once per run: the signal handler and the unwinding code both want to, and either can be first.
   */
  announce(): void {
    if (announcedAny) return;
    announcedAny = true;
    logger.break();
    logger.error(this.message);
  }
}

export type Cleanup = () => Promise<void> | void;

/** How long the cleanups may take before the process leaves anyway. */
const CLEANUP_TIMEOUT_MS = 30_000;

const SIGNALS: readonly NodeJS.Signals[] =
  process.platform === 'win32' ? ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGBREAK'] : ['SIGINT', 'SIGTERM', 'SIGHUP'];

const cleanups = new Set<Cleanup>();
let interrupting = false;
let announcedAny = false;

/** A child process the CLI started and an interruption must stop. */
export type Running = { readonly pid?: number; kill?(signal?: NodeJS.Signals): unknown } & PromiseLike<unknown>;

const children = new Set<Running>();

/**
 * Registers a child process (the result of `execa(...)`) to be stopped on an interruption, and returns it.
 *
 * Ctrl+C reaches children through the terminal, but not reliably: on Windows `npm.cmd` stops at "Terminate
 * batch job (Y/N)?" and the install carries on in the background, rewriting the project after the CLI
 * said it was interrupted.
 */
export function track<T extends Running>(child: T): T {
  // Started after the signal (a step that was already on its way): it must not outlive the interruption.
  if (interrupting) terminate(child);
  children.add(child);
  const forget = (): void => void children.delete(child);
  child.then(forget, forget);
  return child;
}

/**
 * Stops a child and everything it started. On Windows `kill` ends only the process it spawned
 * (`npx` → `cmd` → `node` → the package manager survive), and a survivor keeps files open.
 */
export function terminate(child: Running): void {
  if (process.platform === 'win32' && child.pid) {
    spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
  } else {
    child.kill?.('SIGTERM');
  }
}

/** Whether an interruption is being handled right now. */
export function isInterrupting(): boolean {
  return interrupting;
}

/** Between two units of work: stop here, not three steps later, once the user has interrupted. */
export function throwIfInterrupted(): void {
  if (interrupting) throw new InterruptedError(KEPT_MESSAGE);
}

/**
 * How long the process gets to unwind by itself before it is made to leave. Exiting while a child
 * process or the terminal is still closing its handles aborts Node on Windows (`Assertion failed:
 * !(handle->flags & UV_HANDLE_CLOSING)`), so the code is set first and the loop gets a moment to drain.
 * The children are stopped and awaited before this point, so the moment can be short; the longer it is,
 * the more of the interrupted work keeps running.
 */
const GRACE_MS = 150;

/** Overridable in tests: what leaves the process once the cleanups are done. */
let leave: (code: number) => void = code => {
  process.exitCode = code;
  // unref'd: when everything has closed by itself the process is already gone and this never fires.
  setTimeout(() => process.exit(code), GRACE_MS).unref();
};

export function setInterruptExit(exit: (code: number) => void): () => void {
  const previous = leave;
  leave = exit;
  return () => {
    leave = previous;
  };
}

async function onSignal(): Promise<void> {
  // A second Ctrl+C while the first is still cleaning up means "stop waiting".
  if (interrupting) {
    leave(INTERRUPTED_EXIT_CODE);
    return;
  }
  interrupting = true;

  // First the children: nothing may keep writing while the cleanups remove or report.
  const running = [...children];
  for (const child of running) terminate(child);
  await Promise.allSettled(running);

  const timeout = new Promise<void>(resolve => setTimeout(resolve, CLEANUP_TIMEOUT_MS).unref());
  await Promise.race([Promise.allSettled([...cleanups].map(async cleanup => cleanup())), timeout]);

  new InterruptedError(KEPT_MESSAGE).announce();

  leave(INTERRUPTED_EXIT_CODE);
}

function attach(): void {
  for (const signal of SIGNALS) process.on(signal, onSignal);
}

function detach(): void {
  for (const signal of SIGNALS) process.off(signal, onSignal);
}

/**
 * Runs `cleanup` if the process is interrupted before the returned function is called. The cleanup
 * must be idempotent: the code it protects may be unwinding at the same time.
 */
export function onInterrupt(cleanup: Cleanup): () => void {
  if (cleanups.size === 0) attach();
  cleanups.add(cleanup);

  return () => {
    cleanups.delete(cleanup);
    if (cleanups.size === 0) {
      detach();
      interrupting = false;
      announcedAny = false;
    }
  };
}

/**
 * Whether the signal that explains a failure is on its way. Ctrl+C reaches the child processes and the CLI
 * at the same moment, and the child's death can be reported first: a failure that arrives just before
 * the signal is the interruption, not a second event.
 */
export async function interruptedSoon(graceMs = 250): Promise<boolean> {
  if (interrupting) return true;
  await new Promise(resolve => setTimeout(resolve, graceMs));
  return interrupting;
}
