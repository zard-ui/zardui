/**
 * Nomes de componente e de bloco vindos de quem chama as tools.
 *
 * Eles são interpolados em URLs e passados a um processo, então a validação
 * mora aqui, junto de quem monta a URL, e não em cada tool: uma tool nova
 * esquece de validar, um serviço não.
 *
 * Sem isto, `../../admin/secret` como nome de componente sai do diretório do
 * registry — `https://zardui.com/r/button.json` vira
 * `https://zardui.com/admin/secret.json`, e o conteúdo volta para o modelo que
 * pediu. Contra o registry público isso é pouco; contra um `registryUrl`
 * interno, é o servidor MCP buscando endereços da rede da empresa a pedido de
 * quem escreveu o prompt.
 *
 * O identificador também não pode carregar `?` ou `#`, que mudariam a query da
 * requisição, nem os separadores que dariam sentido de caminho ao nome.
 */

/** O mesmo formato que o registry usa: letra ou dígito, depois letras, dígitos e hifens. */
const REGISTRY_ID = /^[a-z0-9][a-z0-9-]*$/i;

const MAX_LENGTH = 64;

export type IdentifierKind = 'component' | 'block';

export class InvalidIdentifierError extends Error {
  constructor(kind: IdentifierKind, value: string) {
    super(
      `Invalid ${kind} name "${value}". Names may only contain letters, digits and dashes, ` +
        `and must start with a letter or digit.`,
    );
    this.name = 'InvalidIdentifierError';
  }
}

/** Devolve o identificador quando ele é aceitável; lança quando não é. */
export function assertRegistryId(value: string, kind: IdentifierKind): string {
  if (typeof value !== 'string' || value.length === 0 || value.length > MAX_LENGTH || !REGISTRY_ID.test(value)) {
    throw new InvalidIdentifierError(kind, value);
  }

  return value;
}
