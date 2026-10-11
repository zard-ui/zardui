/**
 * Every choice the design system offers, as plain data.
 *
 * This module — and everything else under `core/design` — is pure TypeScript with no Node
 * imports, so the CLI and the docs site read exactly the same lists. The display order here is
 * the order a picker shows; the order the preset code relies on lives in `codec.ts` and never
 * changes.
 */

// --- Styles -----------------------------------------------------------------------------------

export const STYLE_IDS = ['vega', 'nova', 'maia', 'lyra', 'mira', 'luma', 'sera', 'rhea'] as const;
export type StyleId = (typeof STYLE_IDS)[number];

export interface StyleOption {
  readonly value: StyleId;
  readonly label: string;
  readonly description: string;
}

export const STYLES: readonly StyleOption[] = [
  { value: 'vega', label: 'Vega', description: 'Clean, neutral, and familiar' },
  { value: 'nova', label: 'Nova', description: 'Reduced padding and margins' },
  { value: 'maia', label: 'Maia', description: 'Rounded, with generous spacing.' },
  { value: 'lyra', label: 'Lyra', description: 'Boxy and sharp. For mono fonts.' },
  { value: 'mira', label: 'Mira', description: 'Made for compact interfaces.' },
  { value: 'luma', label: 'Luma', description: 'Fluid, luminous, and soft.' },
  { value: 'sera', label: 'Sera', description: 'Editorial and typographic.' },
  { value: 'rhea', label: 'Rhea', description: 'Like Luma but compact.' },
];

export const DEFAULT_STYLE: StyleId = 'nova';

/**
 * What `components.json` `style` accepts: the eight styles plus `css`, the value every project
 * initialized before styles existed carries. `css` is treated as the current look (nova).
 */
export const LEGACY_STYLE = 'css';
export const CONFIG_STYLES = [LEGACY_STYLE, ...STYLE_IDS] as const;
export type ConfigStyle = (typeof CONFIG_STYLES)[number];

// --- Colors -----------------------------------------------------------------------------------

export const BASE_COLOR_IDS = ['neutral', 'stone', 'zinc', 'mauve', 'olive', 'mist', 'taupe'] as const;
export type BaseColorId = (typeof BASE_COLOR_IDS)[number];

export const ACCENT_COLOR_IDS = [
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
] as const;
export type AccentColorId = (typeof ACCENT_COLOR_IDS)[number];

/** A theme (or chart) color is either a base color — "no accent" — or one of the 17 accents. */
export type ThemeColorId = BaseColorId | AccentColorId;

export interface ColorOption<Id extends string = string> {
  readonly value: Id;
  readonly label: string;
}

const titleCase = (id: string): string => id.charAt(0).toUpperCase() + id.slice(1);

export const BASE_COLORS: readonly ColorOption<BaseColorId>[] = BASE_COLOR_IDS.map(value => ({
  value,
  label: titleCase(value),
}));

export const ACCENT_COLORS: readonly ColorOption<AccentColorId>[] = ACCENT_COLOR_IDS.map(value => ({
  value,
  label: titleCase(value),
}));

export const DEFAULT_BASE_COLOR: BaseColorId = 'neutral';

export function isBaseColor(value: unknown): value is BaseColorId {
  return (BASE_COLOR_IDS as readonly unknown[]).includes(value);
}

export function isAccentColor(value: unknown): value is AccentColorId {
  return (ACCENT_COLOR_IDS as readonly unknown[]).includes(value);
}

/**
 * The themes a base color can be paired with: itself (no accent) followed by the 17 accents.
 * The first entry is the fallback when a value does not belong.
 */
export function themesFor(baseColor: BaseColorId): readonly ThemeColorId[] {
  return [baseColor, ...ACCENT_COLOR_IDS];
}

/** The chart colors follow the same list as the themes. */
export const chartColorsFor = themesFor;

// --- Fonts ------------------------------------------------------------------------------------

export type FontKind = 'sans' | 'mono' | 'serif';

export interface FontOption {
  readonly id: string;
  readonly label: string;
  readonly kind: FontKind;
  /** The value of `--font-sans` / `--font-heading` once the font is loaded. */
  readonly family: string;
  /** The npm package that self-hosts it; its name is also what the stylesheet imports. */
  readonly package: string;
  /** The CSS custom property the font is conventionally exposed on. */
  readonly variable: '--font-sans' | '--font-mono' | '--font-serif';
}

const variableFont = (id: string, label: string, kind: FontKind, family = label): FontOption => ({
  id,
  label,
  kind,
  family: `'${family} Variable', ${kind === 'mono' ? 'monospace' : kind === 'serif' ? 'serif' : 'sans-serif'}`,
  package: `@fontsource-variable/${id}`,
  variable: kind === 'mono' ? '--font-mono' : kind === 'serif' ? '--font-serif' : '--font-sans',
});

/** Display order: sans, then mono, then serif — the groups of the font picker. */
export const FONTS: readonly FontOption[] = [
  variableFont('geist', 'Geist', 'sans'),
  variableFont('inter', 'Inter', 'sans'),
  variableFont('noto-sans', 'Noto Sans', 'sans'),
  variableFont('nunito-sans', 'Nunito Sans', 'sans'),
  variableFont('figtree', 'Figtree', 'sans'),
  variableFont('roboto', 'Roboto', 'sans'),
  variableFont('raleway', 'Raleway', 'sans'),
  variableFont('dm-sans', 'DM Sans', 'sans'),
  variableFont('public-sans', 'Public Sans', 'sans'),
  variableFont('outfit', 'Outfit', 'sans'),
  variableFont('oxanium', 'Oxanium', 'sans'),
  variableFont('manrope', 'Manrope', 'sans'),
  variableFont('space-grotesk', 'Space Grotesk', 'sans'),
  variableFont('montserrat', 'Montserrat', 'sans'),
  variableFont('ibm-plex-sans', 'IBM Plex Sans', 'sans'),
  variableFont('source-sans-3', 'Source Sans 3', 'sans'),
  variableFont('instrument-sans', 'Instrument Sans', 'sans'),
  variableFont('geist-mono', 'Geist Mono', 'mono'),
  variableFont('jetbrains-mono', 'JetBrains Mono', 'mono'),
  variableFont('noto-serif', 'Noto Serif', 'serif'),
  variableFont('roboto-slab', 'Roboto Slab', 'serif'),
  variableFont('merriweather', 'Merriweather', 'serif'),
  variableFont('lora', 'Lora', 'serif'),
  variableFont('playfair-display', 'Playfair Display', 'serif'),
  variableFont('eb-garamond', 'EB Garamond', 'serif'),
  // The one family fontsource only publishes as static weights.
  {
    id: 'instrument-serif',
    label: 'Instrument Serif',
    kind: 'serif',
    family: "'Instrument Serif', serif",
    package: '@fontsource/instrument-serif',
    variable: '--font-serif',
  },
];

export const FONT_IDS = FONTS.map(font => font.id);
export type FontId = string;

export const DEFAULT_FONT: FontId = 'inter';
/** `inherit` means "the heading uses the body font" — the value the heading picker starts on. */
export const INHERIT_FONT = 'inherit';
export const DEFAULT_FONT_HEADING: FontId = INHERIT_FONT;

export function fontById(id: string): FontOption | undefined {
  return FONTS.find(font => font.id === id);
}

// --- Icons ------------------------------------------------------------------------------------

export const ICON_LIBRARY_IDS = ['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon'] as const;
export type IconLibraryId = (typeof ICON_LIBRARY_IDS)[number];

export interface IconLibraryOption {
  readonly value: IconLibraryId;
  readonly label: string;
  /** The ng-icons package that exports the family's symbols. */
  readonly package: string;
  /** The prefix those symbols carry (`lucide` -> `lucideCheck`). */
  readonly prefix: string;
}

export const ICON_LIBRARIES: readonly IconLibraryOption[] = [
  { value: 'lucide', label: 'Lucide', package: '@ng-icons/lucide', prefix: 'lucide' },
  { value: 'tabler', label: 'Tabler Icons', package: '@ng-icons/tabler-icons', prefix: 'tabler' },
  { value: 'hugeicons', label: 'HugeIcons', package: '@ng-icons/huge-icons', prefix: 'huge' },
  { value: 'phosphor', label: 'Phosphor Icons', package: '@ng-icons/phosphor-icons', prefix: 'phosphor' },
  { value: 'remixicon', label: 'Remix Icon', package: '@ng-icons/remixicon', prefix: 'remix' },
];

export const DEFAULT_ICON_LIBRARY: IconLibraryId = 'lucide';

// --- Radius -----------------------------------------------------------------------------------

export const RADIUS_IDS = ['default', 'none', 'small', 'medium', 'large'] as const;
export type RadiusId = (typeof RADIUS_IDS)[number];

export interface RadiusOption {
  readonly value: RadiusId;
  readonly label: string;
  /** The `--radius` it writes; `null` keeps whatever the base color defines. */
  readonly css: string | null;
}

export const RADII: readonly RadiusOption[] = [
  { value: 'default', label: 'Default', css: null },
  { value: 'none', label: 'None', css: '0rem' },
  { value: 'small', label: 'Small', css: '0.45rem' },
  { value: 'medium', label: 'Medium', css: '0.625rem' },
  { value: 'large', label: 'Large', css: '0.875rem' },
];

/** What `--radius` is when the choice is `default`. */
export const BASE_RADIUS = '0.625rem';

// --- Menu -------------------------------------------------------------------------------------

export const MENU_COLOR_IDS = ['default', 'inverted'] as const;
export type MenuColorId = (typeof MENU_COLOR_IDS)[number];

export const MENU_APPEARANCE_IDS = ['solid', 'translucent'] as const;
export type MenuAppearanceId = (typeof MENU_APPEARANCE_IDS)[number];

export const MENU_ACCENT_IDS = ['subtle', 'bold'] as const;
export type MenuAccentId = (typeof MENU_ACCENT_IDS)[number];

export const MENU_COLORS: readonly ColorOption<MenuColorId>[] = [
  { value: 'default', label: 'Default' },
  { value: 'inverted', label: 'Inverted' },
];

export const MENU_APPEARANCES: readonly ColorOption<MenuAppearanceId>[] = [
  { value: 'solid', label: 'Solid' },
  { value: 'translucent', label: 'Translucent' },
];

export const MENU_ACCENTS: readonly ColorOption<MenuAccentId>[] = [
  { value: 'subtle', label: 'Subtle' },
  { value: 'bold', label: 'Bold' },
];

/** The rule behind "Use pointer on buttons". */
export const POINTER_SELECTOR = 'button:not(:disabled), [role="button"]:not(:disabled)';
