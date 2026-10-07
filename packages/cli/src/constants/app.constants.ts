import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Not `__dirname`: transpiled to CJS (as Jest does) that name is already bound
// by the module wrapper, and redeclaring it is a syntax error.
const moduleDir = dirname(fileURLToPath(import.meta.url));

const VERSION_FALLBACK = '0.0.0';

/**
 * Reads the CLI version from the package.json that ships with the binary.
 *
 * The build copies package.json next to the compiled entrypoint, so from
 * `constants/` it is always one level up — both in `dist/` and in the published
 * package, whose root *is* `dist/`. Going up two levels instead used to land on
 * `packages/cli/package.json` inside the monorepo, which hid the bug during
 * development, and on `node_modules/package.json` once installed, which is why
 * `zard-cli --version` printed `0.0.0` for users.
 *
 * The second candidate covers running straight from `src/`, and the name check
 * keeps an unrelated package.json further up the tree from being picked up.
 *
 * Exported for testing: the directory is a parameter so both layouts can be
 * exercised without depending on where the test file itself lives.
 */
export function resolveAppVersion(fromDir: string): string {
  const candidates = [join(fromDir, '../package.json'), join(fromDir, '../../package.json')];

  for (const candidate of candidates) {
    try {
      const packageJson = JSON.parse(readFileSync(candidate, 'utf8'));
      if (
        typeof packageJson.version === 'string' &&
        typeof packageJson.name === 'string' &&
        packageJson.name.startsWith('zard-cli')
      ) {
        return packageJson.version;
      }
    } catch {
      // Not there, or not readable — try the next candidate.
    }
  }

  console.warn('Failed to read version from package.json');
  return VERSION_FALLBACK;
}

export const APP_VERSION = resolveAppVersion(moduleDir);
