import { existsSync } from 'fs';
import * as path from 'path';

import { iconPackagesFor } from '../../core/icons/index.js';
import { Config } from '../../utils/config.js';
import { iconCatalog } from '../../utils/icon-catalog.js';
import { logger } from '../../utils/logger.js';
import {
  fetchBlocksIndex,
  fetchRegistryIndex,
  getAvailableBlocks,
  invalidateRegistryCache,
  type RegistryIcons,
  type RegistryIndex,
} from '../../utils/registry.js';

/*
 * An item is installed when every file it declares already exists.
 *
 * The old question was "does the directory hold any file?", which only works
 * for an item that lives alone. Typeset is written next to the project's
 * global stylesheet, a directory that is never empty — it would be skipped
 * every time. On the way, a half-installed item is now completed, not skipped.
 */
export function isItemInstalled(dir: string, files: readonly string[]): boolean {
  if (!existsSync(dir)) return false;
  if (!files.length) return false;

  return files.every(file => existsSync(path.join(dir, file)));
}

export function getTargetDir(
  component: ComponentMeta,
  resolvedConfig: Config & { resolvedPaths: any },
  cwd: string,
  customPath?: string,
): string {
  const basePath = component.basePath ?? component.name;

  /*
   * A stylesheet goes next to the global CSS declared in components.json, not
   * inside components/. That is what lets the `@import './typeset.css'` the
   * setup injects resolve without a brittle relative path.
   *
   * It comes before `customPath` on purpose: --path moves components, and a
   * stylesheet that moved with them would be imported from a directory it does
   * not sit in — the install would report success and style nothing.
   */
  if (basePath === 'styles') {
    return path.dirname(resolvedConfig.resolvedPaths.tailwindCss);
  }

  /*
   * A block is a folder, not a file: it brings up to 22 sources that only make
   * sense together, so each one gets a directory of its own under the blocks
   * alias — or under `--path`, for the same reason components honour it.
   *
   * Before the generic `--path` branch: that one appends the basePath, which
   * would drop every block into a shared `<path>/blocks` and mix their files.
   */
  if (basePath === 'blocks') {
    const root = customPath ? path.resolve(cwd, customPath) : resolvedConfig.resolvedPaths.blocks;
    return path.join(root, component.name);
  }

  if (customPath) {
    return path.resolve(cwd, customPath, basePath);
  }

  if (basePath === 'core' || component.name === 'core') {
    return resolvedConfig.resolvedPaths.core;
  }

  if (basePath === 'services') {
    return resolvedConfig.resolvedPaths.services;
  }

  if (basePath === 'utils') {
    return resolvedConfig.resolvedPaths.utils;
  }

  return path.resolve(resolvedConfig.resolvedPaths.components, basePath);
}

export interface ComponentMeta {
  name: string;
  basePath?: string;
  /** Blocks are fetched from `/blocks/` and written one directory per block. */
  isBlock?: boolean;
  files?: string[];
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  icons?: RegistryIcons;
}

export interface ResolvedDependencies {
  componentsToInstall: ComponentMeta[];
  dependenciesToInstall: Set<string>;
}

export async function getRegistryIndex(forceRefresh = false): Promise<RegistryIndex> {
  if (forceRefresh) {
    invalidateRegistryCache();
  }
  return fetchRegistryIndex();
}

export async function getComponentMeta(name: string): Promise<ComponentMeta | undefined> {
  const index = await getRegistryIndex();
  const item = index.items.find(i => i.name === name);

  // Blocks live in a separate index, and a block id never collides with a
  // component name — so the component registry answers first and blocks fill in.
  if (!item) return getBlockMeta(name);

  return {
    name: item.name,
    basePath: item.basePath,
    files: item.files,
    dependencies: item.dependencies,
    devDependencies: item.devDependencies,
    registryDependencies: item.registryDependencies,
    icons: item.icons,
  };
}

/** The block behind an id, as a `ComponentMeta` the installer can carry. */
async function getBlockMeta(name: string): Promise<ComponentMeta | undefined> {
  const blocks = await fetchBlocksIndex();
  const block = blocks.blocks.find(entry => entry.id === name);
  if (!block) return undefined;

  return {
    name: block.id,
    basePath: 'blocks',
    isBlock: true,
    // The index does not list a block's files, so `isItemInstalled` cannot tell
    // whether it is already there. Re-adding a block rewrites it, which is the
    // safe end of that trade.
    dependencies: block.dependencies,
    registryDependencies: block.registryDependencies,
  };
}

export async function getAllComponentNames(): Promise<string[]> {
  const index = await getRegistryIndex();
  return index.items.map(item => item.name);
}

/** Everything `add` accepts by name: components first, then blocks. */
export async function getAllInstallableNames(): Promise<string[]> {
  const [components, blocks] = await Promise.all([getAllComponentNames(), getAvailableBlocks()]);
  return [...components, ...blocks];
}

export async function resolveDependencies(
  selectedComponents: string[],
  resolvedConfig: Config & { resolvedPaths: any },
  cwd: string,
  options: { all?: boolean; path?: string; overwrite?: boolean },
): Promise<ResolvedDependencies> {
  const componentMetas: ComponentMeta[] = [];

  for (const name of selectedComponents) {
    const meta = await getComponentMeta(name);
    if (meta) {
      componentMetas.push(meta);
    }
  }

  if (!componentMetas.length) {
    logger.error('Selected components not found in registry.');
    process.exit(1);
  }

  const dependenciesToInstall = new Set<string>();
  const componentsToInstall: ComponentMeta[] = [];

  for (const component of componentMetas) {
    const targetDir = getTargetDir(component, resolvedConfig, cwd, options.path);

    if (isItemInstalled(targetDir, component.files ?? []) && !options.overwrite) {
      continue;
    }

    componentsToInstall.push(component);
    addComponentDependencies(component, dependenciesToInstall, resolvedConfig.icons);

    if (component.registryDependencies && !options.all) {
      await resolveRegistryDependencies(
        component,
        componentsToInstall,
        dependenciesToInstall,
        resolvedConfig,
        cwd,
        options,
      );
    }
  }

  return {
    componentsToInstall,
    dependenciesToInstall,
  };
}

/**
 * The npm dependencies the component requires.
 *
 * Beyond the declared ones, anything that draws icons needs ng-icons and the
 * package of the configured family. That does not come from the registry: the
 * registry publishes WHICH icons a component uses, and which family they come
 * from is the installing project's decision. Installing inside `add` also
 * covers anyone who switched family after init.
 */
function addComponentDependencies(
  component: ComponentMeta,
  dependenciesToInstall: Set<string>,
  iconFamily: Config['icons'],
): void {
  component.dependencies?.forEach(dep => dependenciesToInstall.add(dep));

  if (component.icons?.symbols?.length) {
    iconPackagesFor(iconFamily, iconCatalog()).forEach(pkg => dependenciesToInstall.add(pkg));
  }
}

async function resolveRegistryDependencies(
  component: ComponentMeta,
  componentsToInstall: ComponentMeta[],
  dependenciesToInstall: Set<string>,
  resolvedConfig: Config & { resolvedPaths: any },
  cwd: string,
  options: { path?: string; overwrite?: boolean },
): Promise<void> {
  if (!component.registryDependencies) return;

  for (const dep of component.registryDependencies) {
    const depComponent = await getComponentMeta(dep);

    if (!depComponent) {
      logger.warn(
        `"${component.name}" depends on "${dep}", which the registry does not publish. ` +
          'The component may not compile — please report it.',
      );
      continue;
    }
    if (componentsToInstall.find(c => c.name === dep)) continue;

    const depTargetDir = getTargetDir(depComponent, resolvedConfig, cwd, options.path);

    if (!isItemInstalled(depTargetDir, depComponent.files ?? []) || options.overwrite) {
      componentsToInstall.push(depComponent);
      addComponentDependencies(depComponent, dependenciesToInstall, resolvedConfig.icons);

      if (depComponent.registryDependencies) {
        await resolveRegistryDependencies(
          depComponent,
          componentsToInstall,
          dependenciesToInstall,
          resolvedConfig,
          cwd,
          options,
        );
      }
    }
  }
}
