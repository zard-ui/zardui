import { Config } from '@cli/utils/config';
import { CliError, InstallError } from '@cli/utils/errors.js';
import { logger } from '@cli/utils/logger.js';
import { fetchComponent, RegistryItem } from '@cli/utils/registry.js';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';

export function validateTargetPath(targetDir: string, projectRoot: string): void {
  // Comparing string prefixes let a sibling directory through: `/proj-evil`
  // starts with `/proj` without being inside it. The relative path answers the
  // right question — is it contained? — and normalizes any `..` along the way.
  const relative = path.relative(path.resolve(projectRoot), path.resolve(targetDir));

  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new CliError('Target path must be within the project directory', 'INVALID_PATH');
  }
}

export async function installComponent(
  componentName: string,
  targetDir: string,
  config: Config & { resolvedPaths: any },
  options: { customPath?: boolean } = {},
): Promise<void> {
  const component = await fetchComponent(componentName, config, undefined, {
    siblingComponents: options.customPath,
  });

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
