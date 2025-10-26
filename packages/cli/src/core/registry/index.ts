import { registry, type ComponentRegistry } from '@cli/core/registry/registry-data.js';

export type { ComponentRegistry };
export { registry };

export function getRegistryComponent(name: string): ComponentRegistry | undefined {
  return registry.find(component => component.name === name);
}

export function getAllComponentNames(): string[] {
  return registry.map(component => component.name);
}
