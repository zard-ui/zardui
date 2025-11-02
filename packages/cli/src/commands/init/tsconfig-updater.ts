import { type Config } from '@cli/utils/config.js';
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
    const updatedTsConfig = updatePaths(tsconfig);
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

function updatePaths(tsconfig: any): any {
  if (!tsconfig.compilerOptions) {
    tsconfig.compilerOptions = {};
  }

  if (!tsconfig.compilerOptions.baseUrl) {
    tsconfig.compilerOptions.baseUrl = './';
  }

  if (!tsconfig.compilerOptions.paths) {
    tsconfig.compilerOptions.paths = {};
  }

  const pathMappings = {
    '@shared/*': ['src/app/shared/*'],
  };

  tsconfig.compilerOptions.paths = {
    ...tsconfig.compilerOptions.paths,
    ...pathMappings,
  };

  return tsconfig;
}

async function writeTsConfig(tsconfigPath: string, tsconfig: any): Promise<void> {
  const updatedContent = commentJson.stringify(tsconfig, null, 2);
  await writeFile(tsconfigPath, updatedContent, 'utf8');
}
