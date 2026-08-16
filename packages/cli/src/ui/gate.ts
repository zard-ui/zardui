/**
 * Gate — deixa um fluxo async esperar por uma resposta do teclado.
 *
 * Wizards lineares (escolher → resolver → confirmar → instalar) ficam muito
 * mais legíveis escritos como uma função async do que como uma máquina de
 * estados no `onKey`. O gate é a peça que falta: o fluxo aguarda `wait()`, o
 * handler de teclado chama `settle()` quando o usuário decide.
 */

export interface Gate<T> {
  wait(): Promise<T>;
  /** Entrega a resposta. Chamadas seguintes são ignoradas. */
  settle(value: T): void;
  /** Interrompe quem espera, propagando o erro. */
  fail(error: unknown): void;
  /** true enquanto alguém aguarda uma resposta. */
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
