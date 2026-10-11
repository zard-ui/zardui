/**
 * `design.json` — the design system as the registry publishes it.
 *
 * Everything the CLI needs to resolve a preset code lives here: the option lists, the color tokens,
 * the fonts with their packages. The CLI bundles the same data (`BUNDLED_DESIGN_DATA`), so a registry
 * that does not publish the file — an older one, or no network — changes nothing; a registry that
 * does can correct a token or a font package without a CLI release.
 *
 * The codec tables are published for reference only. They are NOT read back: a code is always
 * decoded with the tables compiled into the CLI, because a table that could change under a shared
 * code would defeat the point of the append-only contract.
 */

import { PRESET_TABLES, PRESET_VERSION, encodePreset } from './codec.js';
import { DEFAULT_DESIGN } from './config.js';
import { BUNDLED_DESIGN_DATA, type DesignData } from './css.js';
import {
  ACCENT_COLORS,
  BASE_COLORS,
  FONTS,
  ICON_LIBRARIES,
  MENU_ACCENTS,
  MENU_APPEARANCES,
  MENU_COLORS,
  RADII,
  STYLES,
  type FontOption,
} from './options.js';
import { SHUFFLE_PRESETS, STYLE_RESET_PRESETS } from './presets.js';
import { BASE_COLOR_TOKENS, THEME_COLOR_TOKENS, type ThemeTokenSet } from './theme-data.js';

export const DESIGN_DOCUMENT_SCHEMA = 'https://zardui.com/schema/design.json';

export interface DesignDocument {
  $schema?: string;
  schemaVersion?: number;
  codec?: { version: string; tables: Record<string, readonly string[]> };
  defaults?: Record<string, string>;
  defaultPreset?: string;
  styles?: unknown;
  baseColors?: unknown;
  accentColors?: unknown;
  fonts?: readonly FontOption[];
  iconLibraries?: unknown;
  radii?: unknown;
  menuColors?: unknown;
  menuAppearances?: unknown;
  menuAccents?: unknown;
  baseColorTokens?: Readonly<Record<string, ThemeTokenSet>>;
  accentTokens?: Readonly<Record<string, ThemeTokenSet>>;
  presets?: { shuffle: readonly string[]; reset: Readonly<Record<string, string>> };
}

/** The document the registry build writes. */
export function buildDesignDocument(schemaVersion: number): Required<DesignDocument> {
  return {
    $schema: DESIGN_DOCUMENT_SCHEMA,
    schemaVersion,
    codec: { version: PRESET_VERSION, tables: PRESET_TABLES },
    defaults: { ...DEFAULT_DESIGN },
    defaultPreset: encodePreset(DEFAULT_DESIGN),
    styles: STYLES,
    baseColors: BASE_COLORS,
    accentColors: ACCENT_COLORS,
    fonts: FONTS,
    iconLibraries: ICON_LIBRARIES,
    radii: RADII,
    menuColors: MENU_COLORS,
    menuAppearances: MENU_APPEARANCES,
    menuAccents: MENU_ACCENTS,
    baseColorTokens: BASE_COLOR_TOKENS,
    accentTokens: THEME_COLOR_TOKENS,
    presets: {
      shuffle: SHUFFLE_PRESETS.map(design => encodePreset(design)),
      reset: Object.fromEntries(
        Object.entries(STYLE_RESET_PRESETS).map(([style, design]) => [style, encodePreset(design)]),
      ),
    },
  };
}

/**
 * The data a published document overrides: the color tokens and the fonts.
 *
 * Anything the document omits keeps the bundled value, entry by entry, so a registry publishing one
 * corrected font does not erase the other twenty-five. Throws when the document has the wrong shape,
 * so the caller can fall back to the bundled data as a whole.
 */
export function designDataFrom(document: DesignDocument): DesignData {
  const { baseColorTokens, accentTokens, fonts } = document;

  if (!baseColorTokens || !accentTokens || !Array.isArray(fonts)) {
    throw new Error('design.json is missing baseColorTokens, accentTokens or fonts');
  }

  const overrideFonts = new Map(fonts.map(font => [font.id, font]));

  return {
    baseColors: { ...BUNDLED_DESIGN_DATA.baseColors, ...baseColorTokens },
    accents: { ...BUNDLED_DESIGN_DATA.accents, ...accentTokens },
    fonts: [
      ...BUNDLED_DESIGN_DATA.fonts.map(font => overrideFonts.get(font.id) ?? font),
      ...fonts.filter(font => !BUNDLED_DESIGN_DATA.fonts.some(bundled => bundled.id === font.id)),
    ],
  };
}
