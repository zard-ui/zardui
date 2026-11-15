import { TestBed } from '@angular/core/testing';

import { ZardChartThemeWatcher } from './chart-theme-watcher';

type WatcherInternals = { readSignature(): string; scheduleCheck(): void; observer: MutationObserver | null };

const nextFrame = () => new Promise(resolve => requestAnimationFrame(() => resolve(undefined)));

/**
 * happy-dom neither resolves CSS custom properties nor reports <head> mutations, so the token read is stubbed and a
 * mutation is simulated by calling what the observer calls. These specs cover what the watcher decides; a real theme
 * switch repainting a real chart is covered end to end in the /create preview.
 */
describe('ZardChartThemeWatcher', () => {
  let watcher: ZardChartThemeWatcher;
  let internals: WatcherInternals;
  let tokens: string;

  beforeEach(() => {
    watcher = TestBed.inject(ZardChartThemeWatcher);
    internals = watcher as unknown as WatcherInternals;
    tokens = 'blue';
    jest.spyOn(internals, 'readSignature').mockImplementation(() => tokens);
  });

  it('observes the class, style and data-theme of <html> and everything under <head>', () => {
    const observe = jest.spyOn(MutationObserver.prototype, 'observe');
    const stop = watcher.watch();

    expect(observe).toHaveBeenCalledWith(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style', 'data-theme'],
    });
    expect(observe).toHaveBeenCalledWith(document.head, { childList: true, subtree: true, characterData: true });

    stop();
    observe.mockRestore();
  });

  it('bumps the revision when a mutation changed the tokens', async () => {
    const stop = watcher.watch();
    const before = watcher.revision();

    tokens = 'red';
    internals.scheduleCheck();
    await nextFrame();

    expect(watcher.revision()).toBe(before + 1);
    stop();
  });

  it('stays put for a mutation that leaves every token as it was', async () => {
    const stop = watcher.watch();
    const before = watcher.revision();

    internals.scheduleCheck();
    await nextFrame();

    expect(watcher.revision()).toBe(before);
    stop();
  });

  it('checks once a frame however many mutations arrive', async () => {
    const stop = watcher.watch();
    const before = watcher.revision();
    const read = internals.readSignature as jest.Mock;
    read.mockClear();

    tokens = 'red';
    internals.scheduleCheck();
    internals.scheduleCheck();
    internals.scheduleCheck();
    await nextFrame();

    expect(read).toHaveBeenCalledTimes(1);
    expect(watcher.revision()).toBe(before + 1);
    stop();
  });

  it('keeps one observer for every chart and drops it when the last one goes away', () => {
    const stopA = watcher.watch();
    const first = internals.observer;
    const stopB = watcher.watch();

    expect(internals.observer).toBe(first);

    stopA();
    expect(internals.observer).not.toBeNull();
    stopB();
    expect(internals.observer).toBeNull();
  });
});
