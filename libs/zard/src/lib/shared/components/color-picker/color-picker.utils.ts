import { clamp } from '@/shared/utils/number';

/** Format of the string the color picker emits and shows in its text field. */
export type ZardColorFormat = 'hex' | 'rgb' | 'hsl';

/**
 * Internal color model. Hue in degrees (0–360), saturation, value and alpha in 0–1.
 * HSV maps one-to-one onto the picker UI: the area is s/v, the tracks are h and a.
 */
export interface ZardHsva {
  h: number;
  s: number;
  v: number;
  a: number;
}

export interface ZardRgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Turns a CSS color the parser does not understand (a named color like `rebeccapurple`)
 * into one it does. Injected so the utils stay pure; the component passes a canvas-based one in the browser.
 */
export type ZardColorResolver = (value: string) => string | null;

const HEX_PATTERN = /^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;
const FUNCTION_PATTERN = /^(rgba?|hsla?)\(\s*([^)]*)\)$/i;

export function hsvaToRgba({ h, s, v, a }: ZardHsva): ZardRgba {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return { r: f(5) * 255, g: f(3) * 255, b: f(1) * 255, a };
}

export function rgbaToHsva({ r, g, b, a }: ZardRgba): ZardHsva {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255];
  const max = Math.max(rn, gn, bn);
  const delta = max - Math.min(rn, gn, bn);

  let h = 0;
  if (delta) {
    if (max === rn) {
      h = ((gn - bn) / delta) % 6;
    } else if (max === gn) {
      h = (bn - rn) / delta + 2;
    } else {
      h = (rn - gn) / delta + 4;
    }
  }

  return { h: (h * 60 + 360) % 360, s: max ? delta / max : 0, v: max, a };
}

export function hsvaToHsla({ h, s, v, a }: ZardHsva): { h: number; s: number; l: number; a: number } {
  const l = v * (1 - s / 2);
  const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
  return { h, s: sl, l, a };
}

export function hslaToHsva(h: number, s: number, l: number, a: number): ZardHsva {
  const v = l + s * Math.min(l, 1 - l);
  return { h, s: v ? 2 * (1 - l / v) : 0, v, a };
}

/**
 * Parses hex (`#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`), `rgb()`/`rgba()` and `hsl()`/`hsla()` in both the
 * comma and the space-separated (`rgb(0 0 0 / 50%)`) syntax. Anything else goes through `resolve`, if given.
 * Returns `null` for input that is not a color.
 */
export function parseColor(value: string | null | undefined, resolve?: ZardColorResolver): ZardHsva | null {
  const input = value?.trim().toLowerCase();
  if (!input) {
    return null;
  }

  const parsed = parseHex(input) ?? parseFunction(input);
  if (parsed || !resolve) {
    return parsed;
  }

  const resolved = resolve(input)?.trim().toLowerCase();
  return resolved && resolved !== input ? (parseHex(resolved) ?? parseFunction(resolved)) : null;
}

/** Serializes a color in the given format. Alpha is only written when `alpha` is on and the color is not opaque. */
export function formatColor(color: ZardHsva, format: ZardColorFormat, alpha = false): string {
  const a = alpha ? round(color.a, 2) : 1;

  if (format === 'hsl') {
    const { h, s, l } = hsvaToHsla(color);
    const body = `${Math.round(h) % 360}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
    return a < 1 ? `hsla(${body}, ${a})` : `hsl(${body})`;
  }

  const { r, g, b } = hsvaToRgba(color);
  const channels = [r, g, b].map(Math.round);

  if (format === 'rgb') {
    return a < 1 ? `rgba(${channels.join(', ')}, ${a})` : `rgb(${channels.join(', ')})`;
  }

  const hex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${channels.map(hex).join('')}${a < 1 ? hex(Math.round(a * 255)) : ''}`;
}

/** An `rgba()` string for inline styles, regardless of the emitted format. */
export function toCssColor(color: ZardHsva): string {
  const { r, g, b, a } = hsvaToRgba(color);
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${round(a, 3)})`;
}

/** Whether two colors render the same once rounded to 8-bit channels, used to mark the active preset. */
export function isSameColor(first: ZardHsva, second: ZardHsva): boolean {
  return formatColor(first, 'hex', true) === formatColor(second, 'hex', true);
}

function parseHex(input: string): ZardHsva | null {
  const match = HEX_PATTERN.exec(input);
  if (!match) {
    return null;
  }

  let digits = match[1];
  if (digits.length <= 4) {
    digits = [...digits].map(char => char + char).join('');
  }

  const [r, g, b, a = 255] = Array.from({ length: digits.length / 2 }, (_, i) =>
    parseInt(digits.slice(i * 2, i * 2 + 2), 16),
  );
  return rgbaToHsva({ r, g, b, a: a / 255 });
}

function parseFunction(input: string): ZardHsva | null {
  const match = FUNCTION_PATTERN.exec(input);
  if (!match) {
    return null;
  }

  const parts = match[2]
    .replace(/\s*\/\s*/, ' / ')
    .split(/\s*,\s*|\s+/)
    .filter(part => part && part !== '/');
  if (parts.length !== 3 && parts.length !== 4) {
    return null;
  }

  const alpha = parts[3] === undefined ? 1 : parseUnit(parts[3], 1);
  if (alpha === null) {
    return null;
  }
  const a = clamp(alpha, [0, 1]);

  if (match[1].startsWith('rgb')) {
    const channels = parts.slice(0, 3).map(part => parseUnit(part, 255));
    if (!channels.every(channel => channel !== null)) {
      return null;
    }
    const [r, g, b] = (channels as number[]).map(channel => clamp(channel, [0, 255]));
    return rgbaToHsva({ r, g, b, a });
  }

  // CSS Color 4 accepts bare numbers for saturation and lightness, read as percentages.
  const h = parseFloat(parts[0]);
  const [s, l] = parts.slice(1, 3).map(part => {
    const number = parseUnit(part.replace('%', ''), 1);
    return number === null ? null : number / 100;
  });
  if (Number.isNaN(h) || !/^-?[\d.]+(deg)?$/.test(parts[0]) || s === null || l === null) {
    return null;
  }
  return hslaToHsva(((h % 360) + 360) % 360, clamp(s, [0, 1]), clamp(l, [0, 1]), a);
}

/** Reads a number or a percentage; a percentage is scaled to `max` (`50%` of 255 is 127.5). */
function parseUnit(part: string, max: number): number | null {
  if (!/^-?[\d.]+%?$/.test(part)) {
    return null;
  }
  const number = parseFloat(part);
  if (Number.isNaN(number)) {
    return null;
  }
  return part.endsWith('%') ? (number / 100) * max : number;
}

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
