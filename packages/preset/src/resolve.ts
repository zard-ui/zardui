/**
 * Do preset aos tokens: a função que CLI e site chamam para saber "que cores são essas".
 *
 * É o único caminho. O preview de `/create` e o CSS que o `init` grava passam
 * pelos mesmos vinte e poucos passos daqui, então a pergunta "por que a cor que
 * eu vi não é a que veio" deixa de existir — não há dois lugares onde ela possa
 * ser respondida de formas diferentes.
 */

import { entryById, LOCAL_PRESET_CATALOG } from './catalog/index.js';
import { deriveAccent } from './derive.js';
import type { Preset } from './preset.js';
import {
  CHART_COLOR_KEYS,
  THEME_COLOR_KEYS,
  type CatalogEntry,
  type ColorScheme,
  type PresetCatalog,
  type ThemeColors,
} from './types.js';

export class PresetResolveError extends Error {
  constructor(
    readonly field: string,
    message: string,
  ) {
    super(message);
    this.name = 'PresetResolveError';
  }
}

function required<T extends CatalogEntry>(entries: readonly T[], id: string, field: string): T {
  const entry = entryById(entries, id);
  if (entry) return entry;

  const available = entries
    .filter(item => !item.deprecated)
    .map(item => item.id)
    .sort()
    .join(', ');

  throw new PresetResolveError(field, `Unknown ${field} "${id}". Available: ${available}.`);
}

export interface ResolvedPreset {
  readonly preset: Preset;
  /** O valor literal de `--radius`. */
  readonly radius: string;
  readonly light: ThemeColors;
  readonly dark: ThemeColors;
}

function buildScheme(preset: Preset, catalog: PresetCatalog, scheme: ColorScheme): ThemeColors {
  const baseColor = required(catalog.baseColors, preset.baseColor, 'base color');
  const chart = required(catalog.charts, preset.chart, 'chart palette');
  const theme = required(catalog.themes, preset.theme, 'theme');

  const neutral = baseColor[scheme];
  const accent = deriveAccent(theme, neutral, scheme);
  const chartColors = chart[scheme];

  const colors = {} as Record<string, string>;

  // A ordem é a de `THEME_COLOR_KEYS`, e não a de inserção de cada fonte: o CSS
  // gerado é comparado byte a byte com o que a CLI grava hoje, e a ordem das
  // declarações faz parte dessa comparação.
  for (const key of THEME_COLOR_KEYS) {
    const chartIndex = CHART_COLOR_KEYS.indexOf(key as (typeof CHART_COLOR_KEYS)[number]);

    if (chartIndex !== -1) {
      colors[key] = chartColors[chartIndex] as string;
      continue;
    }

    colors[key] = accent[key as keyof typeof accent] ?? (neutral as Record<string, string>)[key] ?? '';
  }

  // Overrides são a última palavra: quem editou a cor à mão quer exatamente ela.
  for (const [key, value] of Object.entries(preset.colors?.[scheme] ?? {})) {
    if (typeof value === 'string' && value) colors[key] = value;
  }

  return colors as ThemeColors;
}

export function resolvePreset(preset: Preset, catalog: PresetCatalog = LOCAL_PRESET_CATALOG): ResolvedPreset {
  const radius = required(catalog.radii, preset.radius, 'radius');

  return {
    preset,
    radius: radius.value,
    light: buildScheme(preset, catalog, 'light'),
    dark: buildScheme(preset, catalog, 'dark'),
  };
}
