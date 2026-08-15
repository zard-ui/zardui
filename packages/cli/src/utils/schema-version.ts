import { SchemaVersionError } from '@cli/utils/errors.js';

/**
 * A versão do FORMATO do registry que esta CLI entende.
 *
 * Não confundir com a versão do pacote, que o índice também publica: aquela diz
 * de que release o conteúdo saiu, esta diz que forma ele tem. Sem separá-las não
 * havia como o registry mudar de forma sem quebrar em silêncio quem já estava
 * instalado — a CLI leria `files` de um item com outro shape e erraria calada.
 *
 * Sobe quando a mudança quebra quem lê: campo removido, significado alterado,
 * item reorganizado. Campo novo e opcional não sobe nada.
 */
export const SUPPORTED_SCHEMA_VERSION = 1;

/**
 * Recusa um documento mais novo do que esta CLI sabe ler.
 *
 * A ausência do campo é um registry anterior à existência dele, que por
 * definição é a versão 1.
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
