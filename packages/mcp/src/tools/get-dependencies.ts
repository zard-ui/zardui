import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { componentName, failure, unknownComponent } from './shared.js';
import { registryService } from '../services/registry.service.js';
import type { RegistryItem } from '../types/registry.types.js';
import { json } from '../utils/result.js';

interface DependencyNode {
  name: string;
  dependencies: string[];
  registryDependencies: DependencyNode[];
}

function buildTree(name: string, byName: Map<string, RegistryItem>, visited: Set<string>): DependencyNode {
  const item = byName.get(name);
  if (!item || visited.has(name)) return { name, dependencies: [], registryDependencies: [] };
  visited.add(name);
  return {
    name,
    dependencies: item.dependencies ?? [],
    registryDependencies: (item.registryDependencies ?? []).map(dep => buildTree(dep, byName, visited)),
  };
}

/**
 * Every registry component the install brings, dependencies before dependents,
 * and the union of their npm packages. The tree shows why; this answers what —
 * which is usually the question.
 */
function flatten(name: string, byName: Map<string, RegistryItem>) {
  const order: string[] = [];
  const npm = new Set<string>();
  const seen = new Set<string>();
  const visit = (current: string) => {
    if (seen.has(current)) return;
    seen.add(current);
    const item = byName.get(current);
    for (const dep of item?.registryDependencies ?? []) visit(dep);
    for (const pkg of item?.dependencies ?? []) npm.add(pkg);
    order.push(current);
  };
  visit(name);
  return { installOrder: order, npmPackages: [...npm].sort() };
}

export function registerGetDependencies(server: McpServer): void {
  server.registerTool(
    'get-dependencies',
    {
      title: 'Get dependencies',
      description:
        'Resolve everything installing a Zard UI component brings: the other registry components (in install order) and the npm packages, plus the full tree.',
      inputSchema: { name: componentName },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async ({ name }) => {
      try {
        const items = await registryService.getItems();
        const byName = new Map(items.map(item => [item.name, item]));
        if (!byName.has(name)) return unknownComponent(name);
        return json({ ...flatten(name, byName), tree: buildTree(name, byName, new Set()) });
      } catch (error) {
        return failure(error, 'the registry');
      }
    },
  );
}
