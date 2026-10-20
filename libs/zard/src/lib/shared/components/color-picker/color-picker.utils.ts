import { clamp } from '@/shared/utils/number';

/** Format of the string the color picker emits and shows in its text field. */
export type ZardColorFormat = 'hex' | 'rgb' | 'hsl' | 'oklch';

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

/** OKLCH as CSS writes it: lightness 0–1, chroma from 0 (about 0.37 at the edge of sRGB), hue in degrees. */
export interface ZardOklch {
  l: number;
  c: number;
  h: number;
  a: number;
}

type Vec3 = [number, number, number];

/**
 * Turns a CSS color the parser does not understand (a named color like `rebeccapurple`)
 * into one it does. Injected so the utils stay pure; the component passes a canvas-based one in the browser.
 */
export type ZardColorResolver = (value: string) => string | null;

const HEX_PATTERN = /^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;
const FUNCTION_PATTERN = /^(rgba?|hsla?|oklch)\(\s*([^)]*)\)$/i;

/** Chroma that `100%` stands for in `oklch()`, per CSS Color 4. */
const OKLCH_CHROMA_PERCENT = 0.4;
/** Smallest OKLab distance a person can tell apart; gamut mapping stops once clipping costs less than this. */
const OKLAB_JND = 0.02;

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

export function rgbaToOklch({ r, g, b, a }: ZardRgba): ZardOklch {
  const [l, labA, labB] = linearRgbToOklab([r, g, b].map(channel => srgbToLinear(channel / 255)) as Vec3);
  const c = Math.hypot(labA, labB);
  // Below this the hue is noise from the matrices, not a color.
  const h = c < 1e-4 ? 0 : ((Math.atan2(labB, labA) * 180) / Math.PI + 360) % 360;
  return { l, c, h, a };
}

/** Converts to sRGB, bringing colors sRGB cannot show into gamut (lower chroma, same lightness and hue). */
export function oklchToRgba({ l, c, h, a }: ZardOklch): ZardRgba {
  const [r, g, b] = mapOklchToSrgb(clamp(l, [0, 1]), Math.max(c, 0), h);
  return { r: r * 255, g: g * 255, b: b * 255, a };
}

/**
 * Parses hex (`#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`), `rgb()`/`rgba()` and `hsl()`/`hsla()` in both the
 * comma and the space-separated (`rgb(0 0 0 / 50%)`) syntax, and `oklch()` (space-separated only, as in CSS).
 * Anything else goes through `resolve`, if given. Returns `null` for input that is not a color.
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

  if (format === 'oklch') {
    const { l, c, h } = rgbaToOklch(hsvaToRgba(color));
    // The fewest decimals that still read back as the same 8-bit color: chroma needs one more than lightness.
    const chroma = round(c, 5);
    // A gray rounded to no chroma has no hue either; writing one would only be noise.
    const body = `${round(l, 4)} ${chroma} ${chroma ? round(h, 2) % 360 : 0}`;
    return a < 1 ? `oklch(${body} / ${a})` : `oklch(${body})`;
  }

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

  // Alpha is rounded straight to a byte here: going through two decimals first would turn `#ff000081` into `…82`.
  const hex = (n: number) => n.toString(16).padStart(2, '0');
  const alphaByte = alpha ? Math.round(color.a * 255) : 255;
  return `#${channels.map(hex).join('')}${alphaByte < 255 ? hex(alphaByte) : ''}`;
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

  if (match[1] === 'oklch') {
    return match[2].includes(',') ? null : parseOklch(parts, a);
  }

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

/** `none` (a missing component, which CSS reads as 0) is allowed in any of the three channels. */
function parseOklch(parts: string[], a: number): ZardHsva | null {
  const [l, c] = [parseUnit(parts[0], 1), parseUnit(parts[1], OKLCH_CHROMA_PERCENT)].map((value, i) =>
    parts[i] === 'none' ? 0 : value,
  );
  const h = parts[2] === 'none' ? 0 : /^-?[\d.]+(deg)?$/.test(parts[2]) ? parseFloat(parts[2]) : NaN;
  if (l === null || c === null || Number.isNaN(h)) {
    return null;
  }
  return rgbaToHsva(oklchToRgba({ l, c, h: ((h % 360) + 360) % 360, a }));
}

function srgbToLinear(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

/** Mirrored around 0, so the slightly negative channels of an out-of-gamut color survive the trip. */
function linearToSrgb(channel: number): number {
  const magnitude = Math.abs(channel);
  const encoded = magnitude <= 0.0031308 ? magnitude * 12.92 : 1.055 * magnitude ** (1 / 2.4) - 0.055;
  return Math.sign(channel) * encoded;
}

/** Linear sRGB → OKLab, with Björn Ottosson's matrices (the ones CSS Color 4 uses). */
function linearRgbToOklab([r, g, b]: Vec3): Vec3 {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabToLinearRgb([lightness, a, b]: Vec3): Vec3 {
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

function oklchToOklab(l: number, c: number, h: number): Vec3 {
  const radians = (h * Math.PI) / 180;
  return [l, c * Math.cos(radians), c * Math.sin(radians)];
}

/** Gamma-encoded sRGB (0–1 when in gamut). */
function oklabToSrgb(lab: Vec3): Vec3 {
  return oklabToLinearRgb(lab).map(linearToSrgb) as Vec3;
}

function isInGamut(rgb: Vec3): boolean {
  return rgb.every(channel => channel >= -1e-6 && channel <= 1 + 1e-6);
}

function clip(rgb: Vec3): Vec3 {
  return rgb.map(channel => clamp(channel, [0, 1])) as Vec3;
}

function distance(first: Vec3, second: Vec3): number {
  return Math.hypot(first[0] - second[0], first[1] - second[1], first[2] - second[2]);
}

/**
 * The CSS Color 4 gamut mapping: bisect chroma at fixed lightness and hue until clipping what is left
 * changes the color by less than a just-noticeable difference.
 */
function mapOklchToSrgb(l: number, c: number, h: number): Vec3 {
  const origin = oklabToSrgb(oklchToOklab(l, c, h));
  if (isInGamut(origin)) {
    return clip(origin);
  }
  if (l >= 1) {
    return [1, 1, 1];
  }
  if (l <= 0) {
    return [0, 0, 0];
  }

  const clippedError = (chroma: number) => {
    const lab = oklchToOklab(l, chroma, h);
    const clipped = clip(oklabToSrgb(lab));
    return { clipped, error: distance(linearRgbToOklab(clipped.map(srgbToLinear) as Vec3), lab) };
  };

  let current = clippedError(c);
  if (current.error < OKLAB_JND) {
    return current.clipped;
  }

  let min = 0;
  let max = c;
  let minInGamut = true;
  while (max - min > 1e-4) {
    const chroma = (min + max) / 2;
    if (minInGamut && isInGamut(oklabToSrgb(oklchToOklab(l, chroma, h)))) {
      min = chroma;
      continue;
    }
    current = clippedError(chroma);
    if (current.error < OKLAB_JND) {
      if (OKLAB_JND - current.error < 1e-4) {
        return current.clipped;
      }
      minInGamut = false;
      min = chroma;
    } else {
      max = chroma;
    }
  }
  return current.clipped;
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
