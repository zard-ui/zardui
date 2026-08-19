/**
 * Os presets que a página `/themes` oferece, montados a partir de `@zardui/preset`.
 *
 * Eram 800 linhas de tokens escritos à mão — uma segunda descrição dos mesmos
 * temas que a CLI grava, sem nada garantindo que as duas concordassem. E não
 * concordavam: as cores de gráfico e as bordas do modo escuro tinham divergido
 * em algum momento, então o que esta página mostrava não era o que o comando
 * escrevia. Agora os dois leem do mesmo lugar.
 *
 * A lista continua a mesma para quem usa: os cinco tons neutros, seguidos de
 * combinações com destaque. O que mudou é de onde os valores vêm.
 */

import { entryById, LOCAL_PRESET_CATALOG, resolvePreset, type Preset } from '@zardui/preset';

import type { ThemeColors, ThemeDefinition, ThemePreset } from '../models/theme.model';

const catalog = LOCAL_PRESET_CATALOG;

interface PresetRecipe {
  readonly name: string;
  readonly baseColor: string;
  readonly theme?: string;
  readonly chart?: string;
}

/**
 * A lista oferecida, na ordem em que aparece.
 *
 * Os cinco primeiros são os tons neutros que o `init` escreve — é deles que a
 * maioria dos projetos parte. Os demais mostram o que uma cor de destaque faz
 * sobre cada um deles, que é a pergunta que a página existe para responder.
 */
const RECIPES: readonly PresetRecipe[] = [
  { name: 'Neutral', baseColor: 'neutral' },
  { name: 'Slate', baseColor: 'slate' },
  { name: 'Zinc', baseColor: 'zinc' },
  { name: 'Stone', baseColor: 'stone' },
  { name: 'Gray', baseColor: 'gray' },
  { name: 'Rose', baseColor: 'neutral', theme: 'rose' },
  { name: 'Blue', baseColor: 'slate', theme: 'blue' },
  { name: 'Green', baseColor: 'stone', theme: 'green' },
  { name: 'Orange', baseColor: 'zinc', theme: 'orange' },
  { name: 'Violet', baseColor: 'zinc', theme: 'violet' },
  { name: 'Emerald', baseColor: 'gray', theme: 'emerald', chart: 'vivid' },
];

function presetFor(recipe: PresetRecipe): Preset {
  return {
    version: 1,
    baseColor: recipe.baseColor,
    theme: recipe.theme ?? 'neutral',
    chart: recipe.chart ?? 'default',
    radius: 'default',
    icons: 'lucide',
    darkMode: 'class',
    rtl: false,
  };
}

function definitionFor(recipe: PresetRecipe): ThemeDefinition {
  const resolved = resolvePreset(presetFor(recipe), catalog);

  return {
    name: recipe.name,
    radius: resolved.radius,
    light: resolved.light as ThemeColors,
    dark: resolved.dark as ThemeColors,
  };
}

export const THEME_PRESETS: ThemePreset[] = RECIPES.map(recipe => {
  const theme = definitionFor(recipe);

  return {
    name: recipe.name,
    theme,
    // O card de preset mostra dois tons; a primária e o fundo secundário do modo
    // claro são os que dizem mais sobre o tema com menos espaço.
    previewColors: {
      primary: theme.light.primary,
      secondary: theme.light.secondary,
    },
  };
});

/** Os ids do catálogo por trás de cada preset, para quem precisar do código curto. */
export const THEME_PRESET_RECIPES = RECIPES;

/** O rótulo do tom neutro de um preset, como o catálogo o nomeia. */
export function baseColorLabelOf(name: string): string {
  const recipe = RECIPES.find(item => item.name === name);

  return recipe ? (entryById(catalog.baseColors, recipe.baseColor)?.label ?? recipe.baseColor) : name;
}
