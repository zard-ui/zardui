import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { registryService } from '../services/registry.service.js';

interface DependencyNode {
  name: string;
  dependencies: string[];
  registryDependencies: DependencyNode[];
}

async function buildDependencyTree(name: string, visited = new Set<string>()): Promise<DependencyNode> {
  if (visited.has(name)) {
    return { name, dependencies: [], registryDependencies: [] };
  }
  visited.add(name);

  const items = await registryService.getItems();
  const item = items.find(i => i.name === name);

  if (!item) {
    return { name, dependencies: [], registryDependencies: [] };
  }

  const children: DependencyNode[] = [];
  for (const dep of item.registryDependencies ?? []) {
    children.push(await buildDependencyTree(dep, visited));
  }

  return {
    name: item.name,
    dependencies: item.dependencies ?? [],
    registryDependencies: children,
  };
}

export function registerGetDependencies(server: McpServer): void {
  server.tool(
    'get-dependencies',
    'Get the full dependency tree for a Zard UI component (npm + internal registry dependencies)',
    { name: z.string().describe('Component name (e.g., "button", "card", "dialog")') },
    async ({ name }) => {
      const tree = await buildDependencyTree(name);

      return {
        content: [{ type: 'text' as const, text: JSON.stringify(tree, null, 2) }],
      };
    },
  );
}
