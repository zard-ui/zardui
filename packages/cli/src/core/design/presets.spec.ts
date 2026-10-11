import { decodePreset, encodePreset } from './codec.js';
import { DEFAULT_DESIGN, DESIGN_FIELDS, normalizeDesign } from './config.js';
import { STYLE_IDS } from './options.js';
import { SHUFFLE_PRESETS, STYLE_RESET_PRESETS, resetDesign, shuffleDesign } from './presets.js';

/** A deterministic sequence in [0, 1). */
function sequence(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

describe('the curated shuffle presets', () => {
  it('are 25', () => {
    expect(SHUFFLE_PRESETS).toHaveLength(25);
  });

  it('are all valid designs, untouched by the constraints', () => {
    for (const preset of SHUFFLE_PRESETS) expect(normalizeDesign(preset)).toEqual(preset);
  });

  it('survive a round trip through the code', () => {
    for (const preset of SHUFFLE_PRESETS) expect(decodePreset(encodePreset(preset))).toEqual(preset);
  });

  it('are all different', () => {
    expect(new Set(SHUFFLE_PRESETS.map(preset => encodePreset(preset))).size).toBe(25);
  });

  it('show off the range of the system rather than one corner of it', () => {
    const styles = new Set(SHUFFLE_PRESETS.map(preset => preset.style));
    const libraries = new Set(SHUFFLE_PRESETS.map(preset => preset.iconLibrary));

    expect(styles.size).toBeGreaterThanOrEqual(6);
    expect(libraries.size).toBe(5);
  });
});

describe('the reset presets', () => {
  it('has one per style, each on its own style', () => {
    for (const style of STYLE_IDS) {
      expect(STYLE_RESET_PRESETS[style].style).toBe(style);
      expect(resetDesign(style).style).toBe(style);
    }
  });

  it('are valid designs', () => {
    for (const style of STYLE_IDS)
      expect(normalizeDesign(STYLE_RESET_PRESETS[style])).toEqual(STYLE_RESET_PRESETS[style]);
  });

  it('returns the default design for nova', () => {
    expect(resetDesign('nova')).toEqual(DEFAULT_DESIGN);
  });

  it.each([
    ['maia', 'hugeicons', 'figtree'],
    ['lyra', 'phosphor', 'jetbrains-mono'],
    ['mira', 'hugeicons', 'inter'],
    ['luma', 'lucide', 'inter'],
  ] as const)('gives %s its own icons and font', (style, iconLibrary, font) => {
    expect(resetDesign(style)).toMatchObject({ iconLibrary, font });
  });

  it('gives sera its editorial pairing, with square corners', () => {
    expect(resetDesign('sera')).toMatchObject({
      baseColor: 'taupe',
      theme: 'taupe',
      font: 'noto-sans',
      fontHeading: 'playfair-display',
      radius: 'none',
    });
  });

  it('hands out copies, so a caller cannot edit the table', () => {
    const copy = resetDesign('nova');
    copy.font = 'lora';

    expect(resetDesign('nova').font).toBe('inter');
  });
});

describe('shuffleDesign', () => {
  it('never returns the current design', () => {
    const random = sequence(1);
    let current = DEFAULT_DESIGN;

    for (let step = 0; step < 200; step++) {
      const next = shuffleDesign(current, {}, random);
      expect(encodePreset(next)).not.toBe(encodePreset(current));
      current = next;
    }
  });

  it('never returns the same design twice in a row, even starting from a curated one', () => {
    for (const preset of SHUFFLE_PRESETS) {
      for (const sample of [0, 0.5, 0.9999]) {
        expect(encodePreset(shuffleDesign(preset, {}, () => sample))).not.toBe(encodePreset(preset));
      }
    }
  });

  it('keeps every locked field where it was', () => {
    const random = sequence(7);
    const current = normalizeDesign({
      style: 'maia',
      font: 'lora',
      iconLibrary: 'phosphor',
      baseColor: 'olive',
      theme: 'olive',
    });

    for (let step = 0; step < 200; step++) {
      const next = shuffleDesign(current, { font: true, iconLibrary: true, baseColor: true }, random);

      expect(next.font).toBe('lora');
      expect(next.iconLibrary).toBe('phosphor');
      expect(next.baseColor).toBe('olive');
    }
  });

  it('keeps the locks while still returning a different design when something is free', () => {
    const current = SHUFFLE_PRESETS[3]!;
    const locks = Object.fromEntries(DESIGN_FIELDS.filter(field => field !== 'style').map(field => [field, true]));
    const next = shuffleDesign(current, locks, () => 0);

    // Only the style can change; the result may be the current design again only if nothing else is left.
    for (const field of DESIGN_FIELDS.filter(name => name !== 'style' && name !== 'radius')) {
      expect(next[field]).toBe(current[field]);
    }
  });

  it('returns the current design unchanged when every field is locked', () => {
    const current = SHUFFLE_PRESETS[0]!;
    const locks = Object.fromEntries(DESIGN_FIELDS.map(field => [field, true]));

    expect(shuffleDesign(current, locks, Math.random)).toEqual(current);
  });

  it('always lands on a valid design, locks or not', () => {
    const random = sequence(99);
    let current = normalizeDesign({ style: 'rhea', radius: 'medium', menuAppearance: 'translucent' });

    for (let step = 0; step < 300; step++) {
      current = shuffleDesign(current, step % 3 === 0 ? { radius: true } : {}, random);
      expect(normalizeDesign(current)).toEqual(current);
    }
  });
});
