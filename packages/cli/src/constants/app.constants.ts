import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get the CLI version from package.json
 * This is automatically synced with the package version during builds
 */
function getAppVersion(): string {
  try {
    // In production, package.json is at the root of the published package
    // From dist/constants/ we need to go up 2 levels to reach package.json
    const packageJsonPath = join(__dirname, '../../package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    return packageJson.version;
  } catch (error) {
    console.warn('Failed to read version from package.json');
    return '0.0.0';
  }
}

export const APP_VERSION = getAppVersion();
