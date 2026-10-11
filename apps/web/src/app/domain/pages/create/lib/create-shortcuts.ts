import type { CreateAction } from './create.protocol';

export interface KeyLike {
  readonly key: string;
  readonly metaKey: boolean;
  readonly ctrlKey: boolean;
  readonly shiftKey: boolean;
  readonly altKey: boolean;
  readonly target?: EventTarget | null;
}

/** Typing into a field owns the keyboard: single-key shortcuts must not fire there. */
export function isEditableTarget(target: EventTarget | null | undefined): boolean {
  const element = target as HTMLElement | null | undefined;
  if (!element || typeof element !== 'object' || !('tagName' in element)) return false;

  const tag = element.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || element.isContentEditable === true;
}

/**
 * The action a key press asks for, or `null`.
 *
 * R shuffles, ⇧R resets, D toggles dark, O opens a preset, ⌘/Ctrl+P (or K) navigates, ⌘/Ctrl+Z undoes,
 * ⇧⌘Z or Ctrl+Y redoes. Undo and redo stay out of text fields so the browser's own undo keeps working.
 */
export function shortcutAction(event: KeyLike): CreateAction | null {
  const key = event.key.toLowerCase();
  const mod = event.metaKey || event.ctrlKey;
  const editable = isEditableTarget(event.target);

  if (mod && !event.altKey) {
    if (key === 'p' || key === 'k') return 'navigate';
    if (editable) return null;
    if (key === 'z') return event.shiftKey ? 'redo' : 'undo';
    if (key === 'y' && event.ctrlKey) return 'redo';
    return null;
  }

  if (editable || event.altKey) return null;

  if (key === 'r') return event.shiftKey ? 'reset' : 'shuffle';
  if (event.shiftKey) return null;
  if (key === 'd') return 'toggle-dark';
  if (key === 'o') return 'open-preset';
  return null;
}

export function isApplePlatform(platform: string): boolean {
  return /Mac|iPhone|iPad|iPod/.test(platform);
}
