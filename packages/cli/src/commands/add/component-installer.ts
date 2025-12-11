import { existsSync, promises as fs } from 'node:fs';
import * as path from 'node:path';

import type { Config } from '../../utils/config.js';
import { fetchComponent, type RegistryItem } from '../../utils/registry.js';

export async function installComponent(
  componentName: string,
  targetDir: string,
  config: Config & { resolvedPaths: any },
  overwrite: boolean,
): Promise<void> {
  validateInstallation(componentName, targetDir, overwrite);

  const component = await fetchComponent(componentName, config);

  await fs.mkdir(targetDir, { recursive: true });

  for (const file of component.files) {
    await installComponentFile(file, targetDir);
  }
}

function validateInstallation(componentName: string, targetDir: string, overwrite: boolean): void {
  if (!overwrite && existsSync(targetDir)) {
    throw new Error(`Component ${componentName} already exists. Use --overwrite to overwrite.`);
  }
}

async function installComponentFile(file: RegistryItem['files'][0], targetDir: string): Promise<void> {
  const filePath = path.join(targetDir, file.name);
  const fileDir = path.dirname(filePath);

  await fs.mkdir(fileDir, { recursive: true });
  await fs.writeFile(filePath, file.content, 'utf8');
}
