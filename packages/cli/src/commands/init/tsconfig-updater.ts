import { aliasPattern, type Config } from '@cli/utils/config.js';
import { logger } from '@cli/utils/logger.js';
import * as commentJson from 'comment-json';
import { existsSync } from 'fs';
import { writeFile, readFile } from 'node:fs/promises';
import * as path from 'path';

/**
 * Writes the alias into the tsconfig the projects actually extend.
 *
 * In an Nx workspace that is `tsconfig.base.json`: the root `tsconfig.json` is
 * inherited by no project, and a mapping written there would never reach the
 * compiler — the alias resolved in the editor and broke in the build.
 */
export async function updateTsConfig(cwd: string, config: Config, tsconfigFile = 'tsconfig.json'): Promise<void> {
  const tsconfigPath = path.join(cwd, tsconfigFile);

  if (!existsSync(tsconfigPath)) {
    logger.warn(`${tsconfigFile} not found, skipping path configuration`);
    return;
  }

  try {
    const tsconfig = await readTsConfig(tsconfigPath);
    const updatedTsConfig = updatePaths(tsconfig, config);
    await writeTsConfig(tsconfigPath, updatedTsConfig);
  } catch (error) {
    logger.warn(`Failed to update ${tsconfigFile} paths`);
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

  // The key comes from the chosen alias, not from a fixed `@/*`: someone who
  // configured `@app/components` generates imports with that prefix, and mapping
  // a different one would leave every import in the project unresolved.
  tsconfig.compilerOptions.paths = {
    ...tsconfig.compilerOptions.paths,
    [aliasPattern(config.aliases.components)]: [`${pathMappingBase(tsconfig, config)}/*`],
  };

  return tsconfig;
}

/**
 * Writes the mapping without introducing `baseUrl`.
 *
 * Declaring `baseUrl` breaks the build on TypeScript 6 — the option became an
 * error and disappears in 7 — and since 4.1 it is no longer necessary: without
 * it, paths are resolved relative to the tsconfig itself. Projects that already
 * declare the option are still honoured, with the mapping written relative to it.
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
