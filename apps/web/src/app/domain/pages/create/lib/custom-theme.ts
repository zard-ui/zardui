import { formatColor, parseColor } from '@zard/components/color-picker/color-picker.utils';
import {
  DEFAULT_DESIGN,
  renderResolvedTokenBlocks,
  renderThemeBlock,
  resolveTokens,
  THEME_END,
  THEME_START,
} from '@zard/design';
import type { DesignConfig, ResolvedTokens } from '@zard/design';

/**
 * A hand-edited theme: the `/create` page's Custom mode.
 *
 * The preset still says where the theme starts (base color, theme, chart color, menu accent, radius); a custom theme
 * is what the user changed on top of it, token by token and mode by mode. Only those changes travel, in the `custom`
 * query param, so a link stays short and undo/redo keep working. It is never a preset: the CLI cannot install it, the
 * Get Code dialog hands out its CSS for a manual install instead.
 */

export type ThemeMode = 'light' | 'dark';

/** The editable tokens, in the groups the editor shows them in (the order of the CSS the CLI writes). */
export const CUSTOM_TOKEN_GROUPS = [
  {
    id: 'base',
    label: 'Base',
    tokens: [
      'background',
      'foreground',
      'card',
      'card-foreground',
      'popover',
      'popover-foreground',
      'primary',
      'primary-foreground',
      'secondary',
      'secondary-foreground',
      'muted',
      'muted-foreground',
      'accent',
      'accent-foreground',
      'destructive',
      'destructive-foreground',
    ],
  },
  { id: 'form', label: 'Form', tokens: ['border', 'input', 'ring'] },
  { id: 'chart', label: 'Chart', tokens: ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'] },
  {
    id: 'sidebar',
    label: 'Sidebar',
    tokens: [
      'sidebar',
      'sidebar-foreground',
      'sidebar-primary',
      'sidebar-primary-foreground',
      'sidebar-accent',
      'sidebar-accent-foreground',
      'sidebar-border',
      'sidebar-ring',
    ],
  },
] as const;

export type CustomToken = (typeof CUSTOM_TOKEN_GROUPS)[number]['tokens'][number];

export const CUSTOM_TOKENS: readonly CustomToken[] = CUSTOM_TOKEN_GROUPS.flatMap(group => group.tokens);

export type CustomTokenValues = Readonly<Partial<Record<CustomToken, string>>>;

export interface CustomTheme {
  readonly light: CustomTokenValues;
  readonly dark: CustomTokenValues;
}

export const EMPTY_CUSTOM_THEME: CustomTheme = Object.freeze({ light: Object.freeze({}), dark: Object.freeze({}) });

/**
 * The parts of a design a custom theme cannot carry into a project: a manual install is CSS only, so the style,
 * fonts, icons and menu go back to zard's defaults while Custom is on.
 */
export const CUSTOM_DESIGN_DEFAULTS: Readonly<Partial<DesignConfig>> = Object.freeze({
  style: DEFAULT_DESIGN.style,
  font: DEFAULT_DESIGN.font,
  fontHeading: DEFAULT_DESIGN.fontHeading,
  iconLibrary: DEFAULT_DESIGN.iconLibrary,
  menuColor: DEFAULT_DESIGN.menuColor,
  menuAppearance: DEFAULT_DESIGN.menuAppearance,
});

/** The URL value of a custom theme with nothing changed yet: Custom is on, every token is still the preset's. */
export const EMPTY_CUSTOM_CODE = '~';

const isCustomToken = (value: string): value is CustomToken => (CUSTOM_TOKENS as readonly string[]).includes(value);

/**
 * A color as the theme stores it: any CSS color the picker can read, rewritten as `oklch(…)`. Anything else is
 * `null`. This is the only gate between the URL and the `<style>` the preview injects, so nothing that is not a color
 * (a `;`, a `}`, a `url(…)`) ever reaches it.
 */
export function normalizeThemeColor(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > 64) return null;

  const color = parseColor(value.trim());
  return color ? formatColor(color, 'oklch', true) : null;
}

function cleanValues(input: unknown): CustomTokenValues {
  if (typeof input !== 'object' || input === null) return {};

  const values: Partial<Record<CustomToken, string>> = {};
  for (const [key, raw] of Object.entries(input)) {
    if (!isCustomToken(key)) continue;
    const color = normalizeThemeColor(raw);
    if (color) values[key] = color;
  }
  return values;
}

export function isCustomThemeEmpty(theme: CustomTheme): boolean {
  return Object.keys(theme.light).length === 0 && Object.keys(theme.dark).length === 0;
}

/** `~` for no changes, otherwise the changes as base64url JSON (`{"l":{…},"d":{…}}`, empty modes left out). */
export function encodeCustomTheme(theme: CustomTheme): string {
  if (isCustomThemeEmpty(theme)) return EMPTY_CUSTOM_CODE;

  const payload: Record<string, CustomTokenValues> = {};
  if (Object.keys(theme.light).length) payload['l'] = sortValues(theme.light);
  if (Object.keys(theme.dark).length) payload['d'] = sortValues(theme.dark);

  return toBase64Url(JSON.stringify(payload));
}

/**
 * The custom theme in a `custom` param, or `null` when there is none (Custom is off). A value that cannot be read
 * still means Custom is on: it opens with no changes rather than dropping the user out of the mode.
 */
export function decodeCustomTheme(code: string | null): CustomTheme | null {
  if (code === null) return null;
  if (code === '' || code === EMPTY_CUSTOM_CODE) return EMPTY_CUSTOM_THEME;

  try {
    const payload = JSON.parse(fromBase64Url(code)) as { l?: unknown; d?: unknown };
    return { light: cleanValues(payload?.l), dark: cleanValues(payload?.d) };
  } catch {
    return EMPTY_CUSTOM_THEME;
  }
}

/** A custom theme from anywhere outside this module (a message, storage): only known tokens and real colors stay. */
export function sanitizeCustomTheme(value: unknown): CustomTheme | null {
  if (typeof value !== 'object' || value === null) return null;
  const { light, dark } = value as { light?: unknown; dark?: unknown };
  return { light: cleanValues(light), dark: cleanValues(dark) };
}

/** The tokens a design resolves to, with the custom theme's changes on top. */
export function resolveCustomTokens(design: DesignConfig, theme: CustomTheme): ResolvedTokens {
  const base = resolveTokens(design);
  return {
    light: { ...base.light, ...theme.light },
    dark: { ...base.dark, ...theme.dark },
  };
}

/**
 * The theme with one token set. A value equal to what the preset gives that token is no change, so it is dropped:
 * picking a color and picking it back leaves the URL as it was.
 */
export function withCustomToken(
  theme: CustomTheme,
  design: DesignConfig,
  mode: ThemeMode,
  token: CustomToken,
  value: string,
): CustomTheme {
  const color = normalizeThemeColor(value);
  if (!color) return theme;

  const preset = normalizeThemeColor(resolveTokens(design)[mode][token]);
  const values: Partial<Record<CustomToken, string>> = { ...theme[mode] };
  if (color === preset) delete values[token];
  else values[token] = color;

  return { ...theme, [mode]: values };
}

/** The theme with every change to one mode (or both) dropped. */
export function withoutCustomChanges(theme: CustomTheme, mode?: ThemeMode): CustomTheme {
  if (!mode) return EMPTY_CUSTOM_THEME;
  return { ...theme, [mode]: {} };
}

export function customThemesEqual(a: CustomTheme | null, b: CustomTheme | null): boolean {
  if (a === null || b === null) return a === b;
  return encodeCustomTheme(a) === encodeCustomTheme(b);
}

/** The `:root` and `.dark` blocks the preview injects for a custom theme. */
export function renderCustomTokenBlocks(design: DesignConfig, theme: CustomTheme): string {
  return renderResolvedTokenBlocks(resolveCustomTokens(design, theme));
}

/**
 * The stylesheet a manual install pastes: the same `:root`, `.dark`, `@theme inline` and base layer the CLI writes,
 * without the markers the CLI uses to find its own block again.
 */
export function renderCustomThemeCss(design: DesignConfig, theme: CustomTheme): string {
  return renderThemeBlock(design, { tokens: resolveCustomTokens(design, theme) })
    .split('\n')
    .filter(line => line !== THEME_START && line !== THEME_END)
    .join('\n')
    .trim()
    .concat('\n');
}

function sortValues(values: CustomTokenValues): CustomTokenValues {
  const sorted: Partial<Record<CustomToken, string>> = {};
  for (const token of CUSTOM_TOKENS) {
    if (values[token]) sorted[token] = values[token];
  }
  return sorted;
}

function toBase64Url(text: string): string {
  return btoa(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(code: string): string {
  if (!/^[A-Za-z0-9_-]+$/.test(code)) throw new Error('Not base64url');
  const base64 = code.replace(/-/g, '+').replace(/_/g, '/');
  return atob(base64 + '='.repeat((4 - (base64.length % 4)) % 4));
}
