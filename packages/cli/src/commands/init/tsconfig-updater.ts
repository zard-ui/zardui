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

  raiseLib(tsconfig.compilerOptions);

  return tsconfig;
}

/** The oldest ECMAScript library the components compile against (`Array.prototype.at`). */
const MINIMUM_ES_YEAR = 2022;

/** `es2020` / `ES6` / `es2015` → the year; anything else (`dom`, `es2020.promise`, `esnext`) → undefined. */
function esYear(entry: unknown): number | undefined {
  const match = typeof entry === 'string' ? /^es(\d+)$/i.exec(entry.trim()) : null;
  if (!match) return undefined;

  const version = Number(match[1]);
  return version >= 2015 ? version : version + 2009; // es6 is es2015
}

/**
 * Makes sure `lib` reaches ES2022.
 *
 * `create-nx-workspace` writes `"lib": ["es2020", "dom"]` into tsconfig.base.json, and the components
 * use ES2022 APIs (`Array.prototype.at`): the production build failed with TS2339. Only an explicit
 * `lib` that stops below ES2022 is touched — without one, `target` decides, and `esnext` or a newer
 * year already covers it. The old plain `esXXXX` entries are replaced by `es2022`; everything else
 * (`dom`, `es2020.promise`…) stays where it was.
 */
function raiseLib(compilerOptions: any): void {
  const lib = compilerOptions.lib;
  if (!Array.isArray(lib)) return;

  const covered = lib.some(
    entry =>
      (typeof entry === 'string' && entry.trim().toLowerCase() === 'esnext') || (esYear(entry) ?? 0) >= MINIMUM_ES_YEAR,
  );
  if (covered) return;

  const index = lib.findIndex(entry => esYear(entry) !== undefined);
  if (index === -1) {
    lib.unshift(`es${MINIMUM_ES_YEAR}`);
    return;
  }

  lib[index] = `es${MINIMUM_ES_YEAR}`;
  for (let i = lib.length - 1; i > index; i--) {
    if (esYear(lib[i]) !== undefined) lib.splice(i, 1);
  }
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
