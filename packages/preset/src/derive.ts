/**
 * A cor de destaque virando tokens, sobre o tom neutro escolhido.
 *
 * O catálogo guarda só a coordenada (matiz e croma). Os tokens saem daqui, e
 * saem calculados — não escolhidos de uma tabela — por dois motivos:
 *
 *   1. 5 tons × 18 destaques são 90 combinações. Escritas à mão, 90 chances de
 *      um par ficar ilegível sem ninguém notar.
 *   2. O par (fundo, texto por cima) precisa fechar AA em qualquer combinação, e
 *      isso é uma conta — não um julgamento visual feito uma vez e congelado.
 *
 * A busca é sobre a luminosidade: matiz e croma vêm do catálogo e ficam onde
 * estão (é o que faz "Indigo" continuar indigo em cima de qualquer base), e a
 * luminosidade desce no claro e sobe no escuro até o contraste passar de 4.5:1.
 */

import { AA_CONTRAST, contrastRatio, formatOklch, isInGamut, parseOklch, type Oklch } from './color.js';
import type { ColorScheme, NeutralColors, ThemeEntry } from './types.js';

/** Os tokens que a cor de destaque assume. O resto do tom neutro fica intacto. */
export const ACCENT_TOKENS = [
  'primary',
  'primary-foreground',
  'ring',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-ring',
] as const;

export type AccentToken = (typeof ACCENT_TOKENS)[number];

/** Ponto de partida da busca — perto de onde o passo 600/400 do Tailwind cai. */
const START_LIGHTNESS: Record<ColorScheme, number> = { light: 0.55, dark: 0.7 };
const STEP = 0.005;
const LIGHTNESS_BOUNDS = { min: 0.2, max: 0.95 };

/**
 * O croma que cabe em sRGB nessa matiz e nessa luminosidade.
 *
 * Não é detalhe: laranja e amarelo saturados só existem em sRGB perto do meio da
 * escala, então escurecer um destaque mantendo o croma do catálogo produz uma
 * coordenada que nenhuma tela mostra — e o navegador a recorta por conta
 * própria, canal a canal, o que desloca a matiz. Cortar o croma aqui, com a
 * luminosidade e a matiz intactas, é a mesma escolha que a CSS Color 4 faz.
 *
 * O piso de três casas é o mesmo com que a cor é escrita: arredondar para cima
 * depois de encontrar o limite devolveria a cor para fora da gama.
 */
function clampChroma(color: Oklch): Oklch {
  if (isInGamut(color)) return color;

  let inside = 0;
  let outside = color.c;

  for (let step = 0; step < 24; step++) {
    const middle = (inside + outside) / 2;
    if (isInGamut({ ...color, c: middle })) inside = middle;
    else outside = middle;
  }

  return { ...color, c: Math.floor(inside * 1000) / 1000 };
}

/**
 * A luminosidade mais próxima do ponto de partida que fecha AA com o texto por cima.
 *
 * Anda para o lado que escurece o destaque no claro e o clareia no escuro, meio
 * ponto percentual por vez, e para na primeira que passa. Andar em passos em vez
 * de resolver a equação é proposital: o croma cabível muda a cada passo, então o
 * contraste não é uma função fechada de L — e o passo pequeno mantém o resultado
 * tão perto do tom catalogado quanto der.
 *
 * Se nenhuma luminosidade fechar AA (uma base de contraste impossível), fica a
 * de maior contraste: um destaque um pouco fraco é melhor do que um destaque
 * fora da gama, e o teste de contraste cobre o catálogo real.
 */
function fitLightness(base: Oklch, foreground: Oklch, scheme: ColorScheme): Oklch {
  const direction = scheme === 'light' ? -1 : 1;

  let best = clampChroma(base);
  let bestRatio = contrastRatio(best, foreground);

  for (let step = 0; step <= (LIGHTNESS_BOUNDS.max - LIGHTNESS_BOUNDS.min) / STEP; step++) {
    const lightness = base.l + direction * step * STEP;
    if (lightness < LIGHTNESS_BOUNDS.min || lightness > LIGHTNESS_BOUNDS.max) break;

    const candidate = clampChroma({ ...base, l: lightness });
    const ratio = contrastRatio(candidate, foreground);

    if (ratio >= AA_CONTRAST) return candidate;
    if (ratio > bestRatio) {
      best = candidate;
      bestRatio = ratio;
    }
  }

  return best;
}

/**
 * O texto que vai por cima do destaque: o tom mais claro ou o mais escuro da base.
 *
 * Reusar um tom que a base já declara — e não um branco e um preto inventados —
 * é o que mantém o destaque parecendo parte do mesmo sistema, e não uma cor
 * colada por cima.
 */
function foregroundCandidates(neutral: NeutralColors): Oklch[] {
  return [neutral['background'], neutral['foreground']]
    .map(parseOklch)
    .filter((color): color is Oklch => color !== null);
}

function bestForeground(accent: Oklch, candidates: readonly Oklch[]): Oklch | null {
  let best: Oklch | null = null;
  let bestRatio = 0;

  for (const candidate of candidates) {
    const ratio = contrastRatio(accent, candidate);
    if (ratio > bestRatio) {
      bestRatio = ratio;
      best = candidate;
    }
  }

  return best;
}

export type AccentOverrides = Partial<Record<AccentToken, string>>;

/**
 * Os tokens que este destaque impõe sobre um tom neutro, num dos dois modos.
 *
 * Devolve vazio para o destaque `neutral`: ausência de destaque é a primária
 * continuar sendo o tom da base, e não uma cor cinza calculada por cima dela.
 */
export function deriveAccent(theme: ThemeEntry, neutral: NeutralColors, scheme: ColorScheme): AccentOverrides {
  if (theme.hue === undefined || theme.chroma === undefined) return {};

  const candidates = foregroundCandidates(neutral);
  const start: Oklch = { l: START_LIGHTNESS[scheme], c: theme.chroma, h: theme.hue };

  const foreground = bestForeground(start, candidates);
  if (!foreground) return {};

  const primary = fitLightness(start, foreground, scheme);
  const settled = bestForeground(primary, candidates) ?? foreground;

  const primaryCss = formatOklch(primary);
  const foregroundCss = formatOklch(settled);

  // `ring` é o mesmo tom do destaque: o anel de foco marca o elemento ativo, e
  // ele só é reconhecível como "a cor da ação" se for de fato a mesma cor.
  return {
    primary: primaryCss,
    'primary-foreground': foregroundCss,
    ring: primaryCss,
    'sidebar-primary': primaryCss,
    'sidebar-primary-foreground': foregroundCss,
    'sidebar-ring': primaryCss,
  };
}
