import { APP_VERSION } from '../constants/app.constants.js';
import { fileURLToPath } from 'url';
import * as fs from 'fs-extra';
import * as path from 'path';

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
        if (await fs.pathExists(packageJsonPath)) {
          return await fs.readJson(packageJsonPath);
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
