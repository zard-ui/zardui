import { importStylesIntoGlobalCss, relativeImportTarget } from '@cli/commands/add/stylesheet-setup.js';
import { isLibraryKind, projectRootOf } from '@cli/commands/init/project-kind.js';
import { findViteConfig } from '@cli/commands/init/vite-setup.js';
import type { RegistryBuild } from '@cli/core/registry/registry-data.js';
import type { Config } from '@cli/utils/config.js';
import type { WorkspaceProject } from '@cli/utils/get-project-info.js';
import { appendToArray } from '@cli/utils/json-text.js';
import { logger } from '@cli/utils/logger.js';
import * as commentJson from 'comment-json';
import { existsSync, readdirSync } from 'node:fs';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import * as path from 'node:path';

/**
 * Wires into the project whatever an installed item declares in its `build` field.
 *
 * Some items cannot work from their source files and npm packages alone: the map needs its CSS loaded globally,
 * in a given order, and two worker files served from the site root. Nothing here knows about any particular item —
 * the registry says what is needed, and this module knows, per project type, where it goes:
 *
 *   angular / nx      the global stylesheet, and the `assets` of the build target (angular.json / project.json)
 *   analog            the global stylesheet, and the files copied into Vite's public directory
 *   *-library         nothing is edited — a library has no global CSS and no build of its own — and the steps for
 *                     the consuming application are printed
 *
 * Every step is idempotent, and when a file cannot be edited safely it is left alone and the exact snippet to
 * paste is printed.
 */

export interface BuildItem {
  /** The registry item that declared the requirement. */
  readonly name: string;
  readonly build: RegistryBuild;
  /** Absolute directory its files were written to. */
  readonly dir: string;
}

export interface BuildSetupContext {
  /** Where `components.json` lives. */
  readonly cwd: string;
  /** The workspace root: where `angular.json` sits and what an asset's `input` is relative to. */
  readonly workspaceRoot: string;
  readonly projectType: Config['projectType'];
  /** `config.baseUrl`: the project's source directory for components, from which its root is derived. */
  readonly baseUrl: string;
  /** Absolute path of the global stylesheet (`tailwind.css` in components.json). */
  readonly globalCss: string;
  readonly projects: readonly Pick<WorkspaceProject, 'name' | 'root' | 'projectType'>[];
}

type Asset = NonNullable<RegistryBuild['assets']>[number];

export async function setupBuild(items: readonly BuildItem[], context: BuildSetupContext): Promise<void> {
  if (!items.length) return;

  const merged = mergeBuilds(items, context.globalCss);
  const assets = availableAssets(merged.assets, context.workspaceRoot);
  const names = items.map(item => item.name).join(', ');

  if (isLibraryKind(context.projectType)) {
    printLibrarySteps(names, merged.styles, merged.libraryStyles, assets, context);
    return;
  }

  if (merged.styles.length) {
    const result = await importStylesIntoGlobalCss(context.globalCss, merged.styles);
    if (result === 'added') logger.info(`Global stylesheet updated for ${names}.`);
    else if (result === 'present') logger.info(`Global stylesheet already set up for ${names}.`);
  }

  if (!assets.length) return;

  if (context.projectType === 'analog') {
    await copyAssetsToPublicDir(assets, context);
    return;
  }

  await registerBuildAssets(assets, context);
}

/** Every item's styles and assets as one ordered, de-duplicated list. */
function mergeBuilds(
  items: readonly BuildItem[],
  globalCss: string,
): { styles: string[]; libraryStyles: string[]; assets: Asset[] } {
  const styles: string[] = [];
  const libraryStyles: string[] = [];
  const assets: Asset[] = [];

  for (const item of items) {
    for (const style of item.build.styles ?? []) {
      const target =
        'import' in style ? style.import : relativeImportTarget(globalCss, path.join(item.dir, style.file));
      const printed = 'import' in style ? style.import : path.join(item.dir, style.file);

      if (!styles.includes(target)) {
        styles.push(target);
        libraryStyles.push(printed);
      }
    }

    for (const asset of item.build.assets ?? []) {
      if (!assets.some(known => sameAsset(known, asset))) assets.push(asset);
    }
  }

  return { styles, libraryStyles, assets };
}

function sameAsset(a: Pick<Asset, 'glob' | 'input'>, b: Pick<Asset, 'glob' | 'input'>): boolean {
  return a.glob === b.glob && normalizeInput(a.input) === normalizeInput(b.input);
}

function normalizeInput(input: unknown): string {
  return String(input ?? '')
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/\/+$/, '');
}

const WILDCARD = /[*?]/;

/** The files of `directory` that a flat glob (`*` and `?` in the file name) selects. */
function expandGlob(directory: string, glob: string): string[] {
  if (!WILDCARD.test(glob)) return existsSync(path.join(directory, glob)) ? [glob] : [];

  const pattern = new RegExp(
    `^${glob
      .split('')
      .map(char => (char === '*' ? '[^/]*' : char === '?' ? '[^/]' : char.replace(/[.+^${}()|[\]\\]/g, '\\$&')))
      .join('')}$`,
  );

  return readdirSync(directory).filter(file => pattern.test(file));
}

/** `node_modules` can sit above the workspace; the first copy found going up is the one the build resolves. */
function resolveInput(workspaceRoot: string, input: string): string | null {
  const relative = normalizeInput(input);
  let dir = path.resolve(workspaceRoot);

  for (;;) {
    const candidate = path.resolve(dir, relative);
    if (existsSync(candidate)) return candidate;

    const parent = path.dirname(dir);
    if (parent === dir || !relative.startsWith('node_modules')) return null;
    dir = parent;
  }
}

/**
 * The assets that exist in what is installed.
 *
 * A requirement can belong to one release of a package and not another: MapLibre 5 builds its worker inline and
 * ships no `maplibre-gl-worker.mjs`, so a project on the Angular 21 line has nothing to copy. Registering a glob
 * that matches nothing is harmless but misleading, so it is dropped — only when the package is there to look at;
 * when it is not (a failed install, a layout this cannot see), the asset is kept and the build decides.
 */
function availableAssets(assets: readonly Asset[], workspaceRoot: string): Asset[] {
  return assets.filter(asset => {
    const directory = resolveInput(workspaceRoot, asset.input);
    if (!directory) return true;

    const present = expandGlob(directory, asset.glob).length > 0;
    if (!present) logger.debug(`${asset.glob} is not in ${asset.input}; this release does not need it.`);

    return present;
  });
}

// ---------------------------------------------------------------------------------------------------------------
// Angular CLI and Nx: the assets of the build target
// ---------------------------------------------------------------------------------------------------------------

interface BuildTargetFile {
  /** Path relative to the workspace root, for messages. */
  readonly file: string;
  readonly keys: string[];
}

/** Where the build target's `assets` live: `angular.json` for Angular, the project's own `project.json` for Nx. */
function locateBuildTarget(context: BuildSetupContext): BuildTargetFile | null {
  const root = projectRootOf(context.baseUrl);
  const projectRoot = root === '.' ? '' : root;
  const applications = context.projects.filter(project => project.projectType === 'application');
  const project =
    applications.find(candidate => candidate.root === projectRoot) ??
    (applications.length === 1 ? applications[0] : undefined);

  if (!project) return null;

  if (context.projectType === 'nx') {
    return {
      file: path.posix.join(project.root, 'project.json'),
      keys: ['targets', 'build', 'options', 'assets'],
    };
  }

  return { file: 'angular.json', keys: ['projects', project.name, 'architect', 'build', 'options', 'assets'] };
}

async function registerBuildAssets(assets: readonly Asset[], context: BuildSetupContext): Promise<void> {
  const target = locateBuildTarget(context);
  const snippet = (reason: string) => printAssetsSnippet(reason, assets, target?.file ?? 'angular.json');

  if (!target) {
    snippet('Could not tell which project the build belongs to.');
    return;
  }

  const filePath = path.resolve(context.workspaceRoot, target.file);

  if (!existsSync(filePath)) {
    snippet(`${target.file} not found.`);
    return;
  }

  const original = await readFile(filePath, 'utf8');
  let existing: unknown[];

  try {
    existing = readAssets(original, target.keys);
  } catch {
    snippet(`Could not parse ${target.file}.`);
    return;
  }

  const missing = assets.filter(
    asset =>
      !existing.some(
        entry =>
          typeof entry === 'object' &&
          entry !== null &&
          sameAsset(entry as Pick<Asset, 'glob' | 'input'>, asset as Pick<Asset, 'glob' | 'input'>),
      ),
  );

  if (!missing.length) {
    logger.info(`Build assets already registered in ${target.file}.`);
    return;
  }

  let updated: string | null;
  try {
    updated = appendToArray(original, target.keys, missing);
  } catch {
    updated = null;
  }

  if (updated === null) {
    snippet(`Could not find the build target's "options" in ${target.file}.`);
    return;
  }

  await writeFile(filePath, updated, 'utf8');
  logger.info(`Registered ${missing.map(asset => asset.glob).join(', ')} as build assets in ${target.file}.`);
}

/** The `assets` array at the key path, or an empty list when the path (or the array) does not exist. */
function readAssets(text: string, keys: readonly string[]): unknown[] {
  let node: unknown = commentJson.parse(text);

  for (const key of keys) {
    if (typeof node !== 'object' || node === null || !(key in node)) return [];
    node = (node as Record<string, unknown>)[key];
  }

  return Array.isArray(node) ? [...node] : [];
}

function printAssetsSnippet(reason: string, assets: readonly Asset[], file: string): void {
  logger.warn(
    `${reason} Add the build assets by hand — in ${file}, under the build target's options:\n` +
      `"assets": [\n${assets.map(asset => `  ${JSON.stringify(asset)}`).join(',\n')}\n]`,
  );
}

// ---------------------------------------------------------------------------------------------------------------
// Analog / Vite: files in the public directory
// ---------------------------------------------------------------------------------------------------------------

/**
 * Analog has no `assets` option: Vite serves the contents of its public directory at the root, in development and
 * in the build, and nothing else. So the files are copied there. The copy is refreshed on every run — a newer
 * MapLibre ships a newer worker, and `add <item> --overwrite` is how a project picks it up.
 */
async function copyAssetsToPublicDir(assets: readonly Asset[], context: BuildSetupContext): Promise<void> {
  const projectDir = path.resolve(context.cwd, projectRootOf(context.baseUrl));
  const publicDir = await vitePublicDir(projectDir);
  const names = assets.map(asset => asset.glob).join(', ');

  if (publicDir === null) {
    logger.warn(
      `The Vite config disables or moves the public directory, so ${names} cannot be placed automatically. ` +
        `Copy ${assets.map(asset => `${asset.input}/${asset.glob}`).join(' and ')} to the root of whatever your ` +
        'build serves.',
    );
    return;
  }

  const copied: string[] = [];
  let upToDate = 0;

  for (const asset of assets) {
    const sourceDir = resolveInput(context.workspaceRoot, asset.input);

    if (!sourceDir) {
      logger.warn(`${asset.input} not found. Install the dependencies, then run this command again.`);
      continue;
    }

    for (const file of expandGlob(sourceDir, asset.glob)) {
      const destination = path.join(publicDir, normalizeInput(asset.output), file);
      const source = path.join(sourceDir, file);

      if (existsSync(destination) && (await sameContent(source, destination))) {
        upToDate++;
        continue;
      }

      await mkdir(path.dirname(destination), { recursive: true });
      await copyFile(source, destination);
      copied.push(file);
    }
  }

  const where = path.relative(context.cwd, publicDir).split(path.sep).join('/') || '.';

  if (copied.length) logger.info(`Copied ${copied.join(', ')} to ${where}/ so Vite serves them from the site root.`);
  else if (upToDate) logger.info(`${names} already in ${where}/.`);
}

async function sameContent(a: string, b: string): Promise<boolean> {
  const [left, right] = await Promise.all([readFile(a), readFile(b)]);
  return left.equals(right);
}

/** Vite's public directory for the project, or null when the config turns it off or points it somewhere unreadable. */
async function vitePublicDir(projectDir: string): Promise<string | null> {
  const config = findViteConfig(projectDir);
  const text = config ? await readFile(config, 'utf8') : '';

  if (/\bpublicDir\s*:\s*false\b/.test(text)) return null;

  const declared = /\bpublicDir\s*:\s*(['"`])([^'"`]+)\1/.exec(text)?.[2];
  if (declared) return path.resolve(projectDir, declared);

  // Anything else (`publicDir: someVariable`) is a decision this cannot read.
  if (/\bpublicDir\s*:/.test(text)) return null;

  return path.join(projectDir, 'public');
}

// ---------------------------------------------------------------------------------------------------------------
// Libraries: next steps for the consuming application
// ---------------------------------------------------------------------------------------------------------------

function printLibrarySteps(
  names: string,
  styles: readonly string[],
  printedStyles: readonly string[],
  assets: readonly Asset[],
  context: BuildSetupContext,
): void {
  const lines = [
    `${names} needs setup in the application that renders it: a library has no global stylesheet or build of its own.`,
  ];

  if (styles.length) {
    const imports = printedStyles.map(style => {
      // A file of the item is printed relative to the workspace; the app's stylesheet sits somewhere else, so the
      // path to write there is that one rewritten relative to it.
      const target = path.isAbsolute(style)
        ? `<path from the app's stylesheet to>/${path.relative(context.workspaceRoot, style).split(path.sep).join('/')}`
        : style;
      return `  @import '${target}';`;
    });

    lines.push(`1. In the application's global stylesheet, in this order and unlayered:\n${imports.join('\n')}`);
  }

  if (assets.length) {
    lines.push(
      `${styles.length ? '2' : '1'}. In the application's build target (angular.json, or project.json in Nx), ` +
        `under options:\n  "assets": [\n${assets.map(asset => `    ${JSON.stringify(asset)}`).join(',\n')}\n  ]\n` +
        '   In an Analog/Vite application, copy the files to its public directory instead.',
    );
  }

  logger.warn(lines.join('\n'));
}
