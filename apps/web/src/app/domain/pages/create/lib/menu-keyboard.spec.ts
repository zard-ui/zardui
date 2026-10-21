import { MenuKeyboard } from './menu-keyboard';

function setup(labels: string[]) {
  const menu = document.createElement('div');
  const items = labels.map(label => {
    const button = document.createElement('button');
    button.textContent = label;
    menu.appendChild(button);
    return button;
  });
  document.body.appendChild(menu);

  const close = jest.fn();
  const keyboard = new MenuKeyboard(() => document.activeElement, close);
  const press = (key: string): KeyboardEvent => {
    const event = new KeyboardEvent('keydown', { key, cancelable: true });
    keyboard.handle(event, items);
    return event;
  };
  return { menu, items, close, press, keyboard };
}

describe('MenuKeyboard', () => {
  afterEach(() => {
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it('moves with the arrows and wraps', () => {
    const { items, press } = setup(['Inter', 'Manrope', 'Lora']);

    press('ArrowDown');
    expect(document.activeElement).toBe(items[0]);
    press('ArrowUp');
    expect(document.activeElement).toBe(items[2]);
    press('ArrowDown');
    expect(document.activeElement).toBe(items[0]);
  });

  it('jumps with Home and End', () => {
    const { items, press } = setup(['Inter', 'Manrope', 'Lora']);

    press('End');
    expect(document.activeElement).toBe(items[2]);
    press('Home');
    expect(document.activeElement).toBe(items[0]);
  });

  it('closes on Tab and keeps the focus where it was', () => {
    const { close, press } = setup(['Inter']);

    const event = press('Tab');

    expect(close).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);
  });

  it('types ahead, and cycles on a repeated letter', () => {
    const { items, press } = setup(['Inter', 'Manrope', 'Montserrat', 'Lora']);

    press('m');
    expect(document.activeElement).toBe(items[1]);
    // The same letter again moves on to the next match.
    jest.useFakeTimers();
    press('m');
    expect(document.activeElement).toBe(items[2]);
  });

  it('matches several letters typed together, and forgets them after a pause', () => {
    jest.useFakeTimers();
    const { items, press } = setup(['Inter', 'Manrope', 'Montserrat', 'Lora']);

    press('m');
    press('o');
    expect(document.activeElement).toBe(items[2]);

    jest.advanceTimersByTime(1100);
    press('l');
    expect(document.activeElement).toBe(items[3]);
  });

  it('ignores letters typed with a modifier', () => {
    const { press, keyboard, items } = setup(['Inter']);
    const event = new KeyboardEvent('keydown', { key: 'i', ctrlKey: true, cancelable: true });

    expect(keyboard.handle(event, items)).toBe(false);
    press('x');
  });
});
