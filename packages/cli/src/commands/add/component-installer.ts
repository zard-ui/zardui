import { Config } from '@cli/utils/config';
import { fetchComponent, RegistryItem } from '@cli/utils/registry.js';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';

export async function installComponent(
  componentName: string,
  targetDir: string,
  config: Config & { resolvedPaths: any },
): Promise<void> {
  const component = await fetchComponent(componentName, config);

  await fs.mkdir(targetDir, { recursive: true });

  for (const file of component.files) {
    await installComponentFile(file, targetDir);
  }
}

async function installComponentFile(file: RegistryItem['files'][0], targetDir: string): Promise<void> {
  const filePath = path.join(targetDir, file.name);
  const fileDir = path.dirname(filePath);

  await fs.mkdir(fileDir, { recursive: true });
  await fs.writeFile(filePath, file.content, 'utf8');
}
