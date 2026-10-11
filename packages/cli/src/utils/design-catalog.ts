/**
 * The design data in use, fetched from the registry.
 *
 * Same arrangement as the icon catalog, and for the same reason: the CLI carries a copy, but the
 * registry's `design.json` is what counts, so a corrected token or a font package reaches someone who
 * already has the CLI installed. The bundled copy is the floor — it applies offline, against an older
 * registry that does not publish the file, and on any network failure.
 */

import { BUNDLED_DESIGN_DATA, type DesignData } from '@cli/core/design/css.js';
import { designDataFrom, type DesignDocument } from '@cli/core/design/document.js';
import { SchemaVersionError } from '@cli/utils/errors.js';
import { fetchJson } from '@cli/utils/http-client.js';
import { logger } from '@cli/utils/logger.js';
import { assertSupportedSchema } from '@cli/utils/schema-version.js';

let current: DesignData = BUNDLED_DESIGN_DATA;

/** The loaded data, or the bundled copy while nobody has loaded any. */
export function designData(): DesignData {
  return current;
}

/** Returns to the initial state. Exists so tests do not leak into one another. */
export function resetDesignData(): void {
  current = BUNDLED_DESIGN_DATA;
}

export async function loadDesignData(registryUrl: string): Promise<DesignData> {
  try {
    const document = await fetchJson<DesignDocument>(`${registryUrl}/design.json`);
    assertSupportedSchema(document.schemaVersion, 'design.json');

    current = designDataFrom(document);
    logger.debug(
      `Design data loaded: ${Object.keys(current.baseColors).length} base colors, ${current.fonts.length} fonts`,
    );
  } catch (error) {
    // Only a format incompatibility stops us; a registry without the file (404, the SPA's HTML, a
    // timeout) is the normal state of every registry until its first deploy with it.
    if (error instanceof SchemaVersionError) throw error;
    logger.debug(`Falling back to the bundled design data: ${error instanceof Error ? error.message : error}`);
    current = BUNDLED_DESIGN_DATA;
  }

  return current;
}
