import { SchemaVersionError } from '@cli/utils/errors.js';

/**
 * The registry FORMAT version this CLI understands.
 *
 * Not to be confused with the package version, which the index also publishes:
 * that one says which release the content came from, this one says what shape it
 * has. Without separating them there was no way for the registry to change shape
 * without silently breaking whoever was already installed — the CLI would read
 * `files` from an item with a different shape and get it wrong without a word.
 *
 * It goes up when the change breaks a reader: a field removed, a meaning
 * altered, an item reorganized. A new optional field raises nothing.
 */
export const SUPPORTED_SCHEMA_VERSION = 1;

/**
 * Rejects a document newer than this CLI knows how to read.
 *
 * A missing field means a registry older than the field itself, which is version
 * 1 by definition.
 */
export function assertSupportedSchema(schemaVersion: number | undefined, source: string): void {
  const version = schemaVersion ?? 1;

  if (version > SUPPORTED_SCHEMA_VERSION) {
    throw new SchemaVersionError(
      `This registry publishes ${source} in format v${version}, and this CLI reads up to v${SUPPORTED_SCHEMA_VERSION}. ` +
        'Update it with `npm i -g zard-cli@latest`, or run it through npx, which always fetches the latest.',
    );
  }
}
