/**
 * As paletas de `--chart-1..5`.
 *
 * `default` é exatamente o que os cinco tons neutros já gravavam — a mesma
 * sequência em claro e escuro, uma rampa de azuis. Sair dela é opt-in: `vivid`
 * separa as séries por matiz, para gráficos com categorias que não têm ordem
 * entre si, e `mono` deriva tudo de uma matiz só, para quando a distinção que
 * importa é de grandeza.
 */

import type { ChartEntry } from '../types.js';

export const CHARTS: readonly ChartEntry[] = [
  {
    id: 'default',
    code: 0,
    label: 'Default',
    light: [
      'oklch(0.809 0.105 251.813)',
      'oklch(0.623 0.214 259.815)',
      'oklch(0.546 0.245 262.881)',
      'oklch(0.488 0.243 264.376)',
      'oklch(0.424 0.199 265.638)',
    ],
    dark: [
      'oklch(0.809 0.105 251.813)',
      'oklch(0.623 0.214 259.815)',
      'oklch(0.546 0.245 262.881)',
      'oklch(0.488 0.243 264.376)',
      'oklch(0.424 0.199 265.638)',
    ],
  },
  {
    id: 'vivid',
    code: 1,
    label: 'Vivid',
    light: [
      'oklch(0.646 0.222 41.116)',
      'oklch(0.6 0.118 184.704)',
      'oklch(0.398 0.07 227.392)',
      'oklch(0.828 0.189 84.429)',
      'oklch(0.769 0.188 70.08)',
    ],
    dark: [
      'oklch(0.488 0.243 264.376)',
      'oklch(0.696 0.17 162.48)',
      'oklch(0.769 0.188 70.08)',
      'oklch(0.627 0.265 303.9)',
      'oklch(0.645 0.246 16.439)',
    ],
  },
  {
    id: 'mono',
    code: 2,
    label: 'Mono',
    light: ['oklch(0.37 0 0)', 'oklch(0.48 0 0)', 'oklch(0.58 0 0)', 'oklch(0.68 0 0)', 'oklch(0.78 0 0)'],
    dark: ['oklch(0.85 0 0)', 'oklch(0.75 0 0)', 'oklch(0.65 0 0)', 'oklch(0.55 0 0)', 'oklch(0.45 0 0)'],
  },
];
