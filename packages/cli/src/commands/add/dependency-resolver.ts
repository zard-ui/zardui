import { existsSync } from 'fs';
import * as path from 'path';

import { iconPackagesFor } from '../../core/icons/index.js';
import { Config } from '../../utils/config.js';
import { iconCatalog } from '../../utils/icon-catalog.js';
import { logger } from '../../utils/logger.js';
import {
  fetchRegistryIndex,
  invalidateRegistryCache,
  type RegistryIcons,
  type RegistryIndex,
} from '../../utils/registry.js';

/*
 * Um item está instalado quando todos os arquivos que ele declara já existem.
 *
 * A pergunta antiga era "o diretório tem algum arquivo?", o que só funciona
 * para item que mora sozinho. O typeset é gravado junto do CSS global do
 * projeto, um diretório que nunca está vazio — ele seria pulado sempre. Pelo
 * caminho, item instalado pela metade passa a ser completado em vez de pulado.
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

  /*
   * Folha de estilo vai para junto do CSS global declarado em components.json,
   * e não para dentro de components/. É o que faz o `@import './typeset.css'`
   * que o setup injeta resolver sem caminho relativo frágil.
   */
  if (basePath === 'styles') {
    return path.dirname(resolvedConfig.resolvedPaths.tailwindCss);
  }

  return path.resolve(resolvedConfig.resolvedPaths.components, basePath);
}

export interface ComponentMeta {
  name: string;
  basePath?: string;
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
  if (!item) return undefined;

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
