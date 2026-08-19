import { DEFAULT_PRESET } from '../preset.js';
import { duplicateCodes, parseCatalog, serializeCatalog } from '../registry.js';
import { entryByCode, entryById, LOCAL_PRESET_CATALOG, selectable } from './index.js';

const catalog = LOCAL_PRESET_CATALOG;

describe('preset catalog', () => {
  it('has no two entries sharing a code', () => {
    expect(duplicateCodes(catalog)).toEqual([]);
  });

  it('reserves code 0 for the default of each section', () => {
    expect(entryByCode(catalog.baseColors, 0)?.id).toBe('neutral');
    expect(entryByCode(catalog.themes, 0)?.id).toBe('neutral');
    expect(entryByCode(catalog.charts, 0)?.id).toBe('default');
    expect(entryByCode(catalog.icons, 0)?.id).toBe('lucide');
  });

  it('points every default of DEFAULT_PRESET at a real entry', () => {
    expect(entryById(catalog.baseColors, DEFAULT_PRESET.baseColor)).toBeDefined();
    expect(entryById(catalog.themes, DEFAULT_PRESET.theme)).toBeDefined();
    expect(entryById(catalog.charts, DEFAULT_PRESET.chart)).toBeDefined();
    expect(entryById(catalog.radii, DEFAULT_PRESET.radius)).toBeDefined();
    expect(entryById(catalog.icons, DEFAULT_PRESET.icons)).toBeDefined();
  });

  it('keeps a deprecated entry decodable but out of the picker', () => {
    const retired = {
      ...catalog,
      themes: [...catalog.themes, { id: 'retired', code: 61, label: 'Retired', deprecated: true }],
    };

    expect(entryByCode(retired.themes, 61)?.id).toBe('retired');
    expect(selectable(retired.themes).map(entry => entry.id)).not.toContain('retired');
  });

  it('survives a round trip through the registry document', () => {
    expect(parseCatalog(serializeCatalog(catalog, 1))).toEqual(catalog);
  });

  it('falls back to the bundled catalog for anything it cannot read', () => {
    for (const document of [null, undefined, {}, { themes: [] }, 'nonsense']) {
      expect(parseCatalog(document)).toEqual(catalog);
    }
  });

  it('reports duplicate codes instead of letting the first one win', () => {
    const broken = { ...catalog, radii: [...catalog.radii, { id: 'clone', code: 0, label: 'Clone', value: '0rem' }] };

    expect(duplicateCodes(broken)).toEqual(['radii: "none" and "clone" share code 0']);
  });
});
