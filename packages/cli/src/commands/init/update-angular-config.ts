import type { Config } from '@cli/utils/config.js';
import { logger } from '@cli/utils/logger.js';
import { existsSync } from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';

const ZARD_PROVIDER_IMPORT = "import { provideZard } from '@shared/components/core/provider/providezard';\n";
const ZARD_PROVIDER_ENTRY = 'provideZard(),';

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
    let content: string = await fsPromises.readFile(appConfigPath, 'utf8');

    // Add new import at the top
    if (!content.includes(ZARD_PROVIDER_IMPORT.trim())) {
      const importRegex = /^import .* from '.*';\n?/gm;
      let lastImportMatch: RegExpMatchArray | null = null;
      let match: RegExpMatchArray | null;

      while ((match = importRegex.exec(content)) !== null) {
        lastImportMatch = match;
      }

      if (lastImportMatch) {
        const insertionIndex = lastImportMatch.index + lastImportMatch[0].length;
        content = content.slice(0, insertionIndex) + ZARD_PROVIDER_IMPORT + content.slice(insertionIndex);
      } else {
        content = ZARD_PROVIDER_IMPORT + content;
      }
    } else {
      logger.warn('⚠️ Import statement already exists. Skipping.');
    }

    // Add the provider to the providers array
    const providersRegex = /providers:\s*\[([^\]]*?)\]/s;

    if (providersRegex.test(content)) {
      content = content.replace(providersRegex, (match: string, providersContent: string): string => {
        const entryToCheck = ZARD_PROVIDER_ENTRY.replace(/,$/, '').trim();
        if (providersContent.includes(entryToCheck)) {
          logger.warn('⚠️ Provider already exists in the list. Skipping.');
          return match;
        }

        let newProvidersContent: string;
        const trimmedContent = providersContent.trim();

        if (trimmedContent === '') {
          newProvidersContent = `\n    ${ZARD_PROVIDER_ENTRY.trim().replace(/,$/, '')}\n  `;
        } else {
          const contentWithTrailingComma = trimmedContent.endsWith(',')
            ? providersContent
            : providersContent.trimEnd() + ',';

          newProvidersContent = `${contentWithTrailingComma}\n    ${ZARD_PROVIDER_ENTRY}`;
        }

        return `providers: [${newProvidersContent.replace(/,\s*$/, ',')}]`;
      });
    } else {
      logger.error(
        '❌ Could not find the "providers: [...]" array in app.config.ts. The file structure may be unsupported.',
      );
      return;
    }

    await fsPromises.writeFile(appConfigPath, content, 'utf8');
  } catch (e) {
    if (e && typeof e === 'object' && 'code' in e && e.code === 'ENOENT') {
      logger.error(`Error: Configuration file not found at ${appConfigPath}`);
    } else if (e instanceof Error) {
      logger.error('\n❌ An error occurred during file operation:', e.message);
    } else {
      logger.error('\n❌ An unknown error occurred:', e);
    }
    throw e;
  }
}
