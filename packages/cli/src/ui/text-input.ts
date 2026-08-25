/**
 * Editing a single line of text in a wizard field.
 *
 * The field accepted exactly two things — typing at the end and deleting
 * backwards. Anyone who wanted to change the middle of an alias
 * (`@/shared/components` to `@app/shared/components`) pressed the arrow keys,
 * saw nothing happen, and was left with no option but to delete everything and
 * retype it. Here the cursor is real: it moves, inserts in the middle, and
 * deletes in both directions.
 */

import type { KeyEvent } from '@cli/ui/engine/index.js';

export interface TextInput {
  readonly value: string;
  /** Cursor position, in characters — never outside `[0, length]`. */
  readonly caret: number;
  /**
   * True while the field still shows the suggestion and the user has not touched
   * it: the first key typed replaces the whole suggestion instead of appending
   * to it. Moving the cursor or deleting adopts the value and starts editing it.
   */
  readonly pristine: boolean;
}

export function startInput(value: string): TextInput {
  return { value, caret: [...value].length, pristine: true };
}

/**
 * Applies one key to the field.
 *
 * Returns `null` when the key is not an editing key — `enter` and `escape`
 * belong to the wizard's flow, and it decides what to do with them.
 */
export function editInput(state: TextInput, event: KeyEvent): TextInput | null {
  const chars = [...state.value];
  const caret = clamp(state.caret, chars.length);

  if (event.ctrl) return editWithControl(state, chars, caret, event.key);
  if (event.alt) return null;

  if (event.key.length === 1) {
    // The whole suggestion goes on the first key: someone who already knows what
    // they want types straight over it, rather than deleting the CLI's proposal
    // one character at a time.
    if (state.pristine) return { value: event.key, caret: 1, pristine: false };

    chars.splice(caret, 0, event.key);
    return { value: chars.join(''), caret: caret + 1, pristine: false };
  }

  switch (event.key) {
    case 'backspace':
      if (caret === 0) return { ...state, caret, pristine: false };
      chars.splice(caret - 1, 1);
      return { value: chars.join(''), caret: caret - 1, pristine: false };

    case 'delete':
      if (caret >= chars.length) return { ...state, caret, pristine: false };
      chars.splice(caret, 1);
      return { value: chars.join(''), caret, pristine: false };

    case 'left':
      return { ...state, caret: Math.max(0, caret - 1), pristine: false };

    case 'right':
      return { ...state, caret: Math.min(chars.length, caret + 1), pristine: false };

    case 'home':
      return { ...state, caret: 0, pristine: false };

    case 'end':
      return { ...state, caret: chars.length, pristine: false };

    default:
      return null;
  }
}

/** Os atalhos de linha que qualquer shell oferece. */
function editWithControl(state: TextInput, chars: string[], caret: number, key: string): TextInput | null {
  switch (key) {
    case 'u': // clear to the start
      return { value: chars.slice(caret).join(''), caret: 0, pristine: false };

    case 'k': // clear to the end
      return { value: chars.slice(0, caret).join(''), caret, pristine: false };

    case 'w': {
      // apaga a palavra anterior, incluindo os separadores que a antecedem
      let start = caret;
      while (start > 0 && isSeparator(chars[start - 1] as string)) start--;
      while (start > 0 && !isSeparator(chars[start - 1] as string)) start--;

      return { value: [...chars.slice(0, start), ...chars.slice(caret)].join(''), caret: start, pristine: false };
    }

    case 'a':
      return { ...state, caret: 0, pristine: false };

    case 'e':
      return { ...state, caret: chars.length, pristine: false };

    default:
      return null;
  }
}

function isSeparator(char: string): boolean {
  return char === ' ' || char === '/' || char === '\\' || char === '.' || char === '-';
}

function clamp(caret: number, length: number): number {
  return Math.max(0, Math.min(caret, length));
}
