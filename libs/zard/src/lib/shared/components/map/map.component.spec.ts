import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { MAP_DEFAULT_STYLES, MAP_LABELS } from 'ng-mapcn';

import { ZardMapStyleService } from './map-style.service';
import { ZARD_MAP_DEFAULT_STYLES } from './map-styles';
import { provideZardMap } from './map.provider';

// MapLibre needs WebGL and ships ESM-only typings; the provider never creates a map, so it is stubbed.
jest.mock('maplibre-gl', () => ({}));

describe('provideZardMap', () => {
  const setup = (...args: Parameters<typeof provideZardMap>) => {
    TestBed.configureTestingModule({ providers: [provideZardMap(...args)] });
    return TestBed;
  };

  it('defaults to the Carto Positron / Dark Matter pair', () => {
    const styles = setup().inject(MAP_DEFAULT_STYLES)();

    expect(styles).toEqual(ZARD_MAP_DEFAULT_STYLES);
    expect(styles?.light).toContain('positron');
    expect(styles?.dark).toContain('dark-matter');
  });

  it('does not provide labels unless asked, so the English defaults stay', () => {
    setup();

    expect(TestBed.inject(MAP_LABELS, null, { optional: true })).toBeNull();
  });

  it('overrides the styles with a static value', () => {
    const custom = { light: 'https://example.com/light.json', dark: 'https://example.com/dark.json' };

    expect(setup({ styles: custom }).inject(MAP_DEFAULT_STYLES)()).toEqual(custom);
  });

  it('follows a signal, so the basemap of every map can change live', () => {
    const styles = signal({ light: 'https://example.com/a.json', dark: 'https://example.com/b.json' });
    const resolved = setup({ styles }).inject(MAP_DEFAULT_STYLES);

    expect(resolved()?.light).toBe('https://example.com/a.json');

    styles.set({ light: 'https://example.com/c.json', dark: 'https://example.com/d.json' });

    expect(resolved()?.light).toBe('https://example.com/c.json');
  });

  it('accepts a factory returning a signal', () => {
    const resolved = setup({ styles: () => signal({ light: 'https://example.com/f.json' }) }).inject(
      MAP_DEFAULT_STYLES,
    );

    expect(resolved()).toEqual({ light: 'https://example.com/f.json' });
  });

  it('provides the labels when given', () => {
    const labels = setup({ labels: { zoomIn: 'Aproximar' } }).inject(MAP_LABELS)();

    expect(labels).toEqual({ zoomIn: 'Aproximar' });
  });

  describe('map styles', () => {
    beforeEach(() => localStorage.clear());

    it('feeds the style service into every map, so a pick swaps the basemap live', () => {
      const resolved = setup().inject(MAP_DEFAULT_STYLES);
      expect(resolved()?.light).toContain('positron');

      TestBed.inject(ZardMapStyleService).select('openfreemap-liberty');

      expect(resolved()?.light).toBe('https://tiles.openfreemap.org/styles/liberty');
      expect(resolved()?.dark).toBe('https://tiles.openfreemap.org/styles/dark');
    });

    it('starts on the configured preset', () => {
      const resolved = setup({ style: 'carto-voyager' }).inject(MAP_DEFAULT_STYLES);

      expect(resolved()?.light).toContain('voyager');
    });

    it('gives key-based presets their key from config, and never without one', () => {
      const resolved = setup({ keys: { maptiler: 'k' } }).inject(MAP_DEFAULT_STYLES);
      const service = TestBed.inject(ZardMapStyleService);

      expect(service.select('maptiler-streets')).toBe('selected');
      expect(resolved()?.light).toContain('key=k');
    });

    it('remembers the choice when persist is on', () => {
      setup({ persist: true }).inject(MAP_DEFAULT_STYLES);
      TestBed.inject(ZardMapStyleService).select('carto-voyager');

      expect(localStorage.getItem('zard-map-style')).toBe('carto-voyager');
    });

    it('leaves the basemap to the caller when `styles` is given', () => {
      const custom = { light: 'https://example.com/a.json', dark: 'https://example.com/b.json' };
      const resolved = setup({ styles: custom }).inject(MAP_DEFAULT_STYLES);

      TestBed.inject(ZardMapStyleService).select('carto-voyager');

      expect(resolved()).toEqual(custom);
    });
  });
});
