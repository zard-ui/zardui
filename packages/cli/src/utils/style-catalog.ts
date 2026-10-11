/**
 * The style tables in use, fetched from the registry.
 *
 * Same arrangement as the icon catalog: the CLI carries a copy of the tables, but
 * the registry is what counts, so a change to a style reaches someone who already
 * has the CLI installed without waiting for a release. The bundled copy is the
 * floor — it applies offline, against a registry that predates styles, and on any
 * network failure.
 *
 * Only the style the project uses is downloaded: a style is ~100 KB of classes and
 * `add` needs one of eight. It is merged over the bundled tables, which is what
 * tells the transform which markers exist at all.
 *
 * Loaded once per command and read synchronously after that, for the same reason
 * as the icon catalog: threading it through the installer's parameters would touch
 * four layers that have nothing to decide about it.
 */

import {
  LOCAL_STYLE_CATALOG,
  resolveStyle,
  type StyleCatalog,
  type StyleMarkers,
  type StyleSelection,
} from '@cli/core/styles/index.js';
import { SchemaVersionError } from '@cli/utils/errors.js';
import { fetchJson } from '@cli/utils/http-client.js';
import { logger } from '@cli/utils/logger.js';
import { assertSupportedSchema } from '@cli/utils/schema-version.js';

/** What `<registry>/styles/<id>.json` publishes. */
export interface StyleDocument {
  $schema?: string;
  schemaVersion?: number;
  id?: string;
  markers?: StyleMarkers;
}

let current: StyleCatalog = LOCAL_STYLE_CATALOG;

/** The loaded tables, or the bundled copy while nobody has loaded any. */
export function styleCatalog(): StyleCatalog {
  return current;
}

/** Returns to the initial state. Exists so tests do not leak into one another. */
export function resetStyleCatalog(): void {
  current = LOCAL_STYLE_CATALOG;
}

export async function loadStyleCatalog(registryUrl: string, style: StyleSelection): Promise<StyleCatalog> {
  const id = resolveStyle(style);

  try {
    const document = await fetchJson<StyleDocument>(`${registryUrl}/styles/${id}.json`);
    assertSupportedSchema(document.schemaVersion, `styles/${id}.json`);

    if (!document.markers || typeof document.markers !== 'object') throw new Error('missing markers');

    current = { ...LOCAL_STYLE_CATALOG, [id]: document.markers };
    logger.debug(`Style "${id}" loaded: ${Object.keys(document.markers).length} markers`);
  } catch (error) {
    // Only a format incompatibility stops us. A 404 (a registry that predates
    // styles), the SPA's HTML instead of JSON, a timeout: the bundled table is
    // right for every one of them.
    if (error instanceof SchemaVersionError) throw error;
    logger.debug(`Falling back to the bundled "${id}" style: ${error instanceof Error ? error.message : error}`);
    current = LOCAL_STYLE_CATALOG;
  }

  return current;
}
