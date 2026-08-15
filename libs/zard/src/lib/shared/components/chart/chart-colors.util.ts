import type { ZardChartChromeColors, ZardChartConfig } from './chart.types';

/** How many `--chart-*` tokens the default palette cycles through. */
export const CHART_PALETTE_SIZE = 5;

const VAR_PATTERN = /^var\(\s*(--[^,)\s]+)\s*(?:,\s*([\s\S]+?))?\s*\)$/;
const HEX_PATTERN = /^#([0-9a-f]{3,8})$/i;
const FUNCTION_PATTERN = /^([a-z-]+)\(\s*([\s\S]*?)\s*\)$/i;
const MAX_VAR_DEPTH = 8;

/** CSS color functions that accept the modern `<channels> / <alpha>` syntax. */
const SLASH_ALPHA_FUNCTIONS = new Set(['color', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch', 'rgb', 'rgba']);

/** The two functions that also have a legacy comma syntax, mapped to their alpha-aware twin. */
const LEGACY_ALPHA_FUNCTIONS: Record<string, string> = { hsl: 'hsla', hsla: 'hsla', rgb: 'rgba', rgba: 'rgba' };

/** Canonical name to emit when writing the modern slash syntax. */
const CANONICAL_FUNCTIONS: Record<string, string> = { hsla: 'hsl', rgba: 'rgb' };

/**
 * Literal fallbacks used where `getComputedStyle` is unavailable — server-side rendering.
 * They mirror the light theme of `apps/web/src/styles.css` as hex, because ECharts' server
 * renderer is safer with sRGB values than with `oklch()`.
 */
const SSR_TOKEN_COLORS: Record<string, string> = {
  '--background': '#ffffff',
  '--border': '#e5e5e5',
  '--card': '#ffffff',
  '--chart-1': '#e76e50',
  '--chart-2': '#2a9d90',
  '--chart-3': '#274754',
  '--chart-4': '#e8c468',
  '--chart-5': '#f4a462',
  '--foreground': '#0a0a0a',
  '--muted-foreground': '#737373',
};

function readCssVariable(host: HTMLElement | null | undefined, token: string): string {
  if (!host || typeof globalThis.getComputedStyle !== 'function') {
    return SSR_TOKEN_COLORS[token] ?? '';
  }

  try {
    return globalThis.getComputedStyle(host).getPropertyValue(token).trim();
  } catch {
    return SSR_TOKEN_COLORS[token] ?? '';
  }
}

/**
 * Resolves a CSS color that may be a `var(--token)` reference into a literal value
 * ECharts can consume. Falls back to the var()'s own fallback, then to the raw input.
 */
export function resolveCssColor(host: HTMLElement | null | undefined, value: string, depth = 0): string {
  const raw = (value ?? '').trim();
  if (!raw || depth >= MAX_VAR_DEPTH) return raw;

  const match = VAR_PATTERN.exec(raw);
  if (!match) return raw;

  const [, token, fallback] = match;
  const computed = readCssVariable(host, token);
  if (computed) return resolveCssColor(host, computed, depth + 1);
  if (fallback) return resolveCssColor(host, fallback, depth + 1);

  return raw;
}

function hexWithAlpha(digits: string, alpha: number): string {
  const expanded = digits.length <= 4 ? [...digits].map(char => char + char).join('') : digits;
  const channel = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');

  return `#${expanded.slice(0, 6)}${channel}`;
}

/** Applies alpha to any CSS color, preferring oklch's native slash syntax. */
export function withAlpha(color: string, alpha: number): string {
  const raw = (color ?? '').trim();
  if (!raw) return raw;

  const clamped = Math.min(1, Math.max(0, alpha));

  const hex = HEX_PATTERN.exec(raw);
  if (hex) return hexWithAlpha(hex[1], clamped);

  const fn = FUNCTION_PATTERN.exec(raw);
  if (fn) {
    const name = fn[1].toLowerCase();
    const body = fn[2];

    if (SLASH_ALPHA_FUNCTIONS.has(name)) {
      if (!body.includes(',')) {
        const channels = body.split('/')[0].trim();
        return `${CANONICAL_FUNCTIONS[name] ?? name}(${channels} / ${clamped})`;
      }

      // Legacy comma syntax only exists for rgb()/hsl(), which have `rgba()`/`hsla()` counterparts.
      const legacy = LEGACY_ALPHA_FUNCTIONS[name];
      if (legacy) {
        const channels = body
          .split(',')
          .slice(0, 3)
          .map(part => part.trim())
          .join(', ');
        return `${legacy}(${channels}, ${clamped})`;
      }
    }
  }

  return `color-mix(in oklab, ${raw} ${Math.round(clamped * 100)}%, transparent)`;
}

/** Default palette: var(--chart-1) … var(--chart-5), cycling. */
export function paletteColor(index: number): string {
  const position = ((index % CHART_PALETTE_SIZE) + CHART_PALETTE_SIZE) % CHART_PALETTE_SIZE;
  return `var(--chart-${position + 1})`;
}

/** Resolves every color referenced by a ZardChartConfig for the current theme. */
export function resolveChartColors(
  host: HTMLElement | null | undefined,
  config: ZardChartConfig,
  isDark: boolean,
): Record<string, string> {
  const resolved: Record<string, string> = {};

  for (const [key, item] of Object.entries(config ?? {})) {
    const themed = isDark ? item?.theme?.dark : item?.theme?.light;
    const declared = themed ?? item?.color;
    if (!declared) continue;

    resolved[key] = resolveCssColor(host, declared);
  }

  return resolved;
}

/** Resolves the grid, axis and surface colors the chart chrome is painted with. */
export function resolveChartChrome(host: HTMLElement | null | undefined): ZardChartChromeColors {
  return {
    background: resolveCssColor(host, 'var(--background)'),
    border: resolveCssColor(host, 'var(--border)'),
    foreground: resolveCssColor(host, 'var(--foreground)'),
    mutedForeground: resolveCssColor(host, 'var(--muted-foreground)'),
  };
}
