/**
 * Gate — lets an async flow wait for an answer from the keyboard.
 *
 * Linear wizards (choose → resolve → confirm → install) read far better written
 * as one async function than as a state machine inside `onKey`. The gate is the
 * missing piece: the flow awaits `wait()`, and the key handler calls `settle()`
 * when the user decides.
 */

export interface Gate<T> {
  wait(): Promise<T>;
  /** Delivers the answer. Later calls are ignored. */
  settle(value: T): void;
  /** Interrompe quem espera, propagando o erro. */
  fail(error: unknown): void;
  /** True while somebody is waiting for an answer. */
  readonly pending: boolean;
}

export function createGate<T>(): Gate<T> {
  let resolveFn: ((value: T) => void) | null = null;
  let rejectFn: ((error: unknown) => void) | null = null;

  return {
    wait() {
      return new Promise<T>((resolve, reject) => {
        resolveFn = resolve;
        rejectFn = reject;
      });
    },
    settle(value) {
      const resolve = resolveFn;
      resolveFn = null;
      rejectFn = null;
      resolve?.(value);
    },
    fail(error) {
      const reject = rejectFn;
      resolveFn = null;
      rejectFn = null;
      reject?.(error);
    },
    get pending() {
      return resolveFn !== null;
    },
  };
}
