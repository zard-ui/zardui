/**
 * O catálogo de presets em uso, buscado no registry.
 *
 * Mesma mecânica de `icon-catalog.ts`, e pelo mesmo motivo: a CLI traz uma cópia
 * embutida, mas quem manda é o registry. É assim que uma cor de destaque nova
 * chega a quem já tem a CLI instalada — deploy do site, e não release do pacote
 * — e é o que permite a um código de preset gerado hoje no `/create` ser lido
 * por uma CLI compilada antes daquela cor existir.
 *
 * A cópia local é o piso: vale offline, em registry antigo que ainda não publica
 * o arquivo, e em qualquer falha de rede.
 */

import { SchemaVersionError } from '@cli/utils/errors.js';
import { fetchJson } from '@cli/utils/http-client.js';
import { logger } from '@cli/utils/logger.js';
import { assertSupportedSchema } from '@cli/utils/schema-version.js';
import { LOCAL_PRESET_CATALOG, parseCatalog, type PresetCatalog } from '@zardui/preset';

let current: PresetCatalog = LOCAL_PRESET_CATALOG;

/** O catálogo carregado, ou a cópia embutida enquanto ninguém o carregou. */
export function presetCatalog(): PresetCatalog {
  return current;
}

/** Volta ao estado inicial. Existe para os testes não vazarem um no outro. */
export function resetPresetCatalog(): void {
  current = LOCAL_PRESET_CATALOG;
}

export async function loadPresetCatalog(registryUrl: string): Promise<PresetCatalog> {
  try {
    const document = await fetchJson<{ schemaVersion?: number }>(`${registryUrl}/presets.json`);
    assertSupportedSchema(document.schemaVersion, 'presets.json');

    current = parseCatalog(document);
    logger.debug(`Preset catalog loaded: ${current.themes.length} themes, ${current.baseColors.length} base colors`);
  } catch (error) {
    // Só a incompatibilidade de formato interrompe. 404, HTML da SPA no lugar do
    // JSON, timeout, JSON quebrado — tudo isso é registry sem o catálogo, que é
    // o estado de todos eles até o primeiro deploy com o arquivo.
    if (error instanceof SchemaVersionError) throw error;
    logger.debug(`Falling back to the bundled preset catalog: ${error instanceof Error ? error.message : error}`);
    current = LOCAL_PRESET_CATALOG;
  }

  return current;
}
