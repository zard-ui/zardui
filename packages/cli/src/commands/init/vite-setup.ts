import { logger } from '@cli/utils/logger.js';
import { arrayRange, lineEndingOf, withImport } from '@cli/utils/source-file.js';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import * as path from 'node:path';

const TAILWIND_IMPORT = "import tailwindcss from '@tailwindcss/vite';";
const TAILWIND_PLUGIN = 'tailwindcss()';

/** The names Vite accepts, in the order it looks for them. */
const CONFIG_FILES = ['vite.config.ts', 'vite.config.mts', 'vite.config.js', 'vite.config.mjs'];

export function findViteConfig(cwd: string): string | null {
  return CONFIG_FILES.map(name => path.join(cwd, name)).find(existsSync) ?? null;
}

/**
 * Registers Tailwind as a Vite plugin.
 *
 * In Analog it is Vite that compiles, not the Angular build — a
 * `.postcssrc.json` there is read by nobody, and without the plugin the
 * `@import 'tailwindcss'` the theme writes into the global CSS emits no
 * utilities at all.
 */
export async function setupVitePlugin(cwd: string): Promise<void> {
  const configPath = findViteConfig(cwd);

  if (!configPath) {
    logger.warn('vite.config.ts not found; add the @tailwindcss/vite plugin manually.');
    return;
  }

  const original = await readFile(configPath, 'utf8');

  if (original.includes('@tailwindcss/vite')) {
    logger.info('Tailwind is already registered as a Vite plugin. Skipping.');
    return;
  }

  const withPlugin = registerPlugin(withImport(original, TAILWIND_IMPORT), lineEndingOf(original));

  if (withPlugin === null) {
    logger.warn(
      `Could not find the "plugins: [...]" array in ${path.basename(configPath)}; add tailwindcss() manually.`,
    );
    return;
  }

  await writeFile(configPath, withPlugin, 'utf8');
}

/**
 * Appends `tailwindcss()` to the plugin list.
 *
 * It goes at the end: order matters to Vite, and Analog's plugin has to process
 * the Angular files before Tailwind scans them for classes.
 */
function registerPlugin(content: string, eol: string): string | null {
  const plugins = arrayRange(content, 'plugins');

  if (!plugins) return null;
  if (plugins.body.includes(TAILWIND_PLUGIN)) return content;

  // The existing items' indentation is whatever the file already uses; matching
  // it keeps the new line from standing out when no Prettier runs afterwards.
  const indent = /\n([ \t]+)\S/.exec(plugins.body)?.[1] ?? '    ';
  const closingIndent = indent.slice(0, Math.max(0, indent.length - 2));
  const trimmed = plugins.body.replace(/\s+$/, '');

  const entries = trimmed.trim() ? `${trimmed.endsWith(',') ? trimmed : `${trimmed},`}` : '';

  return (
    content.slice(0, plugins.open) +
    `[${entries}${eol}${indent}${TAILWIND_PLUGIN},${eol}${closingIndent}]` +
    content.slice(plugins.close + 1)
  );
}
