import { decodePreset, encodePreset } from '../code.js';
import { DEFAULT_PRESET } from '../preset.js';
import { LOCAL_PRESET_CATALOG, NAMED_PRESETS } from './index.js';

const catalog = LOCAL_PRESET_CATALOG;

/** O que o rótulo de cada preset promete. Se o código não bater com isto, o código está errado. */
const EXPECTED = {
  default: DEFAULT_PRESET,
  'slate-blue': { ...DEFAULT_PRESET, baseColor: 'slate', theme: 'blue' },
  'stone-amber': { ...DEFAULT_PRESET, baseColor: 'stone', theme: 'amber', radius: 'large' },
  'zinc-violet': { ...DEFAULT_PRESET, baseColor: 'zinc', theme: 'violet', radius: 'medium' },
  'gray-emerald': { ...DEFAULT_PRESET, baseColor: 'gray', theme: 'emerald', chart: 'vivid' },
} as const;

describe('named presets', () => {
  it.each(NAMED_PRESETS.map(preset => preset.id))('%s decodes to what its label promises', id => {
    const entry = NAMED_PRESETS.find(preset => preset.id === id);
    const expected = EXPECTED[id as keyof typeof EXPECTED];

    expect(expected).toBeDefined();
    expect(decodePreset(entry?.code as string, catalog)).toEqual(expected);
    expect(encodePreset(expected, catalog)).toBe(entry?.code);
  });

  it('covers every named preset with an expectation', () => {
    expect(NAMED_PRESETS.map(preset => preset.id).sort()).toEqual(Object.keys(EXPECTED).sort());
  });

  it('opens with the default preset first', () => {
    expect(NAMED_PRESETS[0]?.id).toBe('default');
  });
});
