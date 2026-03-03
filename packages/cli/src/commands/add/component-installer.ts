import { Config } from '@cli/utils/config';
import { CliError, InstallError } from '@cli/utils/errors.js';
import { logger } from '@cli/utils/logger.js';
import { fetchComponent, RegistryItem } from '@cli/utils/registry.js';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';

export function validateTargetPath(targetDir: string, projectRoot: string): void {
  const resolved = path.resolve(targetDir);
  if (!resolved.startsWith(projectRoot)) {
    throw new CliError('Target path must be within the project directory', 'INVALID_PATH');
  }
}

export async function installComponent(
  componentName: string,
  targetDir: string,
  config: Config & { resolvedPaths: any },
): Promise<void> {
  const component = await fetchComponent(componentName, config);

  await fs.mkdir(targetDir, { recursive: true });

  const writtenFiles: string[] = [];

  try {
    for (const file of component.files) {
      const filePath = await installComponentFile(file, targetDir);
      writtenFiles.push(filePath);
    }
  } catch (error) {
    // Rollback: remove all written files
    for (const filePath of writtenFiles) {
      await fs.unlink(filePath).catch(() => {
        /* ignore cleanup errors */
      });
    }
    logger.debug(`Rolled back ${writtenFiles.length} file(s) for component "${componentName}"`);

    throw new InstallError(
      `Failed to install component "${componentName}": ${error instanceof Error ? error.message : error}`,
      componentName,
    );
  }
}

async function installComponentFile(file: RegistryItem['files'][0], targetDir: string): Promise<string> {
  const filePath = path.join(targetDir, file.name);
  const fileDir = path.dirname(filePath);

  await fs.mkdir(fileDir, { recursive: true });
  await fs.writeFile(filePath, file.content, 'utf8');

  return filePath;
}
