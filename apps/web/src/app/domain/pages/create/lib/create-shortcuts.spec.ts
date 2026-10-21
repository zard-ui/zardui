import { shortcutAction, type KeyLike } from './create-shortcuts';

const key = (name: string, extra: Partial<KeyLike> = {}): KeyLike => ({
  key: name,
  metaKey: false,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
  ...extra,
});

describe('shortcutAction', () => {
  it.each([
    ['r', {}, 'shuffle'],
    ['R', { shiftKey: true }, 'reset'],
    ['d', {}, 'toggle-dark'],
    ['o', {}, 'open-preset'],
    ['p', { metaKey: true }, 'navigate'],
    ['p', { ctrlKey: true }, 'navigate'],
    ['z', { metaKey: true }, 'undo'],
    ['z', { ctrlKey: true, shiftKey: true }, 'redo'],
    ['y', { ctrlKey: true }, 'redo'],
  ] as const)('%s with %j asks for %s', (name, extra, action) => {
    expect(shortcutAction(key(name, extra))).toBe(action);
  });

  it('ignores keys that mean nothing', () => {
    expect(shortcutAction(key('x'))).toBeNull();
    expect(shortcutAction(key('d', { shiftKey: true }))).toBeNull();
    expect(shortcutAction(key('r', { altKey: true }))).toBeNull();
  });

  it('leaves typing alone, but still lets the palette open', () => {
    const input = document.createElement('input');

    expect(shortcutAction(key('r', { target: input }))).toBeNull();
    expect(shortcutAction(key('z', { metaKey: true, target: input }))).toBeNull();
    expect(shortcutAction(key('p', { metaKey: true, target: input }))).toBe('navigate');
  });

  it('leaves an open menu alone: its letters are type-ahead, not shortcuts', () => {
    const menu = document.createElement('div');
    menu.setAttribute('role', 'menu');
    const item = document.createElement('button');
    menu.appendChild(item);

    expect(shortcutAction(key('r', { target: item }))).toBeNull();
    expect(shortcutAction(key('d', { target: menu }))).toBeNull();
    expect(shortcutAction(key('z', { metaKey: true, target: item }))).toBeNull();
    expect(shortcutAction(key('p', { metaKey: true, target: item }))).toBe('navigate');
  });
});
