/**
 * The design as one value, its defaults, and the rules that keep it coherent.
 *
 * Some combinations make no sense — lyra is boxy by definition, a translucent menu cannot carry a
 * bold accent. Rather than refuse them, `normalizeDesign` bends them to the nearest valid design,
 * and `designConstraints` says which options a picker should grey out so the user never builds one
 * by hand. The preset codec applies the same function on both ends, so a code always describes a
 * design the rest of the system can render.
 */

import {
  DEFAULT_BASE_COLOR,
  DEFAULT_FONT,
  DEFAULT_FONT_HEADING,
  DEFAULT_ICON_LIBRARY,
  DEFAULT_STYLE,
  FONT_IDS,
  ICON_LIBRARY_IDS,
  INHERIT_FONT,
  MENU_ACCENT_IDS,
  MENU_APPEARANCE_IDS,
  MENU_COLOR_IDS,
  RADIUS_IDS,
  STYLE_IDS,
  isBaseColor,
  themesFor,
  type BaseColorId,
  type FontId,
  type IconLibraryId,
  type MenuAccentId,
  type MenuAppearanceId,
  type MenuColorId,
  type RadiusId,
  type StyleId,
  type ThemeColorId,
} from './options.js';

export interface DesignConfig {
  style: StyleId;
  baseColor: BaseColorId;
  /** The accent theme; equal to `baseColor` when there is none. */
  theme: ThemeColorId;
  /** Where the chart ramp comes from; follows the same list as `theme`. */
  chartColor: ThemeColorId;
  font: FontId;
  /** `inherit` or a font id different from `font`. */
  fontHeading: FontId;
  iconLibrary: IconLibraryId;
  radius: RadiusId;
  menuColor: MenuColorId;
  menuAppearance: MenuAppearanceId;
  menuAccent: MenuAccentId;
}

export type DesignField = keyof DesignConfig;

export const DESIGN_FIELDS: readonly DesignField[] = [
  'style',
  'baseColor',
  'theme',
  'chartColor',
  'font',
  'fontHeading',
  'iconLibrary',
  'radius',
  'menuColor',
  'menuAppearance',
  'menuAccent',
];

export const DEFAULT_DESIGN: Readonly<DesignConfig> = Object.freeze({
  style: DEFAULT_STYLE,
  baseColor: DEFAULT_BASE_COLOR,
  theme: DEFAULT_BASE_COLOR,
  chartColor: DEFAULT_BASE_COLOR,
  font: DEFAULT_FONT,
  fontHeading: DEFAULT_FONT_HEADING,
  iconLibrary: DEFAULT_ICON_LIBRARY,
  radius: 'default',
  menuColor: 'default',
  menuAppearance: 'solid',
  menuAccent: 'subtle',
});

/** Styles that force square corners. */
export const SQUARE_STYLES: readonly StyleId[] = ['lyra', 'sera'];

const inList = <T extends string>(list: readonly T[], value: unknown, fallback: T): T =>
  typeof value === 'string' && (list as readonly string[]).includes(value) ? (value as T) : fallback;

/**
 * The nearest valid design to what was asked for.
 *
 * Unknown values fall back to the default of their field, then the constraints apply in a fixed
 * order: the color pair first (everything else is independent of it), then the style's radius,
 * then the menu. Calling it twice changes nothing.
 */
export function normalizeDesign(input: Partial<Record<DesignField, unknown>> = {}): DesignConfig {
  const style = inList(STYLE_IDS, input.style, DEFAULT_DESIGN.style);
  const baseColor = isBaseColor(input.baseColor) ? input.baseColor : DEFAULT_DESIGN.baseColor;
  const themes = themesFor(baseColor);
  // The first valid entry is the base color itself — "no accent".
  const theme = inList(themes, input.theme, baseColor);
  const chartColor = inList(themes, input.chartColor, baseColor);

  const font = inList(FONT_IDS, input.font, DEFAULT_DESIGN.font);
  const requestedHeading = inList([INHERIT_FONT, ...FONT_IDS], input.fontHeading, INHERIT_FONT);
  const fontHeading = requestedHeading === font ? INHERIT_FONT : requestedHeading;

  let radius = inList(RADIUS_IDS, input.radius, DEFAULT_DESIGN.radius);
  if ((SQUARE_STYLES as readonly string[]).includes(style)) radius = 'none';
  else if (style === 'rhea' && radius === 'large') radius = 'default';

  const menuColor = inList(MENU_COLOR_IDS, input.menuColor, DEFAULT_DESIGN.menuColor);
  const menuAppearance = inList(MENU_APPEARANCE_IDS, input.menuAppearance, DEFAULT_DESIGN.menuAppearance);
  const menuAccent = menuAppearance === 'translucent' ? 'subtle' : inList(MENU_ACCENT_IDS, input.menuAccent, 'subtle');

  return {
    style,
    baseColor,
    theme,
    chartColor,
    font,
    fontHeading,
    iconLibrary: inList(ICON_LIBRARY_IDS, input.iconLibrary, DEFAULT_DESIGN.iconLibrary),
    radius,
    menuColor,
    menuAppearance,
    menuAccent,
  };
}

/** What a picker should offer for a design: what is greyed out, and why. */
export interface DesignConstraints {
  /** The radius is decided by the style; the whole picker is disabled. */
  readonly radiusLocked: boolean;
  readonly disabledRadii: readonly RadiusId[];
  /** `bold` is unavailable under a translucent menu. */
  readonly disabledMenuAccents: readonly MenuAccentId[];
  /** `inverted` is unavailable in dark mode, where the menu is already dark. */
  readonly disabledMenuColors: readonly MenuColorId[];
  /** The themes and chart colors valid for the current base color. */
  readonly themes: readonly ThemeColorId[];
  readonly chartColors: readonly ThemeColorId[];
  /** The heading font cannot be the body font; it reads "inherit" instead. */
  readonly disabledHeadings: readonly FontId[];
}

export function designConstraints(config: DesignConfig, options: { dark?: boolean } = {}): DesignConstraints {
  const radiusLocked = (SQUARE_STYLES as readonly string[]).includes(config.style);
  const themes = themesFor(config.baseColor);

  return {
    radiusLocked,
    disabledRadii: radiusLocked ? RADIUS_IDS.filter(id => id !== 'none') : config.style === 'rhea' ? ['large'] : [],
    disabledMenuAccents: config.menuAppearance === 'translucent' ? ['bold'] : [],
    disabledMenuColors: options.dark ? ['inverted'] : [],
    themes,
    chartColors: themes,
    disabledHeadings: [config.font],
  };
}

export function designsEqual(a: DesignConfig, b: DesignConfig): boolean {
  return DESIGN_FIELDS.every(field => a[field] === b[field]);
}
