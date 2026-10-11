import { PRESET_TABLES, encodePreset } from './codec.js';
import { BUNDLED_DESIGN_DATA } from './css.js';
import { designDataFrom, buildDesignDocument } from './document.js';
import {
  ACCENT_COLORS,
  BASE_COLORS,
  CONFIG_STYLES,
  DEFAULT_BASE_COLOR,
  DEFAULT_FONT,
  DEFAULT_ICON_LIBRARY,
  DEFAULT_STYLE,
  FONTS,
  ICON_LIBRARIES,
  MENU_ACCENTS,
  MENU_APPEARANCES,
  MENU_COLORS,
  RADII,
  STYLES,
  STYLE_IDS,
  fontById,
} from './options.js';
import { SHUFFLE_PRESETS } from './presets.js';
import { BASE_COLOR_TOKENS, THEME_COLOR_TOKENS } from './theme-data.js';
import { ICON_FAMILIES } from '../icons/families.js';

const ids = (list: readonly { value?: string; id?: string }[]): string[] =>
  list.map(item => (item.value ?? item.id) as string);

describe('the option lists', () => {
  it('offers the eight styles, each with a one-line description', () => {
    expect(ids(STYLES)).toEqual(['vega', 'nova', 'maia', 'lyra', 'mira', 'luma', 'sera', 'rhea']);
    for (const style of STYLES) {
      expect(style.description.length).toBeGreaterThan(10);
      expect(style.description).not.toContain('\n');
    }
  });

  it('defaults to nova, neutral, Inter and lucide', () => {
    expect(DEFAULT_STYLE).toBe('nova');
    expect(DEFAULT_BASE_COLOR).toBe('neutral');
    expect(DEFAULT_FONT).toBe('inter');
    expect(DEFAULT_ICON_LIBRARY).toBe('lucide');
  });

  it('lets components.json say `css` as well as the eight styles', () => {
    expect(CONFIG_STYLES).toEqual(['css', ...STYLE_IDS]);
  });

  it('offers seven base colors and 17 accents with readable labels', () => {
    expect(ids(BASE_COLORS)).toEqual(['neutral', 'stone', 'zinc', 'mauve', 'olive', 'mist', 'taupe']);
    expect(ACCENT_COLORS).toHaveLength(17);
    expect(BASE_COLORS[0]?.label).toBe('Neutral');
    expect(ACCENT_COLORS.find(color => color.value === 'emerald')?.label).toBe('Emerald');
  });

  it('groups 26 fonts as sans, mono and serif, in the order of the picker', () => {
    expect(FONTS.map(font => font.kind)).toEqual([
      ...Array<string>(17).fill('sans'),
      'mono',
      'mono',
      ...Array<string>(7).fill('serif'),
    ]);
    expect(FONTS[0]?.id).toBe('geist');
    expect(fontById('inter')?.label).toBe('Inter');
    expect(fontById('nope')).toBeUndefined();
  });

  it('offers five icon libraries', () => {
    expect(ids(ICON_LIBRARIES)).toEqual(['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon']);
  });

  it('offers the radii of the builder', () => {
    expect(RADII.map(radius => [radius.value, radius.css])).toEqual([
      ['default', null],
      ['none', '0rem'],
      ['small', '0.45rem'],
      ['medium', '0.625rem'],
      ['large', '0.875rem'],
    ]);
  });

  it('offers the menu settings', () => {
    expect(ids(MENU_COLORS)).toEqual(['default', 'inverted']);
    expect(ids(MENU_APPEARANCES)).toEqual(['solid', 'translucent']);
    expect(ids(MENU_ACCENTS)).toEqual(['subtle', 'bold']);
  });
});

/**
 * The picker lists and the codec tables are two views of the same set. One without the other is
 * either a code nobody can write or an option nobody can pick.
 */
describe('the option lists agree with the codec tables', () => {
  const same = (shown: string[], coded: readonly string[]) => expect([...shown].sort()).toEqual([...coded].sort());

  it.each([
    ['styles', () => ids(STYLES), PRESET_TABLES.style],
    ['base colors', () => ids(BASE_COLORS), PRESET_TABLES.baseColor],
    ['fonts', () => FONTS.map(font => font.id), PRESET_TABLES.font],
    ['icon libraries', () => ids(ICON_LIBRARIES), PRESET_TABLES.iconLibrary],
    ['radii', () => ids(RADII), PRESET_TABLES.radius],
    ['menu colors', () => ids(MENU_COLORS), PRESET_TABLES.menuColor],
    ['menu appearances', () => ids(MENU_APPEARANCES), PRESET_TABLES.menuAppearance],
    ['menu accents', () => ids(MENU_ACCENTS), PRESET_TABLES.menuAccent],
    ['themes', () => [...ids(BASE_COLORS), ...ids(ACCENT_COLORS)], PRESET_TABLES.theme],
  ])('%s', (_name, shown, coded) => {
    same(shown(), coded);
  });
});

describe('the icon libraries agree with the icon families the CLI installs', () => {
  it.each(ICON_LIBRARIES.map(library => [library.value, library] as const))('%s', (value, library) => {
    const family = ICON_FAMILIES[value];

    expect(family).toBeDefined();
    expect(family?.package).toBe(library.package);
    expect(family?.prefix).toBe(library.prefix);
    expect(family?.label).toBe(library.label);
  });
});

describe('the color data', () => {
  it('has a token set for each base color and each accent', () => {
    expect(Object.keys(BASE_COLOR_TOKENS).sort()).toEqual(ids(BASE_COLORS).sort());
    expect(Object.keys(THEME_COLOR_TOKENS).sort()).toEqual(ids(ACCENT_COLORS).sort());
  });

  it('gives every base color the same keys in light and dark, 32 of them', () => {
    for (const [name, set] of Object.entries(BASE_COLOR_TOKENS)) {
      expect(Object.keys(set.light).length).toBe(32);
      expect(Object.keys(set.dark).sort()).toEqual(Object.keys(set.light).sort());
      expect(set.light['destructive-foreground']).toBe(set.light['primary-foreground']);
      expect(name).toBeTruthy();
    }
  });

  it('gives every accent a primary and a full chart ramp in both modes', () => {
    for (const set of Object.values(THEME_COLOR_TOKENS)) {
      for (const mode of [set.light, set.dark]) {
        for (const token of ['primary', 'primary-foreground', 'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5']) {
          expect(mode[token]).toMatch(/^oklch\(/);
        }
      }
    }
  });

  it('only uses oklch colors', () => {
    for (const set of [...Object.values(BASE_COLOR_TOKENS), ...Object.values(THEME_COLOR_TOKENS)]) {
      for (const value of [...Object.values(set.light), ...Object.values(set.dark)])
        expect(value).toMatch(/^oklch\(.+\)$/);
    }
  });
});

describe('the published document', () => {
  const document = buildDesignDocument(1);

  it('carries the codec version, the default code and the curated presets', () => {
    expect(document.codec.version).toBe('Z');
    expect(document.defaultPreset).toBe('Z0');
    expect(document.presets.shuffle).toHaveLength(25);
    expect(document.presets.shuffle[0]).toBe(encodePreset(SHUFFLE_PRESETS[0]!));
    expect(Object.keys(document.presets.reset).sort()).toEqual([...STYLE_IDS].sort());
  });

  it('survives JSON, and reads back as the data it was made from', () => {
    const data = designDataFrom(JSON.parse(JSON.stringify(document)));

    expect(data.fonts).toEqual(BUNDLED_DESIGN_DATA.fonts);
    expect(data.baseColors).toEqual(BUNDLED_DESIGN_DATA.baseColors);
    expect(data.accents).toEqual(BUNDLED_DESIGN_DATA.accents);
  });

  it('overrides entry by entry: one corrected font does not erase the other twenty-five', () => {
    const data = designDataFrom({
      ...document,
      fonts: [{ ...fontById('inter')!, package: '@fontsource-variable/inter-fixed' }],
    });

    expect(data.fonts.find(font => font.id === 'inter')?.package).toBe('@fontsource-variable/inter-fixed');
    expect(data.fonts).toHaveLength(26);
  });

  it('refuses a document that is not one', () => {
    expect(() => designDataFrom({ schemaVersion: 1 })).toThrow(/missing/);
  });
});
