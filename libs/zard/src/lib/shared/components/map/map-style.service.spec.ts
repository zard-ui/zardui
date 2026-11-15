import { TestBed } from '@angular/core/testing';

import { ZardMapStyleService, type ZardMapStyleConfig } from './map-style.service';
import { ZARD_MAP_DEFAULT_STYLES, ZARD_MAP_PRESETS } from './map-styles';

const STORAGE_KEY = 'zard-map-style';

describe('ZardMapStyleService', () => {
  const create = (config?: ZardMapStyleConfig) => {
    const service = TestBed.inject(ZardMapStyleService);
    service.configure(config);
    return service;
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  describe('defaults', () => {
    it('starts on the Carto Positron / Dark Matter pair', () => {
      const service = create();

      expect(service.presetId()).toBe('carto-positron');
      expect(service.styles()).toEqual(ZARD_MAP_DEFAULT_STYLES);
    });

    it('lists unique preset ids, and only the key-based ones need a key', () => {
      const ids = ZARD_MAP_PRESETS.map(preset => preset.id);

      expect(new Set(ids).size).toBe(ids.length);
      expect(ZARD_MAP_PRESETS.filter(preset => preset.requiresKey).map(preset => preset.provider)).toEqual(
        expect.arrayContaining(['maptiler', 'stadia']),
      );
      expect(
        ZARD_MAP_PRESETS.filter(preset => !preset.requiresKey).every(preset => preset.provider !== 'maptiler'),
      ).toBe(true);
    });

    it('marks the OpenStreetMap raster as development only', () => {
      expect(ZARD_MAP_PRESETS.find(preset => preset.provider === 'osm')?.devOnly).toBe(true);
    });
  });

  describe('select', () => {
    it('swaps the styles of every consumer of `styles`', () => {
      const service = create();

      expect(service.select('openfreemap-liberty')).toBe('selected');

      expect(service.styles().light).toBe('https://tiles.openfreemap.org/styles/liberty');
      expect(service.styles().dark).toBe('https://tiles.openfreemap.org/styles/dark');
    });

    it('rejects an unknown preset and keeps the current one', () => {
      const service = create();

      expect(service.select('nope')).toBe('unknown-preset');
      expect(service.presetId()).toBe('carto-positron');
    });

    it('keeps the same style objects for the same preset, so the map does not restyle for nothing', () => {
      const service = create();

      service.select('osm-raster');
      const first = service.styles();
      service.select('carto-voyager');
      service.select('osm-raster');

      expect(service.styles().light).toBe(first.light);
    });
  });

  describe('key-based presets', () => {
    it('needs a key and changes nothing without one', () => {
      const service = create();

      expect(service.select('maptiler-streets')).toBe('needs-key');
      expect(service.presetId()).toBe('carto-positron');
      expect(JSON.stringify(service.styles())).not.toContain('key=');
    });

    it('never builds a style with an undefined key', () => {
      const service = create();

      service.select('maptiler-streets');
      service.select('stadia-outdoors');

      expect(JSON.stringify(service.styles())).not.toContain('undefined');
    });

    it('applies the preset once the key is given, and puts the key in the style URL', () => {
      const service = create();

      expect(service.select('maptiler-streets', ' abc 123 ')).toBe('selected');

      expect(service.styles().light).toBe('https://api.maptiler.com/maps/streets-v4/style.json?key=abc%20123');
      expect(service.styles().dark).toBe('https://api.maptiler.com/maps/streets-v4-dark/style.json?key=abc%20123');
    });

    it('takes the key from config', () => {
      const service = create({ keys: { stadia: 'k1' }, style: 'stadia-alidade-smooth' });

      expect(service.presetId()).toBe('stadia-alidade-smooth');
      expect(service.styles().light).toBe('https://tiles.stadiamaps.com/styles/alidade_smooth.json?api_key=k1');
    });

    it('ignores a configured style whose key is missing', () => {
      const service = create({ style: 'maptiler-streets' });

      expect(service.presetId()).toBe('carto-positron');
    });

    it('falls back to the default when the key is forgotten', () => {
      const service = create();
      service.select('maptiler-streets', 'k');

      service.setKey('maptiler', '');

      expect(service.preset().id).toBe('carto-positron');
      expect(service.styles()).toEqual(ZARD_MAP_DEFAULT_STYLES);
    });
  });

  describe('configure', () => {
    it('starts on the configured style', () => {
      expect(create({ style: 'carto-voyager' }).presetId()).toBe('carto-voyager');
    });

    it('ignores a configured style that does not exist', () => {
      expect(create({ style: 'nope' }).presetId()).toBe('carto-positron');
    });

    it('applies a config only once, and never moves the basemap under the user afterwards', () => {
      const service = create({ style: 'carto-voyager' });
      service.select('openfreemap-bright');

      service.configure({ style: 'carto-positron' });

      expect(service.presetId()).toBe('openfreemap-bright');
    });

    it('merges the keys of a second config', () => {
      const service = create({ keys: { maptiler: 'a' } });

      service.configure({ keys: { stadia: 'b' } });

      expect(service.keys()).toEqual({ maptiler: 'a', stadia: 'b' });
    });
  });

  describe('persist', () => {
    it('stores the choice and restores it in a fresh service', () => {
      create({ persist: true }).select('openfreemap-fiord');
      expect(localStorage.getItem(STORAGE_KEY)).toBe('openfreemap-fiord');

      TestBed.resetTestingModule();

      expect(create({ persist: true }).presetId()).toBe('openfreemap-fiord');
    });

    it('lets a stored choice win over the configured style', () => {
      localStorage.setItem(STORAGE_KEY, 'carto-voyager');

      expect(create({ persist: true, style: 'openfreemap-liberty' }).presetId()).toBe('carto-voyager');
    });

    it('does not read or write storage unless asked to', () => {
      localStorage.setItem(STORAGE_KEY, 'carto-voyager');
      const service = create();

      service.select('openfreemap-bright');

      expect(service.presetId()).toBe('openfreemap-bright');
      expect(localStorage.getItem(STORAGE_KEY)).toBe('carto-voyager');
    });

    it('uses the storage key it is given', () => {
      create({ persist: 'my-map' }).select('carto-voyager');

      expect(localStorage.getItem('my-map')).toBe('carto-voyager');
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('falls back to Carto when the stored preset no longer exists', () => {
      localStorage.setItem(STORAGE_KEY, 'nope');

      const service = create({ persist: true });

      expect(service.presetId()).toBe('carto-positron');
      expect(service.styles()).toEqual(ZARD_MAP_DEFAULT_STYLES);
    });

    it('falls back to Carto when the stored keys are corrupted', () => {
      localStorage.setItem(STORAGE_KEY, 'maptiler-streets');
      localStorage.setItem(`${STORAGE_KEY}:keys`, '{not json');

      const service = create({ persist: true });

      expect(service.keys()).toEqual({});
      expect(service.presetId()).toBe('carto-positron');
    });

    it('drops stored keys that are not strings', () => {
      localStorage.setItem(`${STORAGE_KEY}:keys`, JSON.stringify({ maptiler: 42, stadia: ['x'], carto: ' ok ' }));

      expect(create({ persist: true }).keys()).toEqual({ carto: 'ok' });
    });

    it('keeps the keys typed by the user, and restores a key-based choice with its key', () => {
      create({ persist: true }).select('maptiler-dataviz', 'secret');
      TestBed.resetTestingModule();

      const service = create({ persist: true });

      expect(service.presetId()).toBe('maptiler-dataviz');
      expect(service.styles().light).toContain('key=secret');
    });

    it('survives storage that throws', () => {
      const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('quota');
      });

      try {
        const service = create({ persist: true });
        expect(() => service.select('carto-voyager')).not.toThrow();
        expect(service.presetId()).toBe('carto-voyager');
      } finally {
        spy.mockRestore();
      }
    });
  });
});
