/**
 * Editing a single line in a wizard field.
 *
 * The field only accepted typing at the end and deleting backwards: anyone who
 * wanted to change the middle of an alias pressed the arrow keys, saw nothing
 * happen, and was left with no option but to delete everything and retype it.
 */

import type { KeyEvent } from '@cli/ui/engine/index.js';
import { editInput, startInput, type TextInput } from '@cli/ui/text-input.js';

const press = (key: string, modifiers: Partial<KeyEvent> = {}): KeyEvent => ({
  key,
  ctrl: false,
  alt: false,
  shift: false,
  raw: key,
  ...modifiers,
});

/** Applies a sequence of keys, failing if any of them is not an editing key. */
function type(state: TextInput, keys: (string | KeyEvent)[]): TextInput {
  return keys.reduce<TextInput>((current, key) => {
    const event = typeof key === 'string' ? press(key) : key;
    return editInput(current, event) ?? current;
  }, state);
}

describe('startInput', () => {
  it('should put the caret at the end of the suggestion', () => {
    expect(startInput('@/shared/components')).toEqual({
      value: '@/shared/components',
      caret: 19,
      pristine: true,
    });
  });
});

describe('editInput', () => {
  // Someone who already knows what they want types straight over the CLI's suggestion.
  it('should replace the untouched suggestion on the first keystroke', () => {
    const result = type(startInput('@/shared/components'), ['@']);

    expect(result).toEqual({ value: '@', caret: 1, pristine: false });
  });

  it('should insert at the caret once the field has been touched', () => {
    const result = type(startInput('abc'), ['x', 'y']);

    expect(result.value).toBe('xy');
  });

  /**
   * The case that prompted all of this: swapping `@/shared/...` for
   * `@app/shared/...` without losing the rest of the path.
   */
  it('should let the caret walk back and edit the middle', () => {
    const start = startInput('@/shared/components');
    const atStart = type(start, [press('home')]);
    const afterAt = type(atStart, [press('right')]);
    const result = type(afterAt, [press('delete'), 'a', 'p', 'p', '/']);

    expect(result.value).toBe('@app/shared/components');
  });

  it('should move the caret with the arrow keys', () => {
    const result = type(startInput('abc'), [press('left'), press('left')]);

    expect(result.caret).toBe(1);
    expect(type(result, [press('right')]).caret).toBe(2);
  });

  it('should stop the caret at both ends', () => {
    expect(type(startInput('ab'), [press('left'), press('left'), press('left')]).caret).toBe(0);
    expect(type(startInput('ab'), [press('end'), press('right')]).caret).toBe(2);
  });

  it('should delete backwards and forwards from the caret', () => {
    const middle = type(startInput('abcd'), [press('left'), press('left')]);

    expect(type(middle, [press('backspace')]).value).toBe('acd');
    expect(type(middle, [press('delete')]).value).toBe('abd');
  });

  // Backspace adopts the suggested value and edits it, instead of clearing it.
  it('should edit the suggestion on backspace instead of clearing it', () => {
    const result = type(startInput('@/shared/components'), [press('backspace'), press('backspace')]);

    expect(result.value).toBe('@/shared/componen');
  });

  it('should jump to either end with home and end', () => {
    const start = startInput('abc');

    expect(type(start, [press('home')]).caret).toBe(0);
    expect(type(type(start, [press('home')]), [press('end')]).caret).toBe(3);
  });

  describe('atalhos de linha', () => {
    const ctrl = (key: string) => press(key, { ctrl: true });

    it('should clear to the start with ctrl+u and to the end with ctrl+k', () => {
      const middle = type(startInput('abcdef'), [press('left'), press('left')]);

      expect(type(middle, [ctrl('u')]).value).toBe('ef');
      expect(type(middle, [ctrl('k')]).value).toBe('abcd');
    });

    it('should delete the previous word with ctrl+w', () => {
      expect(type(startInput('@/shared/components'), [ctrl('w')]).value).toBe('@/shared/');
      expect(type(startInput('@/shared/'), [ctrl('w')]).value).toBe('@/');
    });

    it('should jump to either end with ctrl+a and ctrl+e', () => {
      expect(type(startInput('abc'), [ctrl('a')]).caret).toBe(0);
      expect(type(startInput('abc'), [ctrl('a'), ctrl('e')]).caret).toBe(3);
    });
  });

  // enter and escape belong to the wizard's flow, not to the field.
  it('should refuse the keys the wizard owns', () => {
    expect(editInput(startInput('abc'), press('enter'))).toBeNull();
    expect(editInput(startInput('abc'), press('escape'))).toBeNull();
    expect(editInput(startInput('abc'), press('up'))).toBeNull();
    expect(editInput(startInput('abc'), press('x', { alt: true }))).toBeNull();
  });

  it('should treat a character as one unit even outside ASCII', () => {
    const result = type(startInput('日本'), [press('left'), press('backspace')]);

    expect(result.value).toBe('本');
  });
});
