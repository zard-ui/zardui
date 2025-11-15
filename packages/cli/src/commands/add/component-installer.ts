import { existsSync, promises as fs } from 'node:fs';
import * as path from 'node:path';

import { ComponentRegistry } from '../../core/registry/index.js';
import type { Config } from '../../utils/config.js';
import { fetchComponentFromGithub } from '../../utils/fetch-component.js';

export async function installComponent(
  component: ComponentRegistry,
  targetDir: string,
  config: Config & { resolvedPaths: any },
  overwrite: boolean,
): Promise<void> {
  validateInstallation(component, targetDir, overwrite);

  await fs.mkdir(targetDir, { recursive: true });

  for (const file of component.files) {
    await installComponentFile(component, file, targetDir, config);
  }
}

function validateInstallation(component: ComponentRegistry, targetDir: string, overwrite: boolean): void {
  if (!overwrite && existsSync(targetDir)) {
    throw new Error(`Component ${component.name} already exists. Use --overwrite to overwrite.`);
  }
}

async function installComponentFile(
  component: ComponentRegistry,
  file: { name: string },
  targetDir: string,
  config: Config & { resolvedPaths: any },
): Promise<void> {
  const content = await fetchComponentFromGithub(component.name, file.name, config);
  const filePath = path.join(targetDir, file.name);
  const fileDir = path.dirname(filePath);

  await fs.mkdir(fileDir, { recursive: true });
  await fs.writeFile(filePath, content, 'utf8');
}
