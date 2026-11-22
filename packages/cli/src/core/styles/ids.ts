/**
 * The visual styles a project can be installed with.
 *
 * Eight looks, the same names shadcn/ui uses so a preset means the same thing in
 * both. They differ in spacing, radius, density and typography, never in the
 * component API.
 *
 * `css` is the legacy value of `components.json`'s `style`. It predates the
 * style system and means "the look the library always had", which is `nova`
 * exactly: installing with `css` must keep producing the same classes it
 * produced before there were styles.
 */

export const STYLE_IDS = ['vega', 'nova', 'maia', 'lyra', 'mira', 'luma', 'sera', 'rhea'] as const;

export type StyleId = (typeof STYLE_IDS)[number];

/** What `components.json` may hold in `style`: a style, or the legacy `css`. */
export type StyleSelection = StyleId | typeof LEGACY_STYLE;

/** The style new projects get. */
export const DEFAULT_STYLE: StyleId = 'nova';

/** The pre-style-system value of `components.json`'s `style`; resolves to {@link DEFAULT_STYLE}. */
export const LEGACY_STYLE = 'css';

export const STYLE_SELECTIONS: readonly StyleSelection[] = [LEGACY_STYLE, ...STYLE_IDS];

export function isStyleId(value: unknown): value is StyleId {
  return typeof value === 'string' && (STYLE_IDS as readonly string[]).includes(value);
}

export function isStyleSelection(value: unknown): value is StyleSelection {
  return value === LEGACY_STYLE || isStyleId(value);
}

/** `css` is the default look under its old name; every other selection is itself. */
export function resolveStyle(selection: StyleSelection): StyleId {
  return selection === LEGACY_STYLE ? DEFAULT_STYLE : selection;
}
