import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

import { EDarkModes, ZardDarkMode } from '@zard/services/dark-mode';

import { ThemeGeneratorService } from './theme-generator.service';
import { THEME_PRESETS } from '../data/theme-presets';

/**
 * The service clones a preset's theme with `structuredClone`, which a real browser (and
 * Node itself) provides globally but this suite's happy-dom test environment does not.
 * The cloned value is always a plain, JSON-safe object of strings, so a JSON round-trip
 * is an equivalent stand-in here.
 */
if (typeof globalThis.structuredClone !== 'function') {
  globalThis.structuredClone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
}

/** A `ParamMap` built from a plain object, mirroring the typeset generator's test helper. */
function paramMap(params: Record<string, string>) {
  return {
    get: (key: string) => params[key] ?? null,
    has: (key: string) => key in params,
    getAll: (key: string) => (key in params ? [params[key]] : []),
    keys: Object.keys(params),
  };
}

function findPreset(name: string) {
  const preset = THEME_PRESETS.find(p => p.name === name);
  if (!preset) throw new Error(`No preset named "${name}" in THEME_PRESETS.`);
  return preset;
}

const NEUTRAL = THEME_PRESETS[0];
const ROSE = findPreset('Rose');

describe('ThemeGeneratorService', () => {
  let queryParamMap: BehaviorSubject<ReturnType<typeof paramMap>>;
  let navigate: jest.Mock;

  function createService(
    params: Record<string, string> = {},
    themeMode: EDarkModes.LIGHT | EDarkModes.DARK = EDarkModes.LIGHT,
  ): ThemeGeneratorService {
    const map = paramMap(params);
    queryParamMap = new BehaviorSubject(map);
    navigate = jest.fn().mockResolvedValue(true);

    TestBed.configureTestingModule({
      providers: [
        ThemeGeneratorService,
        { provide: Router, useValue: { navigate } },
        { provide: ActivatedRoute, useValue: { queryParamMap, snapshot: { queryParamMap: map } } },
        { provide: ZardDarkMode, useValue: { themeMode: () => themeMode } },
      ],
    });

    const service = TestBed.inject(ThemeGeneratorService);
    TestBed.tick();
    return service;
  }

  afterEach(() => TestBed.resetTestingModule());

  describe('defaults', () => {
    it('starts on the first preset, matching it exactly', () => {
      const service = createService();

      expect(service.activePreset()).toBe(NEUTRAL.name);
      expect(service.isDirty()).toBe(false);
      expect(service.theme()).toEqual(NEUTRAL.theme);
    });

    it('follows the app-wide dark mode for the initial preview', () => {
      const service = createService({}, EDarkModes.DARK);

      expect(service.previewDarkMode()).toBe(true);
    });
  });

  describe('applyPreset', () => {
    it('switches the theme and marks the preset active', () => {
      const service = createService();
      service.applyPreset('Rose');

      expect(service.activePreset()).toBe('Rose');
      expect(service.isDirty()).toBe(false);
      expect(service.theme()).toEqual(ROSE.theme);
    });

    it('ignores an unknown preset name', () => {
      const service = createService();
      service.applyPreset('Not A Real Preset');

      expect(service.activePreset()).toBe(NEUTRAL.name);
    });
  });

  describe('updateVariable and updateRadius', () => {
    it('clears the active preset once a colour is edited', () => {
      const service = createService();
      service.updateVariable('primary', 'oklch(0.5 0.2 30)', 'light');

      expect(service.activePreset()).toBeNull();
      expect(service.isDirty()).toBe(true);
      expect(service.theme().light.primary).toBe('oklch(0.5 0.2 30)');
    });

    it('clears the active preset once the radius is edited', () => {
      const service = createService();
      service.updateRadius('1rem');

      expect(service.activePreset()).toBeNull();
      expect(service.theme().radius).toBe('1rem');
    });
  });

  describe('reset', () => {
    it('returns every colour and the radius to the preset it started from', () => {
      const service = createService();
      service.updateVariable('primary', 'oklch(0.5 0.2 30)', 'light');
      service.updateRadius('1rem');

      service.reset();

      expect(service.theme()).toEqual(NEUTRAL.theme);
      expect(service.activePreset()).toBe(NEUTRAL.name);
      expect(service.isDirty()).toBe(false);
    });

    it('resets against the last applied preset, not the very first one', () => {
      const service = createService();
      service.applyPreset('Rose');
      service.updateVariable('primary', 'oklch(0.5 0.2 30)', 'light');

      service.reset();

      expect(service.theme()).toEqual(ROSE.theme);
      expect(service.activePreset()).toBe('Rose');
    });
  });

  describe('state written to the URL', () => {
    it('writes the preset name once it is not the default', () => {
      const service = createService();
      service.applyPreset('Rose');

      expect(navigate).toHaveBeenCalledWith(
        [],
        expect.objectContaining({ queryParams: expect.objectContaining({ preset: 'Rose' }) }),
      );
    });

    it('drops the preset param when it is back on the default', () => {
      const service = createService({ preset: 'Rose' });
      service.applyPreset('Neutral');

      const [, options] = navigate.mock.calls.at(-1) as [unknown, { queryParams: Record<string, string | null> }];
      expect(options.queryParams['preset']).toBeNull();
    });

    it('encodes only the changed colours as a delta, not all 32 tokens', () => {
      const service = createService();
      service.updateVariable('primary', 'oklch(0.5 0.2 30)', 'light');

      const [, options] = navigate.mock.calls.at(-1) as [unknown, { queryParams: Record<string, string | null> }];
      const encoded = JSON.parse(options.queryParams['c'] as string);

      expect(encoded).toEqual({ light: { primary: 'oklch(0.5 0.2 30)' } });
    });

    it('replaces the history entry instead of stacking one per edit', () => {
      const service = createService();
      service.updateRadius('1rem');

      expect(navigate).toHaveBeenCalledWith(
        [],
        expect.objectContaining({ replaceUrl: true, queryParamsHandling: 'merge' }),
      );
    });

    it('writes only the mode key when the preview toggle is used, leaving preset/radius/colors untouched', () => {
      const service = createService();
      service.togglePreviewDarkMode();

      const [, options] = navigate.mock.calls.at(-1) as [unknown, { queryParams: Record<string, string | null> }];
      expect(options.queryParams).toEqual({ mode: 'dark' });
    });
  });

  describe('state read from the URL', () => {
    it('restores a preset by name', () => {
      const service = createService({ preset: 'Rose' });

      expect(service.activePreset()).toBe('Rose');
      expect(service.theme()).toEqual(ROSE.theme);
    });

    it('falls back to the default preset for an unknown name', () => {
      const service = createService({ preset: 'Not A Real Preset' });

      expect(service.activePreset()).toBe(NEUTRAL.name);
    });

    it('applies a colour delta on top of the named preset', () => {
      const service = createService({
        preset: 'Rose',
        c: JSON.stringify({ light: { primary: 'oklch(0.5 0.2 30)' } }),
      });

      expect(service.theme().light.primary).toBe('oklch(0.5 0.2 30)');
      expect(service.theme().light.background).toBe(ROSE.theme.light.background);
      expect(service.activePreset()).toBeNull();
    });

    // A query param is untrusted input: anything that could reach a `style` binding
    // unescaped has to be dropped rather than trusted.
    it('drops a colour value outside the safe charset', () => {
      const service = createService({
        c: JSON.stringify({ light: { primary: 'url(javascript:alert(1))' } }),
      });

      expect(service.theme().light.primary).toBe(NEUTRAL.theme.light.primary);
    });

    it('ignores an unknown colour key', () => {
      const service = createService({
        c: JSON.stringify({ light: { 'not-a-real-token': 'oklch(0.5 0.2 30)' } }),
      });

      expect(service.theme()).toEqual(NEUTRAL.theme);
    });

    it('falls back to the preset radius for a malformed value', () => {
      const service = createService({ radius: '10px; } body { color: red' });

      expect(service.theme().radius).toBe(NEUTRAL.theme.radius);
    });

    it('accepts a well-formed radius override', () => {
      const service = createService({ radius: '1rem' });

      expect(service.theme().radius).toBe('1rem');
    });

    it('leaves the preview mode on the app default when the URL has no opinion', () => {
      const service = createService({}, EDarkModes.DARK);

      expect(service.previewDarkMode()).toBe(true);
    });

    it('honours an explicit mode param over the app default', () => {
      const service = createService({ mode: 'light' }, EDarkModes.DARK);

      expect(service.previewDarkMode()).toBe(false);
    });
  });

  describe('exportCss', () => {
    it('matches the structure zard-cli init writes: the @layer order, both @import lines, @custom-variant, and both :root and .dark blocks', () => {
      const service = createService();
      const css = service.exportCss();

      expect(css).toContain('@layer ng-icon, theme, base, components, utilities;');
      expect(css).toContain("@import 'tailwindcss';");
      expect(css).toContain("@import './app/shared/core/css/zard';");
      expect(css).toContain('@plugin "tailwindcss-animate";');
      expect(css).toContain('@custom-variant dark (&:is(.dark *));');
      expect(css).toContain(':root {');
      expect(css).toContain('.dark {');
      expect(css).toContain('@theme inline {');
      expect(css).toContain('@layer base {');
      expect(css.indexOf(':root {')).toBeLessThan(css.indexOf('.dark {'));
    });

    it('exports light and dark colours together, regardless of which one is previewed', () => {
      const service = createService({}, EDarkModes.DARK);
      const css = service.exportCss();

      expect(css).toContain(`--background: ${NEUTRAL.theme.light.background};`);
      expect(css).toContain(`--background: ${NEUTRAL.theme.dark.background};`);
    });

    it('carries the destructive-foreground token the library maps in @theme inline', () => {
      const service = createService();
      const css = service.exportCss();

      expect(css).toContain(`--destructive-foreground: ${NEUTRAL.theme.light['destructive-foreground']};`);
      expect(css).toContain('--color-destructive-foreground: var(--destructive-foreground);');
    });

    it('has no leading or trailing blank lines, matching the trim() in getThemeContent()', () => {
      const service = createService();
      const css = service.exportCss();

      expect(css.startsWith('\n')).toBe(false);
      expect(css.endsWith('\n')).toBe(false);
    });
  });
});
