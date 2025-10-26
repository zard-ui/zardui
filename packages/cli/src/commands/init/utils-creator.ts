import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';

import { UTILS } from '@cli/utils/templates.js';
import { type Config } from '@cli/utils/config.js';

export async function createUtils(cwd: string, config: Config): Promise<void> {
  const utilsPath = path.join(cwd, config.aliases.utils);

  await ensureDirectoryExists(utilsPath);
  await writeUtilFiles(utilsPath);
}

async function ensureDirectoryExists(dirPath: string): Promise<void> {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }
}

async function writeUtilFiles(utilsPath: string): Promise<void> {
  for (const [fileName, content] of Object.entries(UTILS)) {
    const filePath = path.join(utilsPath, `${fileName}.ts`);
    await writeFile(filePath, content.trim(), 'utf8');
  }
}
