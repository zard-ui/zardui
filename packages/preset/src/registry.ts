/**
 * O catálogo indo e voltando do registry.
 *
 * Publicar o catálogo é o que faz um destaque novo valer para quem já tem a CLI
 * instalada: ela lê de `<registry>/presets.json` em vez da cópia embutida, então
 * acrescentar uma cor é um deploy do site, e não um release do pacote — a mesma
 * mecânica que `icons.json` já usa.
 *
 * `parseCatalog` é tolerante por dentro e rígido só onde precisa: seção ausente
 * cai na cópia local, porque um registry publicado antes desta feature não tem
 * nenhuma delas e ainda assim precisa servir todos os comandos.
 */

import { LOCAL_PRESET_CATALOG } from './catalog/index.js';
import type { PresetCatalog } from './types.js';

export const PRESET_CATALOG_SCHEMA_URL = 'https://zardui.com/schema/presets.json';

export interface PresetCatalogDocument extends PresetCatalog {
  $schema: string;
  schemaVersion: number;
}

export function serializeCatalog(catalog: PresetCatalog, schemaVersion: number): PresetCatalogDocument {
  return {
    $schema: PRESET_CATALOG_SCHEMA_URL,
    schemaVersion,
    baseColors: catalog.baseColors,
    themes: catalog.themes,
    radii: catalog.radii,
    charts: catalog.charts,
    icons: catalog.icons,
    presets: catalog.presets,
  };
}

function section<T>(value: unknown, fallback: readonly T[]): readonly T[] {
  return Array.isArray(value) && value.length > 0 ? (value as T[]) : fallback;
}

export function parseCatalog(document: unknown, fallback: PresetCatalog = LOCAL_PRESET_CATALOG): PresetCatalog {
  const raw = (typeof document === 'object' && document !== null ? document : {}) as Record<string, unknown>;

  return {
    baseColors: section(raw['baseColors'], fallback.baseColors),
    themes: section(raw['themes'], fallback.themes),
    radii: section(raw['radii'], fallback.radii),
    charts: section(raw['charts'], fallback.charts),
    icons: section(raw['icons'], fallback.icons),
    presets: section(raw['presets'], fallback.presets),
  };
}

/**
 * Os `code` repetidos dentro de cada seção.
 *
 * Duas entradas com o mesmo `code` fazem um código curto significar duas coisas,
 * e a que vence é a que estiver primeiro no array — ou seja, muda com a ordem do
 * arquivo. O build do registry chama isto e falha; é barato demais para ficar
 * dependendo de alguém reparar.
 */
export function duplicateCodes(catalog: PresetCatalog): string[] {
  const sections: Array<[string, readonly { id: string; code: number }[]]> = [
    ['baseColors', catalog.baseColors],
    ['themes', catalog.themes],
    ['radii', catalog.radii],
    ['charts', catalog.charts],
    ['icons', catalog.icons],
  ];

  const problems: string[] = [];

  for (const [name, entries] of sections) {
    const seen = new Map<number, string>();

    for (const entry of entries) {
      const previous = seen.get(entry.code);
      if (previous) problems.push(`${name}: "${previous}" and "${entry.id}" share code ${entry.code}`);
      else seen.set(entry.code, entry.id);
    }
  }

  return problems;
}
