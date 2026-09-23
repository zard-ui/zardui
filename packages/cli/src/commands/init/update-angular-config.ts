import type { Config } from '@cli/utils/config.js';
import { logger } from '@cli/utils/logger.js';
import { arrayRange, lineEndingOf, withImport, type ArrayRange } from '@cli/utils/source-file.js';
import { existsSync } from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';

const ZARD_PROVIDER_IMPORT = (corePath: string) => `import { provideZard } from '${corePath}/provider/providezard';`;
const ZARD_PROVIDER_ENTRY = 'provideZard()';

/**
 * Appends the provider to the end of the list.
 *
 * The `]` stays on its own line: the list is code the user will read and edit
 * later, and welding the closing bracket onto the last provider leaves the file
 * crooked the moment the project's Prettier does not run afterwards.
 */
function withProvider(content: string, providers: ArrayRange, eol: string): string {
  const body = providers.body.replace(/\s+$/, '');
  const entries = body.trim() === '' ? '' : `${body.endsWith(',') ? body : `${body},`}`;

  return (
    content.slice(0, providers.open) +
    `[${entries}${eol}    ${ZARD_PROVIDER_ENTRY},${eol}  ]` +
    content.slice(providers.close + 1)
  );
}

/**
 * Asynchronously reads, modifies, and writes the Angular application configuration file.
 * @returns {Promise<void>} A promise that resolves when the file operation is complete.
 */
export async function updateAngularConfig(cwd: string, config: Config): Promise<void> {
  const appConfigPath = path.join(cwd, config.appConfigFile);

  if (!existsSync(appConfigPath)) {
    logger.warn(`${appConfigPath} not found, skipping path configuration`);
    return;
  }

  try {
    await fsPromises.access(appConfigPath);
    const original: string = await fsPromises.readFile(appConfigPath, 'utf8');
    const eol = lineEndingOf(original);

    const content = withImport(original, ZARD_PROVIDER_IMPORT(config.aliases.core));
    const providers = arrayRange(content, 'providers');

    if (!providers) {
      logger.error(
        'Could not find the "providers: [...]" array in app.config.ts. The file structure may be unsupported.',
      );
      return;
    }

    if (providers.body.includes(ZARD_PROVIDER_ENTRY)) {
      logger.warn('Provider already exists in the list. Skipping.');
      await fsPromises.writeFile(appConfigPath, content, 'utf8');
      return;
    }

    await fsPromises.writeFile(appConfigPath, withProvider(content, providers, eol), 'utf8');
  } catch (e) {
    if (e && typeof e === 'object' && 'code' in e && e.code === 'ENOENT') {
      logger.error(`Error: Configuration file not found at ${appConfigPath}`);
    } else if (e instanceof Error) {
      logger.error('An error occurred during file operation:', e.message);
    } else {
      logger.error('An unknown error occurred:', e);
    }
    throw e;
  }
}
