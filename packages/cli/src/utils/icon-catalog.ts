/**
 * The icon catalog in use, fetched from the registry.
 *
 * The CLI carries a copy of the table, but the registry is what counts: that is
 * how a new family reaches someone who already has the CLI installed, without
 * waiting for a release of it. The local copy is the floor — it applies offline,
 * against an old registry that does not publish the file, and on any network
 * failure.
 *
 * It is loaded once per command and read synchronously after that. The
 * alternative would be threading the catalog through the action's parameters
 * down to the file installer, four layers below, with none of them having
 * anything to decide about it.
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

/** The loaded catalog, or the local copy while nobody has loaded one. */
export function iconCatalog(): IconCatalog {
  return current;
}

/** Returns to the initial state. Exists so tests do not leak into one another. */
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
    // Only a format incompatibility stops us. Everything else — a 404, the SPA's
    // HTML instead of JSON, a timeout, broken JSON — is a registry without the
    // catalog, which is the state of all of them until the first deploy with the
    // file. Treating that as a failure would take `add` down worldwide over a
    // file that only matters to someone who switched family.
    if (error instanceof SchemaVersionError) throw error;
    logger.debug(`Falling back to the bundled icon catalog: ${error instanceof Error ? error.message : error}`);
    current = LOCAL_ICON_CATALOG;
  }

  return current;
}

/**
 * Rejects a family the catalog does not know, naming the ones that exist.
 *
 * "Invalid configuration file: components.json" was all an `"icons": "materia"`
 * produced — no field named, no accepted values, and the whole file under
 * suspicion.
 */
export function assertIconFamily(family: IconFamily, catalog: IconCatalog = iconCatalog()): void {
  if (Object.prototype.hasOwnProperty.call(catalog.families, family)) return;

  throw new CliError(
    `Unknown icon set "${family}" in components.json. Available: ${Object.keys(catalog.families).sort().join(', ')}.`,
    'UNKNOWN_ICON_FAMILY',
  );
}
