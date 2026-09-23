import { isTopmostOverlay, openOverlayCount, popOverlay, pushOverlay } from './overlay-stack';

describe('overlay stack', () => {
  let opened: object[] = [];

  /** Stands in for a dialog / sheet / drawer ref — the stack compares by identity. */
  function open(): object {
    const ref = {};
    opened.push(ref);
    pushOverlay(ref);
    return ref;
  }

  beforeEach(() => (opened = []));

  afterEach(() => {
    // The stack is module state, so leave it empty for the next test.
    for (const ref of opened) {
      popOverlay(ref);
    }
    expect(openOverlayCount()).toBe(0);
  });

  it('treats the most recently opened overlay as topmost', () => {
    const first = open();
    const second = open();

    expect(isTopmostOverlay(second)).toBe(true);
    expect(isTopmostOverlay(first)).toBe(false);
  });

  it('hands topmost back to the one underneath when the top closes', () => {
    const first = open();
    const second = open();

    popOverlay(second);

    expect(isTopmostOverlay(first)).toBe(true);
  });

  // The bug this stack exists for: dialog, sheet and alert-dialog each kept their
  // own stack, so two different kinds of overlay were both "topmost" at once and a
  // single Escape closed both.
  it('is shared across every kind of overlay', () => {
    const drawer = open();
    const dialogOnTop = open();

    expect(isTopmostOverlay(drawer)).toBe(false);
    expect(isTopmostOverlay(dialogOnTop)).toBe(true);
  });

  it('ignores an overlay that was never pushed', () => {
    open();

    expect(isTopmostOverlay({})).toBe(false);
  });

  it('never counts the same overlay twice', () => {
    const ref = open();
    pushOverlay(ref);

    expect(openOverlayCount()).toBe(1);
  });

  it('tolerates being popped more than once', () => {
    const ref = open();

    popOverlay(ref);
    popOverlay(ref);

    expect(openOverlayCount()).toBe(0);
    expect(isTopmostOverlay(ref)).toBe(false);
  });

  it('reports nothing as topmost when no overlay is open', () => {
    expect(isTopmostOverlay({})).toBe(false);
    expect(openOverlayCount()).toBe(0);
  });
});
