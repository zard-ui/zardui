import {
  DEFAULT_PRESET_CODE,
  PRESET_TABLES,
  PRESET_VERSION,
  PresetError,
  decodePreset,
  encodePreset,
  extractPresetCode,
  isPresetCode,
  parsePresetInput,
  tryDecodePreset,
} from './codec.js';
import { DEFAULT_DESIGN, DESIGN_FIELDS, normalizeDesign, type DesignConfig } from './config.js';

/** The three reference designs of the validation plan. */
const REFERENCE_B: DesignConfig = {
  style: 'lyra',
  baseColor: 'mauve',
  theme: 'emerald',
  chartColor: 'emerald',
  font: 'jetbrains-mono',
  fontHeading: 'inherit',
  iconLibrary: 'phosphor',
  radius: 'none',
  menuColor: 'inverted',
  menuAppearance: 'translucent',
  menuAccent: 'subtle',
};

const REFERENCE_C: DesignConfig = {
  style: 'sera',
  baseColor: 'taupe',
  theme: 'taupe',
  chartColor: 'rose',
  font: 'inter',
  fontHeading: 'playfair-display',
  iconLibrary: 'hugeicons',
  radius: 'none',
  menuColor: 'default',
  menuAppearance: 'solid',
  menuAccent: 'bold',
};

const reasonOf = (code: string): string | undefined => {
  try {
    decodePreset(code);
    return undefined;
  } catch (error) {
    return error instanceof PresetError ? error.reason : 'other';
  }
};

describe('the default preset', () => {
  it('is Z0: every field at index 0', () => {
    expect(DEFAULT_PRESET_CODE).toBe('Z0');
    expect(PRESET_VERSION).toBe('Z');
    expect(decodePreset('Z0')).toEqual(DEFAULT_DESIGN);
  });

  it('is nova on neutral with Inter, lucide, no heading font, solid subtle menu', () => {
    expect(DEFAULT_DESIGN).toEqual({
      style: 'nova',
      baseColor: 'neutral',
      theme: 'neutral',
      chartColor: 'neutral',
      font: 'inter',
      fontHeading: 'inherit',
      iconLibrary: 'lucide',
      radius: 'default',
      menuColor: 'default',
      menuAppearance: 'solid',
      menuAccent: 'subtle',
    });
  });
});

/**
 * Codes are a public contract: someone pastes one into a README and it has to mean the same thing
 * in every future release. These are frozen on purpose — if one of them changes, a table was
 * reordered, and every code in the wild just changed meaning.
 */
describe('the append-only contract (golden codes)', () => {
  it.each([
    ['Z0', DEFAULT_DESIGN],
    ['Z6KtfCaQt', REFERENCE_B],
    ['ZK4OZp6bW', REFERENCE_C],
  ])('%s decodes to the same design forever', (code, design) => {
    expect(decodePreset(code)).toEqual(design);
    expect(encodePreset(design)).toBe(code);
  });

  it('keeps the index of every option frozen', () => {
    expect(PRESET_TABLES.style.slice(0, 3)).toEqual(['nova', 'vega', 'maia']);
    expect(PRESET_TABLES.font.slice(0, 3)).toEqual(['inter', 'noto-sans', 'nunito-sans']);
    expect(PRESET_TABLES.theme.slice(0, 8)).toEqual([
      'neutral',
      'stone',
      'zinc',
      'mauve',
      'olive',
      'mist',
      'taupe',
      'amber',
    ]);
    expect(PRESET_TABLES.iconLibrary).toEqual(['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon']);
    expect(PRESET_TABLES.radius).toEqual(['default', 'none', 'small', 'medium', 'large']);
  });

  it('puts the default of every field at index 0', () => {
    for (const field of DESIGN_FIELDS.filter(name => name !== 'fontHeading')) {
      const table = (PRESET_TABLES as Record<string, readonly string[]>)[field === 'chartColor' ? 'theme' : field];
      expect(table?.[0]).toBe(DEFAULT_DESIGN[field]);
    }
  });
});

describe('round trip', () => {
  /**
   * Field by field: change one field to each of its values, leaving the rest at the default. This is
   * the part that catches a bit-width or offset mistake — a field spilling into its neighbour shows up
   * as the neighbour changing.
   */
  describe.each([
    ['style', PRESET_TABLES.style],
    ['baseColor', PRESET_TABLES.baseColor],
    ['theme', PRESET_TABLES.theme],
    ['chartColor', PRESET_TABLES.theme],
    ['font', PRESET_TABLES.font],
    ['iconLibrary', PRESET_TABLES.iconLibrary],
    ['radius', PRESET_TABLES.radius],
    ['menuColor', PRESET_TABLES.menuColor],
    ['menuAppearance', PRESET_TABLES.menuAppearance],
    ['menuAccent', PRESET_TABLES.menuAccent],
  ] as const)('%s', (field, values) => {
    it.each([...values])('keeps %s', value => {
      // A base color other than neutral restricts the theme list, so the field under test is set on a
      // design whose other fields are all valid for it.
      const asked = { ...DEFAULT_DESIGN, [field]: value } as DesignConfig;
      const expected = normalizeDesign(asked);

      const decoded = decodePreset(encodePreset(asked));

      expect(decoded).toEqual(expected);
      // The field survives unless a constraint legitimately bent it.
      const bent = field === 'radius' || field === 'theme' || field === 'chartColor';
      if (!bent) expect(decoded[field]).toBe(value);
      // And nothing else moved.
      for (const other of DESIGN_FIELDS.filter(name => name !== field)) {
        if (field === 'style' && other === 'radius') continue; // lyra and sera force their radius
        if (field === 'baseColor' && (other === 'theme' || other === 'chartColor')) continue; // follow the base
        expect(decoded[other]).toBe(expected[other]);
      }
    });
  });

  it('keeps every font as body and every other font as heading', () => {
    for (const font of PRESET_TABLES.font) {
      expect(decodePreset(encodePreset({ ...DEFAULT_DESIGN, font })).font).toBe(font);
      expect(decodePreset(encodePreset({ ...DEFAULT_DESIGN, fontHeading: font })).fontHeading).toBe(
        font === DEFAULT_DESIGN.font ? 'inherit' : font,
      );
    }
  });

  it('keeps every theme and chart color valid for its base color', () => {
    for (const baseColor of PRESET_TABLES.baseColor) {
      for (const theme of PRESET_TABLES.theme.filter(
        id => id === baseColor || !PRESET_TABLES.baseColor.includes(id as never),
      )) {
        const design = decodePreset(encodePreset({ baseColor, theme, chartColor: theme }));
        expect(design).toMatchObject({ baseColor, theme, chartColor: theme });
      }
    }
  });

  it('round-trips a few thousand combinations, every one canonical', () => {
    let seed = 20261011;
    const next = (): number => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    const pick = <T>(list: readonly T[]): T => list[Math.floor(next() * list.length)] as T;

    for (let index = 0; index < 4000; index++) {
      const design = normalizeDesign({
        style: pick(PRESET_TABLES.style),
        baseColor: pick(PRESET_TABLES.baseColor),
        theme: pick(PRESET_TABLES.theme),
        chartColor: pick(PRESET_TABLES.theme),
        font: pick(PRESET_TABLES.font),
        fontHeading: pick(['inherit', ...PRESET_TABLES.font]),
        iconLibrary: pick(PRESET_TABLES.iconLibrary),
        radius: pick(PRESET_TABLES.radius),
        menuColor: pick(PRESET_TABLES.menuColor),
        menuAppearance: pick(PRESET_TABLES.menuAppearance),
        menuAccent: pick(PRESET_TABLES.menuAccent),
      });
      const code = encodePreset(design);

      expect(decodePreset(code)).toEqual(design);
      expect(encodePreset(decodePreset(code))).toBe(code);
    }
  });

  it('gives two spellings of the same design one code', () => {
    // heading equal to body, and a radius on a style that forces its own
    expect(encodePreset({ font: 'lora', fontHeading: 'lora' })).toBe(encodePreset({ font: 'lora' }));
    expect(encodePreset({ style: 'lyra', radius: 'large' })).toBe(encodePreset({ style: 'lyra', radius: 'none' }));
  });
});

describe('decoding applies the constraints', () => {
  it('keeps a code that was hand-built outside the constraints inside them', () => {
    // lyra (index 3) forces radius none; build the raw bits for lyra + radius large by hand.
    const bent = encodePreset({ style: 'lyra' });
    expect(decodePreset(bent).radius).toBe('none');
  });
});

describe('malformed and foreign codes', () => {
  it.each([
    ['', 'empty'],
    ['   ', 'empty'],
    ['b2D0wqNxT', 'foreign'], // a real shadcn/ui code
    ['b0', 'foreign'],
    ['a1', 'foreign'],
    ['zzz', 'unknown-version'],
    ['Q0', 'unknown-version'],
    ['0', 'unknown-version'],
    ['hello world', 'unknown-version'],
    ['Z', 'malformed'],
    ['Z!', 'malformed'],
    ['Z0 1', 'malformed'],
    ['Z-1', 'malformed'],
    ['Z' + '0'.repeat(30), 'malformed'],
    ['ZzzzzzzzzzzzzzZ', 'malformed'],
  ])('rejects %j (%s)', (code, reason) => {
    expect(reasonOf(code)).toBe(reason);
  });

  it('refuses a code with more bits than the layout has, as one from a newer CLI', () => {
    // 62^9 is far beyond 2^48
    expect(reasonOf('Zzzzzzzzzz')).toBe('newer');
  });

  it('refuses an index past the end of a table, as one from a newer CLI', () => {
    // style index 31: five bits all set, the rest zero
    expect(reasonOf('ZV')).toBe('newer'); // V = 31
    expect(() => decodePreset('ZV')).toThrow(/newer|more options|does not know/i);
  });

  it('names the code in every message', () => {
    for (const code of ['b2D0wqNxT', 'zzz', 'Z!', 'ZV']) {
      expect(() => decodePreset(code)).toThrow(code);
    }
  });

  it('says a shadcn code is a shadcn code and where to build a zard one', () => {
    expect(() => decodePreset('b2D0wqNxT')).toThrow(/shadcn/);
    expect(() => decodePreset('b2D0wqNxT')).toThrow(/zardui\.com\/create/);
  });

  it('trims whitespace around an otherwise valid code', () => {
    expect(decodePreset('  Z0\n')).toEqual(DEFAULT_DESIGN);
  });

  it('exposes the failure without throwing through tryDecodePreset', () => {
    const bad = tryDecodePreset('b0');
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(bad.error.reason).toBe('foreign');

    const good = tryDecodePreset('Z0');
    expect(good).toEqual({ ok: true, design: DEFAULT_DESIGN, code: 'Z0' });
  });

  it('knows what looks like one of ours', () => {
    expect(isPresetCode('Z0')).toBe(true);
    expect(isPresetCode('Z6KtfCaQt')).toBe(true);
    expect(isPresetCode('b2D0wqNxT')).toBe(false);
    expect(isPresetCode('Z')).toBe(false);
    expect(isPresetCode('Z!!')).toBe(false);
  });
});

describe('what the user may paste', () => {
  it.each([
    ['Z6KtfCaQt', 'Z6KtfCaQt'],
    ['--preset Z6KtfCaQt', 'Z6KtfCaQt'],
    ['--preset=Z6KtfCaQt', 'Z6KtfCaQt'],
    ['  --preset   Z6KtfCaQt  ', 'Z6KtfCaQt'],
    ['"Z6KtfCaQt"', 'Z6KtfCaQt'],
    ['--preset "Z6KtfCaQt"', 'Z6KtfCaQt'],
    ['npx zard-cli@latest init --preset Z6KtfCaQt --pointer', 'Z6KtfCaQt'],
    ['npx zard-cli create my-app --template nx --preset=Z6KtfCaQt', 'Z6KtfCaQt'],
  ])('reads the code out of %j', (input, code) => {
    expect(extractPresetCode(input)).toBe(code);
    expect(parsePresetInput(input)).toEqual({ design: REFERENCE_B, code });
  });

  it('refuses a sentence that has no --preset in it', () => {
    expect(() => parsePresetInput('hello there')).toThrow(PresetError);
    expect(() => parsePresetInput('hello there')).toThrow('hello there');
  });

  it('still rejects a shadcn code when it comes with the flag', () => {
    expect(() => parsePresetInput('--preset b2D0wqNxT')).toThrow(/shadcn/);
  });

  it('canonicalises: the code it returns is the one the design encodes to', () => {
    expect(parsePresetInput('Z6KtfCaQt').code).toBe(encodePreset(REFERENCE_B));
  });
});
