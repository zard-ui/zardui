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
 * The CSS Color 4 named colors as `name hex` pairs. A table instead of asking the browser (a canvas), so a
 * named value parses the same on the server and in the client and hydration matches.
 */
const NAMED_COLORS = new Map(
  `aliceblue f0f8ff antiquewhite faebd7 aqua 00ffff aquamarine 7fffd4 azure f0ffff beige f5f5dc bisque ffe4c4
  black 000000 blanchedalmond ffebcd blue 0000ff blueviolet 8a2be2 brown a52a2a burlywood deb887 cadetblue 5f9ea0
  chartreuse 7fff00 chocolate d2691e coral ff7f50 cornflowerblue 6495ed cornsilk fff8dc crimson dc143c cyan 00ffff
  darkblue 00008b darkcyan 008b8b darkgoldenrod b8860b darkgray a9a9a9 darkgreen 006400 darkgrey a9a9a9
  darkkhaki bdb76b darkmagenta 8b008b darkolivegreen 556b2f darkorange ff8c00 darkorchid 9932cc darkred 8b0000
  darksalmon e9967a darkseagreen 8fbc8f darkslateblue 483d8b darkslategray 2f4f4f darkslategrey 2f4f4f
  darkturquoise 00ced1 darkviolet 9400d3 deeppink ff1493 deepskyblue 00bfff dimgray 696969 dimgrey 696969
  dodgerblue 1e90ff firebrick b22222 floralwhite fffaf0 forestgreen 228b22 fuchsia ff00ff gainsboro dcdcdc
  ghostwhite f8f8ff gold ffd700 goldenrod daa520 gray 808080 green 008000 greenyellow adff2f grey 808080
  honeydew f0fff0 hotpink ff69b4 indianred cd5c5c indigo 4b0082 ivory fffff0 khaki f0e68c lavender e6e6fa
  lavenderblush fff0f5 lawngreen 7cfc00 lemonchiffon fffacd lightblue add8e6 lightcoral f08080 lightcyan e0ffff
  lightgoldenrodyellow fafad2 lightgray d3d3d3 lightgreen 90ee90 lightgrey d3d3d3 lightpink ffb6c1
  lightsalmon ffa07a lightseagreen 20b2aa lightskyblue 87cefa lightslategray 778899 lightslategrey 778899
  lightsteelblue b0c4de lightyellow ffffe0 lime 00ff00 limegreen 32cd32 linen faf0e6 magenta ff00ff maroon 800000
  mediumaquamarine 66cdaa mediumblue 0000cd mediumorchid ba55d3 mediumpurple 9370db mediumseagreen 3cb371
  mediumslateblue 7b68ee mediumspringgreen 00fa9a mediumturquoise 48d1cc mediumvioletred c71585
  midnightblue 191970 mintcream f5fffa mistyrose ffe4e1 moccasin ffe4b5 navajowhite ffdead navy 000080
  oldlace fdf5e6 olive 808000 olivedrab 6b8e23 orange ffa500 orangered ff4500 orchid da70d6 palegoldenrod eee8aa
  palegreen 98fb98 paleturquoise afeeee palevioletred db7093 papayawhip ffefd5 peachpuff ffdab9 peru cd853f
  pink ffc0cb plum dda0dd powderblue b0e0e6 purple 800080 rebeccapurple 663399 red ff0000 rosybrown bc8f8f
  royalblue 4169e1 saddlebrown 8b4513 salmon fa8072 sandybrown f4a460 seagreen 2e8b57 seashell fff5ee
  sienna a0522d silver c0c0c0 skyblue 87ceeb slateblue 6a5acd slategray 708090 slategrey 708090 snow fffafa
  springgreen 00ff7f steelblue 4682b4 tan d2b48c teal 008080 thistle d8bfd8 tomato ff6347 transparent 00000000
  turquoise 40e0d0 violet ee82ee wheat f5deb3 white ffffff whitesmoke f5f5f5 yellow ffff00 yellowgreen 9acd32`
    .trim()
    .split(/\s+/)
    .flatMap((token, i, tokens) => (i % 2 ? [] : [[token, `#${tokens[i + 1]}`] as const])),
);

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
 * comma and the space-separated (`rgb(0 0 0 / 50%)`) syntax, `oklch()` (space-separated only, as in CSS) and the
 * CSS named colors. Returns `null` for input that is not a color.
 */
export function parseColor(value: string | null | undefined): ZardHsva | null {
  const input = value?.trim().toLowerCase();
  if (!input) {
    return null;
  }

  return parseHex(NAMED_COLORS.get(input) ?? input) ?? parseFunction(input);
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
