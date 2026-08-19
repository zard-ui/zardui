/**
 * O catálogo embutido — o piso de tudo o que lê presets.
 *
 * Mesma disciplina do catálogo de ícones: a cópia local vale offline, em
 * registry antigo que ainda não publica o arquivo e em qualquer falha de rede;
 * o que vale em execução é `<registry>/presets.json`, para que um destaque novo
 * chegue a quem já tem a CLI instalada sem um release dela.
 */

import type { CatalogEntry, PresetCatalog } from '../types.js';
import { BASE_COLORS } from './base-colors.js';
import { CHARTS } from './charts.js';
import { ICONS } from './icons.js';
import { NAMED_PRESETS } from './presets.js';
import { RADII } from './radii.js';
import { THEMES } from './themes.js';

export { BASE_COLORS } from './base-colors.js';
export { CHARTS } from './charts.js';
export { ICONS } from './icons.js';
export { NAMED_PRESETS } from './presets.js';
export { RADII } from './radii.js';
export { THEMES } from './themes.js';

export const LOCAL_PRESET_CATALOG: PresetCatalog = {
  baseColors: BASE_COLORS,
  themes: THEMES,
  radii: RADII,
  charts: CHARTS,
  icons: ICONS,
  presets: NAMED_PRESETS,
};

/** A entrada com esse id, ou `undefined`. Não cai no default: quem chama decide. */
export function entryById<T extends CatalogEntry>(entries: readonly T[], id: string): T | undefined {
  return entries.find(entry => entry.id === id);
}

/** A entrada com esse `code`, inclusive as aposentadas — um link antigo tem que abrir. */
export function entryByCode<T extends CatalogEntry>(entries: readonly T[], code: number): T | undefined {
  return entries.find(entry => entry.code === code);
}

/** O que uma lista de escolha mostra: tudo menos o que foi aposentado. */
export function selectable<T extends CatalogEntry>(entries: readonly T[]): T[] {
  return entries.filter(entry => !entry.deprecated);
}
