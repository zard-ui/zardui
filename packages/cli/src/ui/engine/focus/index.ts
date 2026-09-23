/**
 * focus — focus management as RETAINED STATE, keyed by a stable component
 * identity. Tab order and keyboard routing.
 */

import { createEmitter, type Disposable } from '../events/index.js';
import type { KeyEvent } from '../input/index.js';

export interface Focusable {
  readonly key: string;
  readonly tabIndex: number;
  readonly disabled?: boolean;
  onKey?(e: KeyEvent): boolean;
}

export interface FocusManager {
  register(entry: Focusable): Disposable;
  focus(key: string): void;
  focusNext(): void;
  focusPrev(): void;
  blur(): void;
  isFocused(key: string): boolean;
  readonly activeKey: string | undefined;
  onChange(cb: (key: string | undefined) => void): Disposable;
  routeKey(e: KeyEvent): boolean;
}

export function createFocusManager(): FocusManager {
  const entries: Focusable[] = [];
  const changed = createEmitter<string | undefined>();
  let activeKey: string | undefined;

  const eligible = (): Focusable[] =>
    entries.filter(e => !e.disabled && e.tabIndex >= 0).sort((a, b) => a.tabIndex - b.tabIndex);

  const setActive = (key: string | undefined): void => {
    if (key === activeKey) return;
    activeKey = key;
    changed.emit(key);
  };

  const move = (delta: number): void => {
    const ring = eligible();
    if (ring.length === 0) {
      setActive(undefined);
      return;
    }
    const idx = ring.findIndex(e => e.key === activeKey);
    const next = idx < 0 ? (delta > 0 ? 0 : ring.length - 1) : (idx + delta + ring.length) % ring.length;
    setActive(ring[next]!.key);
  };

  return {
    register(entry) {
      entries.push(entry);
      if (activeKey === undefined && !entry.disabled && entry.tabIndex >= 0) setActive(entry.key);
      return {
        dispose: () => {
          const i = entries.indexOf(entry);
          if (i >= 0) entries.splice(i, 1);
        },
      };
    },
    focus(key) {
      if (entries.some(e => e.key === key)) setActive(key);
    },
    focusNext() {
      move(1);
    },
    focusPrev() {
      move(-1);
    },
    blur() {
      setActive(undefined);
    },
    isFocused(key) {
      return activeKey === key;
    },
    get activeKey() {
      return activeKey;
    },
    onChange(cb) {
      return changed.on(cb);
    },
    routeKey(e) {
      const active = entries.find(x => x.key === activeKey);
      if (active?.onKey?.(e)) return true;
      if (e.key === 'tab') {
        if (e.shift) this.focusPrev();
        else this.focusNext();
        return true;
      }
      return false;
    },
  };
}
