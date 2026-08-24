/**
 * events — typed event primitives. The basis of input/focus/scheduler.
 * No dependencies. No I/O.
 */

export interface Disposable {
  dispose(): void;
}

export interface EventEmitter<T> {
  on(listener: (payload: T) => void): Disposable;
  once(listener: (payload: T) => void): Disposable;
  emit(payload: T): void;
  clear(): void;
  readonly size: number;
}

export function createEmitter<T>(): EventEmitter<T> {
  const listeners = new Set<(payload: T) => void>();
  return {
    on(listener) {
      listeners.add(listener);
      return { dispose: () => listeners.delete(listener) };
    },
    once(listener) {
      const wrap = (payload: T): void => {
        listeners.delete(wrap);
        listener(payload);
      };
      listeners.add(wrap);
      return { dispose: () => listeners.delete(wrap) };
    },
    emit(payload) {
      // iterate over a copy: listeners may remove themselves during the emit
      for (const l of [...listeners]) l(payload);
    },
    clear() {
      listeners.clear();
    },
    get size() {
      return listeners.size;
    },
  };
}

export interface Signal<T> {
  get(): T;
  set(value: T): void;
  update(fn: (prev: T) => T): void;
  subscribe(listener: (value: T) => void): Disposable;
}

export function signal<T>(initial: T): Signal<T> {
  let value = initial;
  const emitter = createEmitter<T>();
  return {
    get: () => value,
    set(next) {
      if (Object.is(next, value)) return;
      value = next;
      emitter.emit(value);
    },
    update(fn) {
      this.set(fn(value));
    },
    subscribe(listener) {
      return emitter.on(listener);
    },
  };
}

export function combine(...disposables: Disposable[]): Disposable {
  return {
    dispose() {
      for (const d of disposables) d.dispose();
    },
  };
}
