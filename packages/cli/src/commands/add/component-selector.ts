import { getAllComponentNames } from '@cli/commands/add/dependency-resolver.js';

/**
 * Resolve quais componentes o comando deve instalar a partir dos argumentos.
 *
 * Devolve uma lista vazia quando não há nada informado: nesse caso quem escolhe
 * é o wizard (ou, sem terminal interativo, o comando falha pedindo os nomes).
 */
export async function selectComponents(components: string[], allFlag: boolean): Promise<string[]> {
  if (allFlag) return getAllComponentNames();
  return components ?? [];
}
