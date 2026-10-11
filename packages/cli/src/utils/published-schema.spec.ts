import { DEFAULT_CONFIG } from '@cli/utils/config.js';
import { existsSync, readFileSync } from 'node:fs';
import * as path from 'node:path';

/**
 * The published JSON Schema is what makes a user's editor complete and validate
 * `components.json`. It is written by hand, so nothing stops a new field from
 * landing in the zod schema and not there — and an incomplete schema is worse
 * than none: it flags a correct file as an error, because `additionalProperties`
 * is false.
 *
 * Runs from the repository; in the published package there is nothing to compare.
 */
describe('the published components.json schema', () => {
  const SCHEMA = path.resolve(__dirname, '../../../../apps/web/public/schema.json');
  const available = existsSync(SCHEMA);

  (available ? it : it.skip)('describes every field the CLI writes', () => {
    const schema = JSON.parse(readFileSync(SCHEMA, 'utf8')) as {
      properties: Record<string, { properties?: Record<string, unknown> }>;
    };

    // Not in the default config: `$schema` is written by init, `registryUrl` only exists for someone
    // pointing at another registry, and the menu settings and `preset` are written only by
    // `init --preset` / `apply`.
    const written = [
      ...Object.keys(DEFAULT_CONFIG),
      '$schema',
      'registryUrl',
      'menuColor',
      'menuAppearance',
      'menuAccent',
      'preset',
    ].sort();

    expect(Object.keys(schema.properties).sort()).toEqual(written);
  });

  (available ? it : it.skip)('describes the nested objects too', () => {
    const schema = JSON.parse(readFileSync(SCHEMA, 'utf8')) as {
      properties: Record<string, { properties?: Record<string, unknown> }>;
    };

    expect(Object.keys(schema.properties['tailwind']?.properties ?? {}).sort()).toEqual(
      Object.keys(DEFAULT_CONFIG.tailwind).sort(),
    );
    expect(Object.keys(schema.properties['aliases']?.properties ?? {}).sort()).toEqual(
      Object.keys(DEFAULT_CONFIG.aliases).sort(),
    );
  });
});
