/**
 * O nome do projeto — que é, ao mesmo tempo, o nome do diretório e o do pacote.
 *
 * Validar aqui e não deixar para o gerador é o que separa "esse nome não serve,
 * escolha outro" de um diretório meio criado com um erro de schematic dentro.
 * As regras são as do npm, que é o denominador comum dos três geradores.
 */

import { CliError } from '@cli/utils/errors.js';
import { existsSync, readdirSync } from 'node:fs';
import * as path from 'node:path';

/** Nome de pacote npm sem escopo: minúsculas, dígitos, hífen, ponto e sublinhado. */
const PACKAGE_NAME = /^[a-z0-9][a-z0-9._-]*$/;

const MAX_LENGTH = 214;

/** A mensagem do problema, ou `null` quando o nome serve. */
export function projectNameProblem(name: string): string | null {
  const trimmed = name.trim();

  if (!trimmed) return 'Enter a name for your project.';
  if (trimmed.length > MAX_LENGTH) return `That name is longer than the ${MAX_LENGTH} characters npm allows.`;
  if (trimmed.startsWith('.')) return 'A project name cannot start with a dot.';
  if (trimmed !== trimmed.toLowerCase()) return 'Package names are lowercase — try ' + trimmed.toLowerCase() + '.';
  if (!PACKAGE_NAME.test(trimmed)) {
    return 'Use lowercase letters, digits, hyphens, dots and underscores only.';
  }

  return null;
}

export function assertProjectName(name: string): void {
  const problem = projectNameProblem(name);
  if (problem) throw new CliError(`"${name}" cannot be a project name. ${problem}`, 'INVALID_PROJECT_NAME');
}

/**
 * O diretório precisa estar livre — ou, no máximo, ter coisas que um gerador
 * também ignoraria.
 *
 * Um `.git` recém-criado e o lixo do sistema de arquivos não são conteúdo: parar
 * por causa deles obrigaria a apagar um diretório que, para quem olha, está
 * vazio.
 */
const IGNORABLE = new Set(['.git', '.DS_Store', 'Thumbs.db', '.idea', '.vscode']);

export function assertDirectoryAvailable(cwd: string, name: string): string {
  const target = path.resolve(cwd, name);

  if (!existsSync(target)) return target;

  const entries = readdirSync(target).filter(entry => !IGNORABLE.has(entry));

  if (entries.length > 0) {
    throw new CliError(
      `${target} already has files in it. Pick another name, or remove the directory first — ` + 'nothing was written.',
      'DIRECTORY_NOT_EMPTY',
    );
  }

  return target;
}
