import { existsSync } from 'fs';
import * as path from 'path';

import { ComponentRegistry, getRegistryComponent } from '@cli/core/registry/index.js';
import { Config } from '@cli/utils/config.js';
import { logger } from '@cli/utils/logger.js';

export interface ResolvedDependencies {
  componentsToInstall: ComponentRegistry[];
  dependenciesToInstall: Set<string>;
}

export function resolveDependencies(
  selectedComponents: string[],
  resolvedConfig: Config & { resolvedPaths: any },
  cwd: string,
  options: { all?: boolean; path?: string },
): ResolvedDependencies {
  const registryComponents = selectedComponents.map((name: string) => getRegistryComponent(name)).filter(Boolean) as ComponentRegistry[];

  if (!registryComponents.length) {
    logger.error('Selected components not found in registry.');
    process.exit(1);
  }

  const dependenciesToInstall = new Set<string>();
  const componentsToInstall: ComponentRegistry[] = [];

  for (const component of registryComponents) {
    componentsToInstall.push(component);
    addComponentDependencies(component, dependenciesToInstall);

    if (component.registryDependencies && !options.all) {
      resolveRegistryDependencies(component, componentsToInstall, dependenciesToInstall, resolvedConfig, cwd, options);
    }
  }

  return {
    componentsToInstall,
    dependenciesToInstall,
  };
}

function addComponentDependencies(component: ComponentRegistry, dependenciesToInstall: Set<string>): void {
  component.dependencies?.forEach(dep => dependenciesToInstall.add(dep));
}

function resolveRegistryDependencies(
  component: ComponentRegistry,
  componentsToInstall: ComponentRegistry[],
  dependenciesToInstall: Set<string>,
  resolvedConfig: Config & { resolvedPaths: any },
  cwd: string,
  options: { path?: string },
): void {
  if (!component.registryDependencies) return;

  for (const dep of component.registryDependencies) {
    const depComponent = getRegistryComponent(dep);

    if (!depComponent) continue;
    if (componentsToInstall.find(c => c.name === dep)) continue;

    const depTargetDir = options.path ? path.resolve(cwd, options.path, dep) : path.resolve(resolvedConfig.resolvedPaths.components, dep);

    if (!existsSync(depTargetDir)) {
      componentsToInstall.push(depComponent);
      addComponentDependencies(depComponent, dependenciesToInstall);
    }
  }
}
