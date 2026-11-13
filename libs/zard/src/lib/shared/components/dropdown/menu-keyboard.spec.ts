import { bindMenuPointer } from './menu-keyboard';

describe('bindMenuPointer', () => {
  let surface: HTMLElement;
  let rows: HTMLElement[];
  let outside: HTMLElement;
  let onHighlight: jest.Mock<void, [number]>;
  let unbind: () => void;

  function row(tag: string, attrs: Record<string, string> = {}): HTMLElement {
    const element = document.createElement(tag);
    element.tabIndex = -1;
    Object.entries(attrs).forEach(([name, value]) => element.setAttribute(name, value));
    surface.appendChild(element);
    return element;
  }

  const move = (target: HTMLElement) => target.dispatchEvent(new PointerEvent('pointermove', { bubbles: true }));
  const leave = (target: HTMLElement, relatedTarget: HTMLElement | null) =>
    target.dispatchEvent(new PointerEvent('pointerout', { bubbles: true, relatedTarget }));

  beforeEach(() => {
    surface = document.createElement('div');
    surface.setAttribute('role', 'menu');
    surface.tabIndex = -1;
    document.body.appendChild(surface);

    rows = [
      row('z-dropdown-menu-item'),
      row('z-dropdown-menu-item', { 'data-disabled': '' }),
      row('z-dropdown-menu-sub-trigger'),
      row('z-dropdown-menu-item'),
    ];
    outside = document.createElement('button');
    document.body.appendChild(outside);

    onHighlight = jest.fn();
    unbind = bindMenuPointer(surface, onHighlight);
  });

  afterEach(() => {
    unbind();
    surface.remove();
    outside.remove();
  });

  it('reports the hovered row by its index among the enabled rows', () => {
    move(rows[3]);

    // The disabled row is not a stop, so the last row is the third one.
    expect(onHighlight).toHaveBeenCalledWith(2);
  });

  it('ignores a disabled row', () => {
    move(rows[1]);

    expect(onHighlight).not.toHaveBeenCalled();
  });

  it('does not report the row that already has the focus again', () => {
    rows[0].focus();
    move(rows[0]);

    expect(onHighlight).not.toHaveBeenCalled();
  });

  it('hands the focus back to the surface when the pointer leaves a focused row', () => {
    rows[0].focus();
    rows[0].dataset['highlighted'] = '';

    leave(rows[0], outside);

    expect(document.activeElement).toBe(surface);
    expect(rows[0].dataset['highlighted']).toBeUndefined();
    expect(onHighlight).toHaveBeenLastCalledWith(-1);
  });

  it('keeps the highlight when the pointer only moves inside the row', () => {
    const label = document.createElement('span');
    rows[0].appendChild(label);
    rows[0].focus();

    leave(rows[0], label);

    expect(document.activeElement).toBe(rows[0]);
    expect(onHighlight).not.toHaveBeenCalled();
  });

  it('keeps a sub-trigger lit while its submenu is open', () => {
    rows[2].setAttribute('aria-expanded', 'true');
    rows[2].focus();

    leave(rows[2], outside);

    expect(document.activeElement).toBe(rows[2]);
    expect(onHighlight).not.toHaveBeenCalled();
  });

  it('stops listening once unbound', () => {
    unbind();
    move(rows[0]);

    expect(onHighlight).not.toHaveBeenCalled();
  });
});
