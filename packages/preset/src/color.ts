/**
 * Conversão de cor e contraste, sem dependência nenhuma.
 *
 * A página `/themes` já converte oklch com o `culori`, mas o preset roda também
 * dentro da CLI, onde uma dependência a mais é peso no pacote publicado — e,
 * mais importante, o cálculo do destaque precisa dar **o mesmo número** nos dois
 * lados. Duas bibliotecas concordando hoje não é garantia de concordarem depois
 * de um bump de versão, e a diferença apareceria como "a cor do preview não é a
 * cor que a CLI gravou".
 *
 * As matrizes são as da especificação do Oklab (Björn Ottosson).
 */

export interface Rgb {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

export interface Oklch {
  readonly l: number;
  readonly c: number;
  readonly h: number;
}

const OKLCH_PATTERN = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*[\d.]+%?\s*)?\)$/i;

/**
 * Lê `oklch(0.205 0 0)`, e `null` para qualquer outra coisa.
 *
 * O alfa é aceito na entrada e descartado: `oklch(1 0 0 / 10%)` aparece nas
 * bordas dos temas escuros, e recusá-lo faria o cálculo de contraste desistir de
 * um token que ele consegue avaliar.
 */
export function parseOklch(value: string): Oklch | null {
  const match = OKLCH_PATTERN.exec(value.trim());
  if (!match) return null;

  return { l: Number(match[1]), c: Number(match[2]), h: Number(match[3]) };
}

/**
 * Formata com três casas decimais, como o resto dos tokens do repositório.
 *
 * O zero de croma sai como `0` inteiro, e não `0.000`, porque é assim que os
 * tons neutros estão escritos hoje — e o CSS gerado é comparado byte a byte.
 */
export function formatOklch({ l, c, h }: Oklch): string {
  const trim = (value: number) => {
    const fixed = value.toFixed(3);
    return fixed.replace(/\.?0+$/, '') || '0';
  };

  return `oklch(${trim(l)} ${trim(c)} ${trim(h)})`;
}

function toLinear(channel: number): number {
  return channel <= 0.0031308 ? channel * 12.92 : 1.055 * Math.pow(channel, 1 / 2.4) - 0.055;
}

/** Oklch → sRGB com os canais em 0..1, **sem** recorte: valores fora da gama saem como estão. */
export function oklchToRgb({ l, c, h }: Oklch): Rgb {
  const radians = (h * Math.PI) / 180;
  const a = c * Math.cos(radians);
  const b = c * Math.sin(radians);

  const lCone = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mCone = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const sCone = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return {
    r: toLinear(4.0767416621 * lCone - 3.3077115913 * mCone + 0.2309699292 * sCone),
    g: toLinear(-1.2684380046 * lCone + 2.6097574011 * mCone - 0.3413193965 * sCone),
    b: toLinear(-0.0041960863 * lCone - 0.7034186147 * mCone + 1.707614701 * sCone),
  };
}

/** `true` quando a cor cabe em sRGB — margem de meio passo de 8 bits para não recusar arredondamento. */
export function isInGamut(color: Oklch): boolean {
  const { r, g, b } = oklchToRgb(color);
  const epsilon = 1 / 512;

  return [r, g, b].every(channel => channel >= -epsilon && channel <= 1 + epsilon);
}

function channelLuminance(channel: number): number {
  const clamped = Math.min(1, Math.max(0, channel));
  return clamped <= 0.04045 ? clamped / 12.92 : ((clamped + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance({ r, g, b }: Rgb): number {
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
}

/** A razão de contraste da WCAG 2.1, de 1 a 21. */
export function contrastRatio(a: Oklch, b: Oklch): number {
  const first = relativeLuminance(oklchToRgb(a));
  const second = relativeLuminance(oklchToRgb(b));
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);

  return (lighter + 0.05) / (darker + 0.05);
}

/** O piso de AA para texto normal. */
export const AA_CONTRAST = 4.5;
