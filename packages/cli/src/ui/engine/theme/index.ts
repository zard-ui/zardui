/**
 * theme — semantic colour tokens, resolved and downsampled to the terminal's
 * capability. Themes are immutable; `extend` creates derived ones.
 */

import type { AnsiColor, ColorLevel } from '../ansi/index.js';
import type { ColorRef } from '../frame/index.js';

export type Color = string;

export interface ThemeTokens {
  primary: Color;
  secondary: Color;
  success: Color;
  warning: Color;
  danger: Color;
  muted: Color;
  foreground: Color;
  background: Color;
  border: Color;
}

export interface Theme {
  readonly tokens: ThemeTokens;
  resolve(ref: ColorRef | undefined, level: ColorLevel): AnsiColor;
  extend(partial: Partial<ThemeTokens>): Theme;
}

const DEFAULT_TOKENS: ThemeTokens = {
  primary: '#7c93ff',
  secondary: '#a78bfa',
  success: '#4ade80',
  warning: '#fbbf24',
  danger: '#f87171',
  muted: '#8b93a7',
  foreground: '#e6e9f0',
  background: '#0b0d12',
  border: '#2b3040',
};

const NAMED: Record<string, [number, number, number]> = {
  black: [0, 0, 0],
  red: [205, 49, 49],
  green: [13, 188, 121],
  yellow: [229, 229, 16],
  blue: [36, 114, 200],
  magenta: [188, 63, 188],
  cyan: [17, 168, 205],
  white: [229, 229, 229],
};

function parseColor(c: string): [number, number, number] | null {
  const s = c.trim().toLowerCase();
  const named = NAMED[s];
  if (named) return named;
  const hex = s.startsWith('#') ? s.slice(1) : null;
  if (hex && (hex.length === 3 || hex.length === 6)) {
    const full =
      hex.length === 3
        ? hex
            .split('')
            .map(ch => ch + ch)
            .join('')
        : hex;
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    if ([r, g, b].every(n => !Number.isNaN(n))) return [r, g, b];
  }
  const m = s.match(/rgb\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)\s*\)/);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
  return null;
}

// RGB → index in the 6x6x6 cube plus the ANSI-256 grayscale ramp.
function toAnsi256(r: number, g: number, b: number): number {
  if (r === g && g === b) {
    if (r < 8) return 16;
    if (r > 248) return 231;
    return Math.round(((r - 8) / 247) * 24) + 232;
  }
  const q = (v: number) => (v < 48 ? 0 : v < 115 ? 1 : Math.round((v - 35) / 40));
  return 16 + 36 * q(r) + 6 * q(g) + q(b);
}

const ANSI16: [number, number, number][] = [
  [0, 0, 0],
  [205, 49, 49],
  [13, 188, 121],
  [229, 229, 16],
  [36, 114, 200],
  [188, 63, 188],
  [17, 168, 205],
  [229, 229, 229],
  [102, 102, 102],
  [241, 76, 76],
  [35, 209, 139],
  [245, 245, 67],
  [59, 142, 234],
  [214, 112, 214],
  [41, 184, 219],
  [255, 255, 255],
];

function toAnsi16(r: number, g: number, b: number): number {
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < ANSI16.length; i++) {
    const c = ANSI16[i] as [number, number, number];
    const d = (r - c[0]) ** 2 + (g - c[1]) ** 2 + (b - c[2]) ** 2;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

function makeTheme(tokens: ThemeTokens): Theme {
  const cache = new Map<string, AnsiColor>();

  const resolve = (ref: ColorRef | undefined, level: ColorLevel): AnsiColor => {
    if (ref === undefined || level === 'none') return { kind: 'default' };
    const key = ref + '@' + level;
    const hit = cache.get(key);
    if (hit) return hit;

    const raw = (tokens as unknown as Record<string, string>)[ref] ?? ref;
    const rgb = parseColor(raw);
    let out: AnsiColor;
    if (!rgb) out = { kind: 'default' };
    else if (level === 'truecolor') out = { kind: 'rgb', r: rgb[0], g: rgb[1], b: rgb[2] };
    else if (level === 'ansi256') out = { kind: 'ansi256', index: toAnsi256(rgb[0], rgb[1], rgb[2]) };
    else out = { kind: 'ansi16', index: toAnsi16(rgb[0], rgb[1], rgb[2]) };

    cache.set(key, out);
    return out;
  };

  return {
    tokens,
    resolve,
    extend(partial) {
      return makeTheme({ ...tokens, ...partial });
    },
  };
}

export function createTheme(tokens: Partial<ThemeTokens> = {}): Theme {
  return makeTheme({ ...DEFAULT_TOKENS, ...tokens });
}

export const defaultTheme: Theme = makeTheme(DEFAULT_TOKENS);
