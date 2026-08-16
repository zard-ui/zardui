import { assertSupportedSchema, SUPPORTED_SCHEMA_VERSION } from '@cli/utils/schema-version.js';

describe('assertSupportedSchema', () => {
  it('accepts the version this CLI was built for', () => {
    expect(() => assertSupportedSchema(SUPPORTED_SCHEMA_VERSION, 'registry.json')).not.toThrow();
  });

  /**
   * Um registry publicado antes do campo existir é, por definição, a v1 — e
   * recusá-lo quebraria toda CLI nova contra todo registry antigo.
   */
  it('reads a document without the field as v1', () => {
    expect(() => assertSupportedSchema(undefined, 'registry.json')).not.toThrow();
  });

  it('refuses a format newer than it knows, and says what to do', () => {
    expect(() => assertSupportedSchema(SUPPORTED_SCHEMA_VERSION + 1, 'registry.json')).toThrow(
      /registry.json in format v2.*reads up to v1.*zard-cli@latest/s,
    );
  });
});
