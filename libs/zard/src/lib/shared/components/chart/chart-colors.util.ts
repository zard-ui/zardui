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
  '--chart-1': '#8ec5ff',
  '--chart-2': '#2b7fff',
  '--chart-3': '#155dfc',
  '--chart-4': '#1447e6',
  '--chart-5': '#193cb8',
  '--foreground': '#0a0a0a',
  '--muted-foreground': '#737373',
};

let normalizer: CanvasRenderingContext2D | null | undefined;
const normalizedColors = new Map<string, string>();

function normalizerContext(): CanvasRenderingContext2D | null {
  if (normalizer !== undefined) {
    return normalizer;
  }

  try {
    const canvas = globalThis.document?.createElement('canvas');
    if (canvas) {
      canvas.width = canvas.height = 1;
    }
    normalizer = canvas?.getContext('2d', { willReadFrequently: true }) ?? null;
  } catch {
    normalizer = null;
  }

  return normalizer;
}

/**
 * Rewrites a CSS colour into sRGB.
 *
 * ECharts parses colours itself to derive the hover and blur shades of a series, and its parser
 * predates `oklch()` — which is what every shadcn theme token is written in. It paints the
 * untouched chart fine, because the browser resolves the string, but the moment a tooltip
 * highlights a point every unparsed colour comes back transparent and the series vanishes.
 * Painting one pixel and reading it back converts anything the browser understands.
 */
export function toCanvasColor(value: string): string {
  const raw = (value ?? '').trim();
  if (!raw || raw.startsWith('#') || raw.startsWith('rgb')) {
    return raw;
  }

  const cached = normalizedColors.get(raw);
  if (cached !== undefined) {
    return cached;
  }

  const context = normalizerContext();
  if (!context) {
    return raw;
  }

  context.clearRect(0, 0, 1, 1);
  // An unparseable colour leaves `fillStyle` on the transparent sentinel, painting nothing.
  context.fillStyle = 'rgba(0, 0, 0, 0)';
  context.fillStyle = raw;
  context.fillRect(0, 0, 1, 1);

  const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
  const resolved =
    alpha === 0
      ? raw
      : alpha === 255
        ? `rgb(${red}, ${green}, ${blue})`
        : `rgba(${red}, ${green}, ${blue}, ${alpha / 255})`;

  normalizedColors.set(raw, resolved);
  return resolved;
}

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

function readCssColor(host: HTMLElement | null | undefined, value: string, depth: number): string {
  const raw = (value ?? '').trim();
  if (!raw || depth >= MAX_VAR_DEPTH) {
    return raw;
  }

  const match = VAR_PATTERN.exec(raw);
  if (!match) {
    return raw;
  }

  const [, token, fallback] = match;
  const computed = readCssVariable(host, token);
  if (computed) {
    return readCssColor(host, computed, depth + 1);
  }
  if (fallback) {
    return readCssColor(host, fallback, depth + 1);
  }

  return raw;
}

/**
 * Resolves a CSS color that may be a `var(--token)` reference into a literal value
 * ECharts can consume. Falls back to the var()'s own fallback, then to the raw input.
 */
export function resolveCssColor(host: HTMLElement | null | undefined, value: string, depth = 0): string {
  return toCanvasColor(readCssColor(host, value, depth));
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
  return toCanvasColor(applyAlpha(color, alpha));
}

function applyAlpha(color: string, alpha: number): string {
  const raw = (color ?? '').trim();
  if (!raw) {
    return raw;
  }

  const clamped = Math.min(1, Math.max(0, alpha));

  const hex = HEX_PATTERN.exec(raw);
  if (hex) {
    return hexWithAlpha(hex[1], clamped);
  }

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
    if (!declared) {
      continue;
    }

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
