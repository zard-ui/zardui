/**
 * ZardUI project utilities
 */

import { promises as fs } from 'fs';
import path from 'path';
import { logger } from './logger.js';

export interface ProjectInfo {
  root: string;
  componentsPath: string;
  publicPath: string;
  cliPath?: string;
}

/**
 * Auto-detect ZardUI project root
 */
export async function detectProjectRoot(startPath?: string): Promise<string | null> {
  let currentPath = startPath || process.cwd();

  // Walk up the directory tree looking for ZardUI indicators
  while (currentPath !== path.dirname(currentPath)) {
    try {
      // Check for ZardUI specific files/folders
      const packageJsonPath = path.join(currentPath, 'package.json');
      const libsPath = path.join(currentPath, 'libs', 'zard');
      const nxJsonPath = path.join(currentPath, 'nx.json');

      if (
        await fs
          .access(packageJsonPath)
          .then(() => true)
          .catch(() => false)
      ) {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

        // Check if it's a ZardUI project
        if (
          packageJson.name?.includes('zardui') ||
          packageJson.keywords?.includes('zardui') ||
          (await fs
            .access(libsPath)
            .then(() => true)
            .catch(() => false)) ||
          (await fs
            .access(nxJsonPath)
            .then(() => true)
            .catch(() => false))
        ) {
          return currentPath;
        }
      }

      currentPath = path.dirname(currentPath);
    } catch (error) {
      logger.debug(`Error checking path ${currentPath}:`, error);
      currentPath = path.dirname(currentPath);
    }
  }

  return null;
}

/**
 * Get project information
 */
export async function getProjectInfo(projectPath?: string): Promise<ProjectInfo> {
  const root = projectPath || (await detectProjectRoot()) || process.cwd();

  const info: ProjectInfo = {
    root,
    componentsPath: path.join(root, 'libs', 'zard', 'src', 'lib', 'components'),
    publicPath: path.join(root, 'apps', 'web', 'public'),
  };

  // Check if CLI is available locally
  const cliPath = path.join(root, 'packages', 'cli', 'dist', 'index.js');
  if (
    await fs
      .access(cliPath)
      .then(() => true)
      .catch(() => false)
  ) {
    info.cliPath = cliPath;
  }

  logger.debug('Project info:', info);
  return info;
}

/**
 * List all components in the project
 */
export async function listComponents(projectInfo: ProjectInfo): Promise<string[]> {
  try {
    const dirs = await fs.readdir(projectInfo.componentsPath);
    const components = [];

    for (const dir of dirs) {
      const stat = await fs.stat(path.join(projectInfo.componentsPath, dir));
      if (stat.isDirectory() && dir !== 'core') {
        components.push(dir);
      }
    }

    return components.sort();
  } catch (error) {
    logger.error('Error listing components:', error);
    return [];
  }
}

/**
 * Check if a component exists
 */
export async function componentExists(projectInfo: ProjectInfo, name: string): Promise<boolean> {
  try {
    const componentPath = path.join(projectInfo.componentsPath, name);
    const stat = await fs.stat(componentPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}
