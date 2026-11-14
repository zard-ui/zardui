import { logger } from '@cli/utils/logger.js';
import { arrayRange, lineEndingOf, objectRange, withImport } from '@cli/utils/source-file.js';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
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
 * Makes Vite resolve the tsconfig path aliases init writes. Without it the Analog dev server cannot resolve `@/`, and
 * the build bundles a file twice when it is imported both through the alias and relatively. Needs Vite 8.
 */
export async function setupViteTsconfigPaths(cwd: string): Promise<void> {
  const configPath = findViteConfig(cwd);

  if (!configPath) {
    logger.warn('vite.config.ts not found; set resolve.tsconfigPaths to true in it so Vite resolves the @/ imports.');
    return;
  }

  const major = installedViteMajor(cwd);

  if (major !== null && major < 8) {
    logger.warn(
      `Vite ${major} does not read tsconfig paths: add the vite-tsconfig-paths plugin to ${path.basename(configPath)} so it resolves the @/ imports.`,
    );
    return;
  }

  const original = await readFile(configPath, 'utf8');
  const updated = withTsconfigPaths(original);

  if (updated === null) {
    logger.warn(
      `Could not find "resolve" or "plugins" in ${path.basename(configPath)}; add resolve: { tsconfigPaths: true } manually.`,
    );
    return;
  }

  if (updated !== original) await writeFile(configPath, updated, 'utf8');
}

/** Sets `resolve.tsconfigPaths: true`, or returns null when the config has neither `resolve` nor `plugins`. */
export function withTsconfigPaths(content: string): string | null {
  if (/\btsconfigPaths\s*:/.test(content)) return content;

  const eol = lineEndingOf(content);
  const resolve = objectRange(content, 'resolve');

  if (resolve) {
    const before = content.slice(0, resolve.open + 1);
    const after = content.slice(resolve.close);
    const trimmed = resolve.body.replace(/\s+$/, '');
    const separator = trimmed.trim() && !trimmed.endsWith(',') ? ',' : '';

    if (!resolve.body.includes('\n')) {
      return `${before}${trimmed.trim() ? `${trimmed}${separator}` : ''} tsconfigPaths: true }${after.slice(1)}`;
    }

    const indent = /\n([ \t]+)\S/.exec(resolve.body)?.[1] ?? '    ';
    const closing = resolve.body.slice(trimmed.length);

    return `${before}${trimmed}${separator}${eol}${indent}tsconfigPaths: true,${closing}${after}`;
  }

  const plugins = /^([ \t]*)plugins\s*:/m.exec(content);

  if (!plugins) return null;

  const indent = plugins[1];
  const block = `${indent}resolve: {${eol}${indent}  tsconfigPaths: true,${eol}${indent}},${eol}`;

  return content.slice(0, plugins.index) + block + content.slice(plugins.index);
}

/** The major version of the `vite` the project resolves, or null when it cannot be read. */
function installedViteMajor(cwd: string): number | null {
  try {
    const require = createRequire(path.join(cwd, 'package.json'));
    const { version } = require('vite/package.json') as { version: string };
    const major = Number.parseInt(version, 10);
    return Number.isNaN(major) ? null : major;
  } catch {
    return null;
  }
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
