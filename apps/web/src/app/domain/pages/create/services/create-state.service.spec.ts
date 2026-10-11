import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

import { DEFAULT_DESIGN, encodePreset, normalizeDesign, parsePresetInput, SHUFFLE_PRESETS } from '@zard/design';
import { ZardDarkMode } from '@zard/services/dark-mode';

import { CreateStateService, PREVIEW_DEBOUNCE_MS } from './create-state.service';

function paramMap(params: Record<string, string>) {
  return {
    get: (key: string) => params[key] ?? null,
    has: (key: string) => key in params,
    getAll: (key: string) => (key in params ? [params[key]] : []),
    keys: Object.keys(params),
  };
}

describe('CreateStateService', () => {
  let queryParamMap: BehaviorSubject<ReturnType<typeof paramMap>>;
  let navigate: jest.Mock;
  const dark = signal<'light' | 'dark'>('light');

  /** A router that behaves like the real one for this service: a navigation becomes the new query string. */
  function createService(initial: Record<string, string> = { preset: encodePreset(DEFAULT_DESIGN) }) {
    queryParamMap = new BehaviorSubject(paramMap(initial));
    navigate = jest.fn((_commands: unknown[], extras: { queryParams: Record<string, string> }) => {
      queryParamMap.next(paramMap(extras.queryParams));
      return Promise.resolve(true);
    });

    TestBed.configureTestingModule({
      providers: [
        CreateStateService,
        { provide: Router, useValue: { navigate } },
        { provide: ActivatedRoute, useValue: { queryParamMap } },
        { provide: ZardDarkMode, useValue: { themeMode: dark, toggleTheme: jest.fn() } },
      ],
    });

    const service = TestBed.inject(CreateStateService);
    TestBed.tick();
    return service;
  }

  const code = (design: Parameters<typeof encodePreset>[0]) => encodePreset(design);

  beforeEach(() => jest.useFakeTimers());

  afterEach(() => {
    jest.useRealTimers();
    TestBed.resetTestingModule();
  });

  describe('committing', () => {
    it('writes the canonical preset to the URL as a new history entry', () => {
      const service = createService();

      service.commit({ style: 'maia' });
      TestBed.tick();

      expect(navigate).toHaveBeenCalledTimes(1);
      expect(navigate.mock.calls[0][1]).toMatchObject({
        queryParams: { preset: code({ style: 'maia' }) },
        replaceUrl: false,
      });
      expect(service.design().style).toBe('maia');
      expect(service.preset()).toBe(code({ style: 'maia' }));
    });

    it('does nothing for a change that lands on the same design', () => {
      const service = createService();

      service.commit({ style: 'nova' });

      expect(navigate).not.toHaveBeenCalled();
    });

    it('bends constraints instead of writing an invalid design', () => {
      const service = createService();

      service.commit({ style: 'lyra' });
      TestBed.tick();

      expect(service.design().radius).toBe('none');
      expect(service.constraints().radiusLocked).toBe(true);
    });

    it('remembers the solid-menu accent across a translucent menu', () => {
      const service = createService({ preset: code({ menuAccent: 'bold' }) });

      service.commit({ menuAppearance: 'translucent' });
      TestBed.tick();
      expect(service.design().menuAccent).toBe('subtle');

      service.commit({ menuAppearance: 'solid' });
      TestBed.tick();
      expect(service.design().menuAccent).toBe('bold');
    });

    it('opens a preset typed or pasted with its flag, and refuses a bad one', () => {
      const service = createService();
      const target = code({ style: 'sera', font: 'lora' });

      expect(service.setPreset(`--preset ${target}`)).toBe(true);
      TestBed.tick();
      expect(service.preset()).toBe(target);

      expect(service.setPreset('zzz')).toBe(false);
      expect(CreateStateService.canOpen('--preset ' + target)).toBe(true);
      expect(CreateStateService.canOpen('b2D0wqNxT')).toBe(false);
    });
  });

  describe('URL', () => {
    it('rewrites a non-canonical URL in place, without a history entry', () => {
      createService({ style: 'lyra' });

      expect(navigate).toHaveBeenCalledWith(
        [],
        expect.objectContaining({ queryParams: { preset: code({ style: 'lyra' }) }, replaceUrl: true }),
      );
    });

    it('follows the URL when the browser goes back', () => {
      const service = createService();
      service.commit({ style: 'maia' });
      TestBed.tick();

      queryParamMap.next(paramMap({ preset: code({}) }));
      TestBed.tick();

      expect(service.design().style).toBe('nova');
    });

    it('keeps the item through design changes', () => {
      const service = createService({ preset: code({}), item: 'preview-02' });

      service.commit({ style: 'mira' });

      expect(navigate.mock.calls[0][1].queryParams).toEqual({ preset: code({ style: 'mira' }), item: 'preview-02' });
    });
  });

  describe('hover preview', () => {
    it('applies after the debounce and never touches the URL', () => {
      const service = createService();

      service.preview({ style: 'luma' });
      expect(service.effectiveDesign().style).toBe('nova');

      jest.advanceTimersByTime(PREVIEW_DEBOUNCE_MS);
      expect(service.effectiveDesign().style).toBe('luma');
      expect(service.design().style).toBe('nova');
      expect(navigate).not.toHaveBeenCalled();
    });

    it('re-arms the timer on every move, so nothing applies while the pointer is moving', () => {
      const service = createService();

      service.preview({ style: 'luma' });
      jest.advanceTimersByTime(PREVIEW_DEBOUNCE_MS - 10);
      service.preview({ style: 'maia' });
      jest.advanceTimersByTime(PREVIEW_DEBOUNCE_MS - 10);
      expect(service.effectiveDesign().style).toBe('nova');

      jest.advanceTimersByTime(10);
      expect(service.effectiveDesign().style).toBe('maia');
    });

    it('clears at once and drops a pending preview', () => {
      const service = createService();

      service.preview({ style: 'luma' });
      jest.advanceTimersByTime(PREVIEW_DEBOUNCE_MS);
      service.clearPreview();
      expect(service.effectiveDesign().style).toBe('nova');

      service.preview({ style: 'maia' });
      service.clearPreview();
      jest.advanceTimersByTime(PREVIEW_DEBOUNCE_MS * 2);
      expect(service.effectiveDesign().style).toBe('nova');
    });

    it('normalizes a previewed combination like a committed one', () => {
      const service = createService();

      service.preview({ style: 'lyra' });
      jest.advanceTimersByTime(PREVIEW_DEBOUNCE_MS);

      expect(service.effectiveDesign().radius).toBe('none');
    });
  });

  describe('shuffle', () => {
    it('never repeats the current design', () => {
      const service = createService();
      let previous = service.preset();

      for (let index = 0; index < 20; index++) {
        service.shuffle();
        TestBed.tick();
        expect(service.preset()).not.toBe(previous);
        previous = service.preset();
      }
    });

    it('holds locked options where they are', () => {
      const service = createService({ preset: code({ font: 'lora', iconLibrary: 'phosphor' }) });
      service.toggleLock('font');
      service.toggleLock('iconLibrary');

      for (let index = 0; index < 20; index++) {
        service.shuffle();
        TestBed.tick();
        expect(service.design().font).toBe('lora');
        expect(service.design().iconLibrary).toBe('phosphor');
      }
    });

    it('locks the menu color and appearance together', () => {
      const service = createService({ preset: code({ menuColor: 'inverted', menuAppearance: 'translucent' }) });
      service.toggleLock('menu');

      expect(service.isLocked('menu')).toBe(true);
      service.shuffle();
      TestBed.tick();

      expect(service.design().menuColor).toBe('inverted');
      expect(service.design().menuAppearance).toBe('translucent');
    });

    it('draws from the curated presets', () => {
      const service = createService();
      service.shuffle();
      TestBed.tick();

      const curated = new Set(SHUFFLE_PRESETS.map(preset => encodePreset(preset)));
      expect(curated.has(service.preset())).toBe(true);
    });
  });

  describe('history', () => {
    it('undoes and redoes exactly', () => {
      const service = createService();
      const first = service.preset();

      service.commit({ style: 'maia' });
      TestBed.tick();
      const second = service.preset();
      service.commit({ font: 'lora' });
      TestBed.tick();
      const third = service.preset();

      expect(service.canUndo()).toBe(true);
      service.undo();
      TestBed.tick();
      expect(service.preset()).toBe(second);
      service.undo();
      TestBed.tick();
      expect(service.preset()).toBe(first);
      expect(service.canUndo()).toBe(false);

      service.redo();
      TestBed.tick();
      service.redo();
      TestBed.tick();
      expect(service.preset()).toBe(third);
      expect(service.canRedo()).toBe(false);
    });

    it('navigates with replace so undo does not stack browser entries', () => {
      const service = createService();
      service.commit({ style: 'maia' });
      TestBed.tick();
      navigate.mockClear();

      service.undo();

      expect(navigate.mock.calls[0][1].replaceUrl).toBe(true);
    });
  });

  describe('reset', () => {
    it('restores the curated design of the current style', () => {
      const service = createService({ preset: code({ style: 'sera', font: 'lora', iconLibrary: 'remixicon' }) });

      service.reset();
      TestBed.tick();

      expect(service.design().style).toBe('sera');
      expect(service.design()).toEqual(normalizeDesign(parsePresetInput(service.preset()).design));
      expect(service.design().iconLibrary).toBe('lucide');
      expect(service.design().baseColor).toBe('taupe');
    });

    it('asks first, and ⇧R again answers yes', () => {
      const service = createService({ preset: code({ font: 'lora' }) });

      service.run('reset');
      expect(service.resetOpen()).toBe(true);
      expect(service.design().font).toBe('lora');

      service.run('reset');
      TestBed.tick();
      expect(service.resetOpen()).toBe(false);
      expect(service.design().font).toBe('inter');
    });
  });

  describe('actions', () => {
    it('opens the dialogs the menu and the keyboard ask for', () => {
      const service = createService();

      service.run('navigate');
      service.run('open-preset');

      expect(service.navigateOpen()).toBe(true);
      expect(service.openPresetOpen()).toBe(true);
    });

    it('exposes the dark mode of the site', () => {
      const service = createService();
      expect(service.dark()).toBe(false);

      dark.set('dark');
      expect(service.dark()).toBe(true);
      expect(service.constraints().disabledMenuColors).toEqual(['inverted']);
      dark.set('light');
    });
  });
});
