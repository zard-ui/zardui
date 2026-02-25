import { existsSync, readdirSync } from 'fs';
import * as path from 'path';

import { Config } from '../../utils/config.js';
import { logger } from '../../utils/logger.js';
import { fetchRegistryIndex, invalidateRegistryCache, type RegistryIndex } from '../../utils/registry.js';

function isComponentInstalled(dir: string): boolean {
  if (!existsSync(dir)) return false;

  try {
    const files = readdirSync(dir);
    return files.length > 0;
  } catch {
    return false;
  }
}

export function getTargetDir(
  component: ComponentMeta,
  resolvedConfig: Config & { resolvedPaths: any },
  cwd: string,
  customPath?: string,
): string {
  const basePath = component.basePath ?? component.name;

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
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
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
  if (!item) return undefined;

  return {
    name: item.name,
    basePath: item.basePath,
    dependencies: item.dependencies,
    devDependencies: item.devDependencies,
    registryDependencies: item.registryDependencies,
  };
}

export async function getAllComponentNames(): Promise<string[]> {
  const index = await getRegistryIndex();
  return index.items.map(item => item.name);
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

    if (isComponentInstalled(targetDir) && !options.overwrite) {
      continue;
    }

    componentsToInstall.push(component);
    addComponentDependencies(component, dependenciesToInstall);

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

function addComponentDependencies(component: ComponentMeta, dependenciesToInstall: Set<string>): void {
  component.dependencies?.forEach(dep => dependenciesToInstall.add(dep));
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

    if (!depComponent) continue;
    if (componentsToInstall.find(c => c.name === dep)) continue;

    const depTargetDir = getTargetDir(depComponent, resolvedConfig, cwd, options.path);

    if (!isComponentInstalled(depTargetDir) || options.overwrite) {
      componentsToInstall.push(depComponent);
      addComponentDependencies(depComponent, dependenciesToInstall);

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
