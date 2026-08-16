/**
 * O catálogo de ícones em uso, buscado no registry.
 *
 * A CLI carrega uma cópia da tabela, mas quem manda é o registry: é assim que
 * uma família nova chega a quem já tem a CLI instalada, sem esperar um release
 * dela. A cópia local é o piso — vale offline, em registry antigo que não
 * publica o arquivo, e em qualquer falha de rede.
 *
 * É carregado uma vez por comando e lido de forma síncrona depois disso. A
 * alternativa seria passar o catálogo por parâmetro da ação até o instalador de
 * arquivos, quatro camadas abaixo, sem que nenhuma delas tivesse o que decidir
 * sobre ele.
 */

import { LOCAL_ICON_CATALOG, type IconCatalog, type IconFamily } from '@cli/core/icons/index.js';
import { CliError, SchemaVersionError } from '@cli/utils/errors.js';
import { fetchJson } from '@cli/utils/http-client.js';
import { logger } from '@cli/utils/logger.js';
import { assertSupportedSchema } from '@cli/utils/schema-version.js';

/** O que `<registry>/icons.json` publica. */
export interface IconCatalogDocument extends IconCatalog {
  $schema?: string;
  schemaVersion?: number;
}

let current: IconCatalog = LOCAL_ICON_CATALOG;

/** O catálogo carregado, ou a cópia local enquanto ninguém o carregou. */
export function iconCatalog(): IconCatalog {
  return current;
}

/** Volta ao estado inicial. Existe para os testes não vazarem um no outro. */
export function resetIconCatalog(): void {
  current = LOCAL_ICON_CATALOG;
}

export async function loadIconCatalog(registryUrl: string): Promise<IconCatalog> {
  try {
    const document = await fetchJson<IconCatalogDocument>(`${registryUrl}/icons.json`);
    assertSupportedSchema(document.schemaVersion, 'icons.json');

    if (!document.families || !document.icons) throw new Error('missing families or icons');

    current = { families: document.families, icons: document.icons };
    logger.debug(`Icon catalog loaded: ${Object.keys(current.families).join(', ')}`);
  } catch (error) {
    // Só a incompatibilidade de formato interrompe. Todo o resto — 404, HTML da
    // SPA no lugar do JSON, timeout, JSON quebrado — é registry sem o catálogo,
    // que é o estado de todos eles até o primeiro deploy com o arquivo. Tratar
    // isso como falha derrubaria o `add` no mundo inteiro por causa de um
    // arquivo que só importa para quem trocou de família.
    if (error instanceof SchemaVersionError) throw error;
    logger.debug(`Falling back to the bundled icon catalog: ${error instanceof Error ? error.message : error}`);
    current = LOCAL_ICON_CATALOG;
  }

  return current;
}

/**
 * Recusa uma família que o catálogo não conhece, dizendo quais existem.
 *
 * "Invalid configuration file: components.json" era tudo o que um `"icons":
 * "materia"` produzia — sem o campo, sem os valores aceitos, e com o arquivo
 * inteiro sob suspeita.
 */
export function assertIconFamily(family: IconFamily, catalog: IconCatalog = iconCatalog()): void {
  if (Object.prototype.hasOwnProperty.call(catalog.families, family)) return;

  throw new CliError(
    `Unknown icon set "${family}" in components.json. Available: ${Object.keys(catalog.families).sort().join(', ')}.`,
    'UNKNOWN_ICON_FAMILY',
  );
}
