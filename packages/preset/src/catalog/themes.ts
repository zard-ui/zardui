/**
 * As cores de destaque, como coordenada em oklch.
 *
 * O campo do preset se chama `theme` — é o nome que o `/create` e o
 * `components.json` expõem —, e o que ele nomeia é a cor de destaque (accent)
 * aplicada sobre o tom neutro. Os dois termos aparecem de propósito: `theme` no
 * contrato público, "destaque" na prosa, porque é disso que se trata.
 *
 * Cada entrada é um par (matiz, croma) — não uma tabela de tokens. Os tokens
 * saem de `derive.ts`, que os calcula sobre o tom neutro escolhido e ajusta a
 * luminosidade até o contraste com o texto por cima fechar em AA. Guardar a
 * coordenada em vez do resultado é o que faz 5 tons × 18 destaques valerem
 * 5 + 18 linhas de catálogo em vez de 90 blocos escritos à mão — e é o que
 * garante que trocar de tom neutro não deixe um destaque ilegível para trás.
 *
 * As matizes seguem a família de cores do Tailwind: quem já conhece "indigo" ou
 * "emerald" reconhece o resultado. O croma é o do passo 500/600 da paleta, que
 * é onde essas cores são usadas como ação primária.
 */

import type { ThemeEntry } from '../types.js';

export const THEMES: readonly ThemeEntry[] = [
  // Sem destaque: a primária continua sendo o tom neutro da base, que é como o
  // zard sempre se apresentou. Precisa existir no catálogo — e com o code 0 —
  // para ser o default de todo preset que não escolheu nada.
  { id: 'neutral', code: 0, label: 'Neutral' },
  { id: 'red', code: 1, label: 'Red', hue: 25.331, chroma: 0.213 },
  { id: 'orange', code: 2, label: 'Orange', hue: 46.603, chroma: 0.191 },
  { id: 'amber', code: 3, label: 'Amber', hue: 70.08, chroma: 0.188 },
  { id: 'yellow', code: 4, label: 'Yellow', hue: 84.429, chroma: 0.189 },
  { id: 'lime', code: 5, label: 'Lime', hue: 130.85, chroma: 0.222 },
  { id: 'green', code: 6, label: 'Green', hue: 145.87, chroma: 0.194 },
  { id: 'emerald', code: 7, label: 'Emerald', hue: 162.48, chroma: 0.17 },
  { id: 'teal', code: 8, label: 'Teal', hue: 182.503, chroma: 0.147 },
  { id: 'cyan', code: 9, label: 'Cyan', hue: 221.723, chroma: 0.147 },
  { id: 'sky', code: 10, label: 'Sky', hue: 233.339, chroma: 0.163 },
  { id: 'blue', code: 11, label: 'Blue', hue: 259.815, chroma: 0.214 },
  { id: 'indigo', code: 12, label: 'Indigo', hue: 269.938, chroma: 0.221 },
  { id: 'violet', code: 13, label: 'Violet', hue: 293.756, chroma: 0.245 },
  { id: 'purple', code: 14, label: 'Purple', hue: 303.9, chroma: 0.265 },
  { id: 'fuchsia', code: 15, label: 'Fuchsia', hue: 322.16, chroma: 0.266 },
  { id: 'pink', code: 16, label: 'Pink', hue: 354.308, chroma: 0.233 },
  { id: 'rose', code: 17, label: 'Rose', hue: 16.439, chroma: 0.246 },
];
