/**
 * What a full `apply` leaves behind: components still written in the previous look, and packages of
 * the previous fonts and icon family that nothing needs anymore.
 *
 * `apply` never rewrites a component (they may carry edits), so the honest ending is a list: which
 * installed components to add again with `--overwrite`, and which packages can go.
 */

import { getTargetDir, isItemInstalled } from '@cli/commands/add/dependency-resolver.js';
import { type Config, resolveConfigPaths } from '@cli/utils/config.js';
import { fetchBlocksIndex, fetchRegistryIndex, getRegistryUrl } from '@cli/utils/registry.js';
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import * as path from 'node:path';

type PackageManager = Config['packageManager'];

/** The component and block names of the project that came from the registry. Never throws. */
export async function installedItems(cwd: string, config: Config): Promise<string[]> {
  const resolved = await resolveConfigPaths(cwd, config);
  const registryUrl = getRegistryUrl(config);

  const components = await installedComponents(cwd, resolved, registryUrl);
  const blocks = await installedBlocks(resolved.resolvedPaths.blocks, registryUrl);

  return [...components, ...blocks];
}

async function installedComponents(
  cwd: string,
  config: Config & { resolvedPaths: any },
  registryUrl: string,
): Promise<string[]> {
  try {
    const index = await fetchRegistryIndex(registryUrl);

    return index.items
      .filter(item => !item.basePath && item.name !== 'core')
      .filter(item => isItemInstalled(getTargetDir({ name: item.name }, config, cwd), item.files))
      .map(item => item.name);
  } catch {
    // The registry is out of reach: the folders under the components directory are the best guess.
    return subdirectories(config.resolvedPaths.components);
  }
}

async function installedBlocks(blocksDir: string, registryUrl: string): Promise<string[]> {
  const present = await subdirectories(blocksDir);
  if (present.length === 0) return [];

  try {
    const index = await fetchBlocksIndex(registryUrl);
    const known = new Set(index.blocks.map(block => block.id));
    return present.filter(name => known.has(name));
  } catch {
    return [];
  }
}

async function subdirectories(dir: string): Promise<string[]> {
  if (!existsSync(dir)) return [];

  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();
}

/** The font packages a stylesheet imports: the `@fontsource` ones, which are the only kind the CLI writes. */
export function fontPackagesIn(css: string): string[] {
  const found = [...css.matchAll(/@import\s+['"](@fontsource[^'"]*)['"]/g)].map(match => match[1]!);
  return [...new Set(found)];
}

/** Drops the version from `name@^1`; the `@` that opens a scope is not a version. */
export function packageName(spec: string): string {
  const at = spec.lastIndexOf('@');
  return at > 0 ? spec.slice(0, at) : spec;
}

/**
 * The packages of the previous design that the new one does not use and that the project still
 * declares. A package the stylesheet still imports is kept off the list.
 */
export async function orphanedPackages(
  cwd: string,
  previous: readonly string[],
  next: readonly string[],
  stylesheet: string,
): Promise<string[]> {
  const wanted = new Set(next.map(packageName));
  const declared = await declaredPackages(cwd);

  return [...new Set(previous.map(packageName))].filter(
    name => !wanted.has(name) && declared.has(name) && !stylesheet.includes(`'${name}'`),
  );
}

async function declaredPackages(cwd: string): Promise<Set<string>> {
  try {
    const manifest = JSON.parse(await readFile(path.join(cwd, 'package.json'), 'utf8'));
    return new Set(Object.keys({ ...manifest.dependencies, ...manifest.devDependencies }));
  } catch {
    return new Set();
  }
}

/** How each package manager removes dependencies. */
export function removeCommand(manager: PackageManager, packages: readonly string[]): string {
  const verb = manager === 'npm' ? 'uninstall' : 'remove';
  return `${manager} ${verb} ${packages.join(' ')}`;
}
