/**
 * The preset code: a whole design in a short string.
 *
 * ```
 * Z  <base62 of the packed fields>
 * ```
 *
 * The first character is the format version (`Z`: zard's own — shadcn's start with `a` or `b`, so a
 * code from there is recognised and refused instead of being misread). The rest is a base62 number
 * whose bits are the index of each field's value in the tables below, in field order, least
 * significant first.
 *
 * THE CONTRACT — a code someone shared a year ago must keep decoding to the same design:
 *
 *   1. Never reorder or remove an entry of a table. Only append.
 *   2. Index 0 of every table is the default of that field, so a field that did not exist when a
 *      code was made reads as its default (the missing high bits are zero).
 *   3. New fields go at the end of `FIELDS`, with their own fixed width.
 *   4. A table may not outgrow its field's width (`2 ** bits` entries) — widening a field would shift
 *      every field after it. The widths below leave room to append.
 *
 * Packing uses BigInt, so there is no ceiling on the number of fields.
 */

import { normalizeDesign, type DesignConfig, type DesignField } from './config.js';

/** The version character. Raising it is for a change nobody can express by appending. */
export const PRESET_VERSION = 'Z';

/**
 * The value tables, in codec order — which is NOT the display order of `options.ts`. Index 0 is the
 * default. Append only.
 */
export const PRESET_TABLES = {
  style: ['nova', 'vega', 'maia', 'lyra', 'mira', 'luma', 'sera', 'rhea'],
  baseColor: ['neutral', 'stone', 'zinc', 'mauve', 'olive', 'mist', 'taupe'],
  theme: [
    'neutral',
    'stone',
    'zinc',
    'mauve',
    'olive',
    'mist',
    'taupe',
    'amber',
    'blue',
    'cyan',
    'emerald',
    'fuchsia',
    'green',
    'indigo',
    'lime',
    'orange',
    'pink',
    'purple',
    'red',
    'rose',
    'sky',
    'teal',
    'violet',
    'yellow',
  ],
  font: [
    'inter',
    'noto-sans',
    'nunito-sans',
    'figtree',
    'roboto',
    'raleway',
    'dm-sans',
    'public-sans',
    'outfit',
    'jetbrains-mono',
    'geist',
    'geist-mono',
    'lora',
    'merriweather',
    'playfair-display',
    'noto-serif',
    'roboto-slab',
    'oxanium',
    'manrope',
    'space-grotesk',
    'montserrat',
    'ibm-plex-sans',
    'source-sans-3',
    'instrument-sans',
    'eb-garamond',
    'instrument-serif',
  ],
  iconLibrary: ['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon'],
  radius: ['default', 'none', 'small', 'medium', 'large'],
  menuColor: ['default', 'inverted'],
  menuAppearance: ['solid', 'translucent'],
  menuAccent: ['subtle', 'bold'],
} as const satisfies Record<string, readonly string[]>;

interface FieldSpec {
  readonly key: DesignField;
  readonly table: readonly string[];
  readonly bits: number;
}

/** Field order is the bit layout. Append only. */
const FIELDS: readonly FieldSpec[] = [
  { key: 'style', table: PRESET_TABLES.style, bits: 5 },
  { key: 'baseColor', table: PRESET_TABLES.baseColor, bits: 5 },
  { key: 'theme', table: PRESET_TABLES.theme, bits: 6 },
  { key: 'chartColor', table: PRESET_TABLES.theme, bits: 6 },
  { key: 'font', table: PRESET_TABLES.font, bits: 6 },
  // `inherit` is index 0; font `n` is index `n + 1`.
  { key: 'fontHeading', table: ['inherit', ...PRESET_TABLES.font], bits: 6 },
  { key: 'iconLibrary', table: PRESET_TABLES.iconLibrary, bits: 4 },
  { key: 'radius', table: PRESET_TABLES.radius, bits: 4 },
  { key: 'menuColor', table: PRESET_TABLES.menuColor, bits: 2 },
  { key: 'menuAppearance', table: PRESET_TABLES.menuAppearance, bits: 2 },
  { key: 'menuAccent', table: PRESET_TABLES.menuAccent, bits: 2 },
];

const TOTAL_BITS = FIELDS.reduce((sum, field) => sum + field.bits, 0);

const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
/** A code never needs more than ceil(TOTAL_BITS / log2(62)) digits; this is the shape check's bound. */
const MAX_DIGITS = Math.ceil(TOTAL_BITS / Math.log2(62)) + 1;

export type PresetErrorReason =
  | 'empty'
  /** Starts with the version of another tool's format (shadcn/ui). */
  | 'foreign'
  | 'unknown-version'
  | 'malformed'
  /** Valid shape, but names an option this version of the tables does not have. */
  | 'newer';

/** Why a code could not be read. `message` always names the input. */
export class PresetError extends Error {
  constructor(
    readonly reason: PresetErrorReason,
    readonly input: string,
    message: string,
  ) {
    super(message);
    this.name = 'PresetError';
  }
}

function toBase62(value: bigint): string {
  if (value === 0n) return '0';

  let result = '';
  let rest = value;
  while (rest > 0n) {
    result = BASE62[Number(rest % 62n)] + result;
    rest /= 62n;
  }

  return result;
}

function fromBase62(digits: string): bigint {
  let result = 0n;
  for (const char of digits) result = result * 62n + BigInt(BASE62.indexOf(char));
  return result;
}

/**
 * The code for a design.
 *
 * The design is normalized first, so two spellings of the same design — a heading equal to the body
 * font, a radius on a style that forces its own — share one code, and `decodePreset(encodePreset(x))`
 * is `normalizeDesign(x)`.
 */
export function encodePreset(design: Partial<Record<DesignField, unknown>> = {}): string {
  const config = normalizeDesign(design);

  let packed = 0n;
  let offset = 0n;
  for (const field of FIELDS) {
    const index = field.table.indexOf(config[field.key]);
    packed |= BigInt(index === -1 ? 0 : index) << offset;
    offset += BigInt(field.bits);
  }

  return PRESET_VERSION + toBase62(packed);
}

/** Looks like a code of the shape this module writes — not necessarily one it can decode. */
export function isPresetCode(value: string): boolean {
  if (value.length < 2 || value.length > MAX_DIGITS + 1 || value[0] !== PRESET_VERSION) return false;
  return [...value.slice(1)].every(char => BASE62.includes(char));
}

/** shadcn/ui codes: `a` or `b`, then up to nine base62 characters. */
const SHADCN_SHAPE = /^[ab][0-9A-Za-z]{1,9}$/;

/**
 * The design a code describes.
 *
 * Throws `PresetError` for anything that is not one of ours: wrong version, a character outside
 * base62, more bits than the layout has, or an index past the end of a table (a code made by a newer
 * zard-cli, which knows options this one does not). The constraints are applied to the result.
 */
export function decodePreset(code: string): DesignConfig {
  const input = code.trim();

  if (input === '') throw new PresetError('empty', code, 'The preset code is empty.');

  if (input[0] !== PRESET_VERSION) {
    if (SHADCN_SHAPE.test(input)) {
      throw new PresetError(
        'foreign',
        input,
        `"${input}" looks like a shadcn/ui preset. zard presets start with "${PRESET_VERSION}" — ` +
          'build one at https://zardui.com/create.',
      );
    }

    throw new PresetError(
      'unknown-version',
      input,
      `"${input}" is not a zard preset code: they start with "${PRESET_VERSION}" (build one at https://zardui.com/create).`,
    );
  }

  const digits = input.slice(1);
  if (digits.length === 0 || digits.length > MAX_DIGITS || ![...digits].every(char => BASE62.includes(char))) {
    throw new PresetError('malformed', input, `"${input}" is not a valid preset code.`);
  }

  const packed = fromBase62(digits);
  if (packed >> BigInt(TOTAL_BITS) !== 0n) {
    throw new PresetError(
      'newer',
      input,
      `The preset "${input}" has more options than this zard-cli knows. Update with \`npm i -g zard-cli@latest\`.`,
    );
  }

  const values: Partial<Record<DesignField, string>> = {};
  let offset = 0n;
  for (const field of FIELDS) {
    const index = Number((packed >> offset) & ((1n << BigInt(field.bits)) - 1n));
    const value = field.table[index];

    if (value === undefined) {
      throw new PresetError(
        'newer',
        input,
        `The preset "${input}" uses an option (${field.key} #${index}) this zard-cli does not know. ` +
          'Update with `npm i -g zard-cli@latest`.',
      );
    }

    values[field.key] = value;
    offset += BigInt(field.bits);
  }

  return normalizeDesign(values);
}

export type PresetParseResult = { ok: true; design: DesignConfig; code: string } | { ok: false; error: PresetError };

/** `decodePreset` for callers that would rather branch than catch. The code is the canonical one. */
export function tryDecodePreset(code: string): PresetParseResult {
  try {
    const design = decodePreset(code);
    return { ok: true, design, code: encodePreset(design) };
  } catch (error) {
    if (error instanceof PresetError) return { ok: false, error };
    throw error;
  }
}

/**
 * The code inside whatever the user pasted: `Z3k`, `--preset Z3k`, `--preset=Z3k`, or a whole
 * `npx zard-cli init --preset Z3k` line.
 */
export function extractPresetCode(input: string): string {
  const trimmed = input.trim();
  const flag = /--preset(?:\s+|=)(["']?)(\S+?)\1(?:\s|$)/.exec(trimmed);

  if (flag?.[2]) return flag[2];
  if (/\s/.test(trimmed)) {
    throw new PresetError('malformed', input, `Could not find a preset code in "${trimmed}".`);
  }

  return trimmed.replace(/^["']|["']$/g, '');
}

/** `extractPresetCode` then `decodePreset`; the one entry point for user-typed input. */
export function parsePresetInput(input: string): { design: DesignConfig; code: string } {
  const design = decodePreset(extractPresetCode(input));
  return { design, code: encodePreset(design) };
}

/** The canonical code of the default design. */
export const DEFAULT_PRESET_CODE = encodePreset({});
