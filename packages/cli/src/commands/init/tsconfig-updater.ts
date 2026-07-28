import { aliasPattern, type Config } from '@cli/utils/config.js';
import { logger } from '@cli/utils/logger.js';
import * as commentJson from 'comment-json';
import { existsSync } from 'fs';
import { writeFile, readFile } from 'node:fs/promises';
import * as path from 'path';

export async function updateTsConfig(cwd: string, config: Config): Promise<void> {
  const tsconfigPath = path.join(cwd, 'tsconfig.json');

  if (!existsSync(tsconfigPath)) {
    logger.warn('tsconfig.json not found, skipping path configuration');
    return;
  }

  try {
    const tsconfig = await readTsConfig(tsconfigPath);
    const updatedTsConfig = updatePaths(tsconfig, config);
    await writeTsConfig(tsconfigPath, updatedTsConfig);
  } catch (error) {
    logger.warn('Failed to update tsconfig.json paths');
    logger.error(error);
  }
}

async function readTsConfig(tsconfigPath: string): Promise<any> {
  const tsconfigContent = await readFile(tsconfigPath, 'utf8');
  return commentJson.parse(tsconfigContent) as any;
}

function updatePaths(tsconfig: any, config: Config): any {
  if (!tsconfig.compilerOptions) {
    tsconfig.compilerOptions = {};
  }

  if (!tsconfig.compilerOptions.paths) {
    tsconfig.compilerOptions.paths = {};
  }

  // A chave vem do alias escolhido, não de um `@/*` fixo: quem configurou
  // `@app/components` gera imports com esse prefixo, e mapear outro deixaria
  // todo import do projeto sem resolver.
  tsconfig.compilerOptions.paths = {
    ...tsconfig.compilerOptions.paths,
    [aliasPattern(config.aliases.components)]: [`${pathMappingBase(tsconfig, config)}/*`],
  };

  return tsconfig;
}

/**
 * Escreve o mapeamento sem introduzir `baseUrl`.
 *
 * Declarar `baseUrl` quebra o build em TypeScript 6 — a opção virou erro e some
 * no 7 —, e desde o 4.1 ela não é mais necessária: sem ela, os caminhos são
 * resolvidos a partir do próprio tsconfig. Projetos que já declaram a opção
 * continuam sendo respeitados, com o mapeamento escrito em relação a ela.
 */
function pathMappingBase(tsconfig: any, config: Config): string {
  const baseUrl = tsconfig.compilerOptions.baseUrl;

  if (!baseUrl) return `./${config.baseUrl}`;

  return path.posix.relative(path.posix.normalize(baseUrl), path.posix.normalize(config.baseUrl)) || '.';
}

async function writeTsConfig(tsconfigPath: string, tsconfig: any): Promise<void> {
  const updatedContent = commentJson.stringify(tsconfig, null, 2);
  await writeFile(tsconfigPath, updatedContent, 'utf8');
}
