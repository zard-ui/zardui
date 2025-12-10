import { Config } from '@cli/utils/config.js';
import { logger } from '@cli/utils/logger.js';
import * as fsPromises from 'fs/promises';
import * as path from 'path';

const HEAD_CLOSE_TAG = '</head>';

const THEME_SCRIPT_CONTENT = `
    <script>
      (function () {
        const html = document.documentElement;

        try {
          const theme = localStorage.theme;
          const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;

          const isSystem = theme === 'system' || !('theme' in localStorage);
          const isDark = theme === 'dark' || (isSystem && prefersDark);
          const resolvedTheme = isDark ? 'dark' : 'light';
          html.classList.toggle('dark', isDark);
          html.classList.toggle('dark-theme', isDark);
          html.setAttribute('data-theme', theme ?? 'system');
          html.style.colorScheme = resolvedTheme;
        } catch (_) {}
      })();
    </script>
`;

/**
 * Asynchronously reads, modifies, and writes the index.html file to inject the theme script.
 * @returns {Promise<void>} A promise that resolves when the file operation is complete.
 */
export async function injectThemeScript(cwd: string, config: Config): Promise<void> {
  console.log(`Reading index.html file: ${config.indexFile}`);
  const indexConfigPath = path.join(cwd, config.indexFile);

  try {
    await fsPromises.access(indexConfigPath);
    let content: string = await fsPromises.readFile(indexConfigPath, 'utf8');

    const identifier = 'localStorage.theme';
    if (content.includes(identifier)) {
      logger.info('Theme script already detected in index.html. Skipping injection.');
      return;
    }

    const headCloseIndex = content.toLowerCase().indexOf(HEAD_CLOSE_TAG);

    if (headCloseIndex !== -1) {
      const insertionIndex = headCloseIndex;

      content = content.slice(0, insertionIndex) + THEME_SCRIPT_CONTENT + '\n  ' + content.slice(insertionIndex);

      logger.info('✔ Successfully inserted theme script before </head> tag.');
    } else {
      logger.error('Could not find the closing </head> tag in index.html.');
      return;
    }

    // 4. Write the updated content back to the file
    await fsPromises.writeFile(indexConfigPath, content, 'utf8');
  } catch (e) {
    if (e && typeof e === 'object' && 'code' in e && e.code === 'ENOENT') {
      logger.error(`Error: index.html file not found at ${indexConfigPath}. Please check the path.`);
    } else if (e instanceof Error) {
      logger.error('An error occurred during file operation:', e.message);
    } else {
      logger.error('An unknown error occurred:', e);
    }
    // Exit process with error status
    process.exit(1);
  }
}
