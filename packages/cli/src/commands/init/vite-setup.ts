import { splitAlias, type Config } from '@cli/utils/config.js';
import { logger } from '@cli/utils/logger.js';
import { arrayRange, lineEndingOf, objectRange, withImport, type BracketRange } from '@cli/utils/source-file.js';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import * as path from 'node:path';

const TAILWIND_IMPORT = "import tailwindcss from '@tailwindcss/vite';";
const TAILWIND_PLUGIN = 'tailwindcss()';

/**
 * Tailwind v4's browser baseline.
 *
 * It is what `build.cssTarget` has to be, so that Lightning CSS keeps the
 * logical properties (`margin-inline-start`, `inset-inline-end`…) the components use
 * instead of lowering them to `left`/`right` fallbacks.
 */
export const CSS_TARGET = ['chrome111', 'edge111', 'firefox128', 'safari16.4'];

const CSS_TARGET_LITERAL = `[${CSS_TARGET.map(browser => `'${browser}'`).join(', ')}]`;

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
 * Sets `build.cssTarget` so logical CSS survives right-to-left layouts.
 *
 * Vite reuses `build.target` as the CSS target. The Analog template sets it to
 * `es2020`, and Lightning CSS then lowers every logical property to a physical
 * `left`/`right` pair chosen by `:lang(ar|he|…)` — not by `dir`. A page with
 * `dir="rtl"` and `lang="en"` picks the LTR side everywhere: the dialog's close
 * button, the sheet, the select, the carousel arrows. Applied whether or not the
 * project uses RTL: the components use logical properties in LTR too.
 */
export async function setupCssTarget(cwd: string): Promise<void> {
  const configPath = findViteConfig(cwd);

  if (!configPath) {
    logger.warn(`vite.config.ts not found; add cssTarget: ${CSS_TARGET_LITERAL} to "build" manually.`);
    return;
  }

  const original = await readFile(configPath, 'utf8');
  const updated = ensureCssTarget(original);

  if (updated === null) {
    logger.warn(
      `Could not edit "build" in ${path.basename(configPath)}; add cssTarget: ${CSS_TARGET_LITERAL} to it manually, ` +
        'or right-to-left layouts will lay out left to right.',
    );
    return;
  }

  if (updated !== original) await writeFile(configPath, updated, 'utf8');
}

/**
 * Adds `cssTarget` to the config's `build` object.
 *
 * Returns the content untouched when there is a `cssTarget` already (never
 * overwritten) or the `build.target` is modern enough, and null when the shape is
 * not one that can be edited safely.
 */
export function ensureCssTarget(content: string): string | null {
  if (/(^|[{,])\s*cssTarget\s*:/m.test(content)) return content;

  const eol = lineEndingOf(content);
  const build = objectRange(content, 'build');

  if (!build) {
    // A `build: someVariable` is a shape this does not understand; no `build` at
    // all is the case where one can be created, in front of `plugins`.
    if (/\bbuild\s*:/.test(content)) return null;

    const plugins = /^([ \t]*)plugins\s*:/m.exec(content);
    if (!plugins) return null;

    const indent = plugins[1];
    const block = `${indent}build: {${eol}${indent}  cssTarget: ${CSS_TARGET_LITERAL},${eol}${indent}},${eol}`;

    return content.slice(0, plugins.index) + block + content.slice(plugins.index);
  }

  const multiline = build.body.includes('\n');
  const target = targetValue(content, build.open, build.close);

  if (target === null) return null;

  if (target) {
    if (isModernTarget(target.text)) return content;

    const indent = lineIndentAt(content, target.start);

    return (
      content.slice(0, target.end) +
      (multiline ? `,${eol}${indent}cssTarget: ${CSS_TARGET_LITERAL}` : `, cssTarget: ${CSS_TARGET_LITERAL}`) +
      content.slice(target.end)
    );
  }

  // No `target`: Vite's default (`modules`) is older than the baseline too.
  if (!build.body.trim()) {
    return content.slice(0, build.open) + `{ cssTarget: ${CSS_TARGET_LITERAL} }` + content.slice(build.close + 1);
  }

  if (!multiline) {
    return content.slice(0, build.open + 1) + ` cssTarget: ${CSS_TARGET_LITERAL},` + content.slice(build.open + 1);
  }

  const indent = /\n([ \t]+)\S/.exec(build.body)?.[1] ?? '    ';

  return (
    content.slice(0, build.open + 1) +
    `${eol}${indent}cssTarget: ${CSS_TARGET_LITERAL},` +
    content.slice(build.open + 1)
  );
}

const FILE_URL_IMPORT = "import { fileURLToPath } from 'node:url';";

/**
 * Registers the components alias as a Vite alias.
 *
 * Analog resolves the tsconfig `@/…` paths through `vite-tsconfig-paths`, and on
 * Windows that gives a backslash id (`C:\app\x.ts`) where a relative import of the
 * same file gives a forward-slash one (`C:/app/x.ts`). Vite 8 treats the two as
 * different modules and bundles the component twice; two classes mean two DI
 * tokens, so whatever `inject()`s a parent component (input-otp slots, context-menu
 * submenus, chart tooltips) stops finding it. An explicit alias to a normalised
 * absolute path makes both imports resolve to one id.
 */
export async function setupViteAlias(cwd: string, config: Pick<Config, 'aliases' | 'baseUrl'>): Promise<void> {
  const { prefix } = splitAlias(config.aliases.components);
  const target = aliasTarget(config.baseUrl);
  const snippet = `resolve: { alias: { '${prefix}': ${aliasValue(target)} } }`;
  const configPath = findViteConfig(cwd);

  if (!configPath) {
    logger.warn(`vite.config.ts not found; add ${snippet} manually (plus ${FILE_URL_IMPORT}).`);
    return;
  }

  const original = await readFile(configPath, 'utf8');
  const updated = ensureAlias(original, prefix, target);

  if (updated === null) {
    logger.warn(
      `Could not edit "resolve.alias" in ${path.basename(configPath)}; add ${snippet} to it manually ` +
        `(plus ${FILE_URL_IMPORT}), or components may be bundled twice on Windows.`,
    );
    return;
  }

  if (updated !== original) await writeFile(configPath, updated, 'utf8');
}

/** `src/app/` → `./src/app`: the path as the config writes it, relative to the config. */
function aliasTarget(baseUrl: string): string {
  const clean = baseUrl.replace(/\\/g, '/').replace(/^\.\//, '').replace(/\/+$/, '');

  return clean ? `./${clean}` : '.';
}

function aliasValue(target: string): string {
  return `fileURLToPath(new URL('${target}', import.meta.url))`;
}

/**
 * Adds `resolve.alias[alias]` to the config, plus the `fileURLToPath` import.
 *
 * Returns the content untouched when the alias is there already (never
 * overwritten), and null when the shape is not one that can be edited safely.
 */
export function ensureAlias(content: string, alias: string, target: string): string | null {
  const eol = lineEndingOf(content);
  const entry = `'${alias}': ${aliasValue(target)}`;
  const resolve = objectRange(content, 'resolve');

  let updated: string;

  if (!resolve) {
    if (/\bresolve\s*:/.test(content)) return null;

    const plugins = /^([ \t]*)plugins\s*:/m.exec(content);
    if (!plugins) return null;

    const indent = plugins[1];
    const block =
      `${indent}resolve: {${eol}${indent}  alias: {${eol}${indent}    ${entry},${eol}${indent}  },${eol}${indent}},` +
      eol;

    updated = content.slice(0, plugins.index) + block + content.slice(plugins.index);
  } else {
    const aliasObject = objectRange(content, 'alias', resolve.open);
    const inside = aliasObject && aliasObject.close < resolve.close;

    if (inside) {
      if (hasKey(aliasObject.body, alias)) return content;

      updated = addEntry(content, aliasObject, entry, eol);
    } else {
      // `alias: [...]` or `alias: someVariable` is not something to merge into.
      if (new RegExp(`\\balias\\s*:`).test(content.slice(resolve.open, resolve.close))) return null;

      updated = addEntry(content, resolve, `alias: { ${entry} }`, eol);
    }
  }

  return /import[^;]*\bfileURLToPath\b/.test(updated) ? updated : withImport(updated, FILE_URL_IMPORT);
}

function hasKey(body: string, key: string): boolean {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return new RegExp(`(^|[{,\\s])['"\`]?${escaped}['"\`]?\\s*:`).test(body);
}

/** Inserts `entry` as the first member of the object, keeping its layout. */
function addEntry(content: string, object: BracketRange, entry: string, eol: string): string {
  if (!object.body.trim()) {
    return content.slice(0, object.open) + `{ ${entry} }` + content.slice(object.close + 1);
  }

  if (!object.body.includes('\n')) {
    return content.slice(0, object.open + 1) + ` ${entry},` + content.slice(object.open + 1);
  }

  const indent = /\n([ \t]+)\S/.exec(object.body)?.[1] ?? '    ';

  return content.slice(0, object.open + 1) + `${eol}${indent}${entry},` + content.slice(object.open + 1);
}

interface TargetValue {
  readonly text: string;
  readonly start: number;
  readonly end: number;
}

/**
 * The `target` value inside the `build` object: undefined when there is none,
 * null when it is not a literal (a variable, a call) and so cannot be judged.
 */
function targetValue(content: string, from: number, to: number): TargetValue | null | undefined {
  const key = /\btarget\s*:\s*/.exec(content.slice(from, to));

  if (!key) return undefined;

  const start = from + key.index;
  const valueStart = start + key[0].length;
  const array = arrayRange(content, 'target', from);

  if (array && array.open === valueStart) {
    return { text: content.slice(array.open, array.close + 1), start, end: array.close + 1 };
  }

  const string = /^(['"`])[^'"`]*\1/.exec(content.slice(valueStart, to));

  return string ? { text: string[0], start, end: valueStart + string[0].length } : null;
}

const MINIMUM: Record<string, number> = { chrome: 111, edge: 111, firefox: 128, safari: 16.4, ios: 16.4 };

/** Whether every browser in the target is at or past Tailwind's baseline. */
function isModernTarget(text: string): boolean {
  const entries = [...text.matchAll(/['"`]([^'"`]+)['"`]/g)].map(match => match[1]);

  return (
    entries.length > 0 &&
    entries.every(entry => {
      if (entry === 'esnext') return true;

      const parsed = /^([a-z]+)(\d+(?:\.\d+)?)$/.exec(entry);

      return !!parsed && parsed[1] in MINIMUM && Number(parsed[2]) >= MINIMUM[parsed[1]];
    })
  );
}

function lineIndentAt(content: string, index: number): string {
  const lineStart = content.lastIndexOf('\n', index - 1) + 1;

  return /^[ \t]*/.exec(content.slice(lineStart, index))?.[0] ?? '';
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
