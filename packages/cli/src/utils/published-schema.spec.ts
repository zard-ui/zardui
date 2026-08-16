import { DEFAULT_CONFIG } from '@cli/utils/config.js';
import { existsSync, readFileSync } from 'node:fs';
import * as path from 'node:path';

/**
 * O JSON Schema publicado é o que faz o editor de quem usa completar e validar
 * o `components.json`. Ele é escrito à mão, então nada impede que um campo novo
 * entre no zod e não ali — e um schema incompleto é pior do que nenhum: marca
 * como erro um arquivo correto, porque `additionalProperties` é false.
 *
 * Roda a partir do repositório; no pacote publicado não há o que comparar.
 */
describe('the published components.json schema', () => {
  const SCHEMA = path.resolve(__dirname, '../../../../apps/web/public/schema.json');
  const available = existsSync(SCHEMA);

  (available ? it : it.skip)('describes every field the CLI writes', () => {
    const schema = JSON.parse(readFileSync(SCHEMA, 'utf8')) as {
      properties: Record<string, { properties?: Record<string, unknown> }>;
    };

    // `$schema` e `registryUrl` não estão no default: o primeiro é escrito pelo
    // init, o segundo só existe em quem aponta para outro registry.
    const written = [...Object.keys(DEFAULT_CONFIG), '$schema', 'registryUrl'].sort();

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
