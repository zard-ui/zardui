import { APP_VERSION } from '../constants/app.constants.js';
import { fileURLToPath } from 'url';
import { access, readFile } from 'node:fs/promises';
import * as path from 'path';

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath: string): Promise<any> {
  const content = await readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

type PackageJson = {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

export async function getPackageInfo(): Promise<PackageJson> {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    const possiblePaths = [
      path.resolve(__dirname, '../package.json'),
      path.resolve(__dirname, '../../../package.json'),
      path.resolve(__dirname, '../../package.json'),
      path.resolve(__dirname, '../../../../package.json'),
      path.resolve(__dirname, '../node_modules/@ngzard/ui/package.json'),
    ];

    for (const packageJsonPath of possiblePaths) {
      try {
        if (await pathExists(packageJsonPath)) {
          return await readJson(packageJsonPath);
        }
      } catch {
        // Continue to next path
      }
    }

    // Fallback to hardcoded info if package.json is not found
    return {
      name: '@ngzard/ui',
      version: APP_VERSION,
    };
  } catch (error) {
    // Ultimate fallback
    return {
      name: '@ngzard/ui',
      version: APP_VERSION,
    };
  }
}
