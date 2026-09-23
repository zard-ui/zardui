import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { docsService } from '../services/docs.service.js';
import { registryService } from '../services/registry.service.js';
import { errorMessage, fail, json } from '../utils/result.js';

export function registerListComponents(server: McpServer): void {
  server.registerTool(
    'list-components',
    {
      title: 'List components',
      description:
        'List every Zard UI component with a one-line description and category. ' +
        'Prefer search-components when you already know roughly what you need: it returns the same fields for fewer tokens.',
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async () => {
      try {
        const [items, catalog] = await Promise.all([registryService.getItems(), docsService.getCatalog()]);
        const components = items.map(item => {
          const entry = catalog.get(item.name);
          return {
            name: item.name,
            ...(entry && { description: entry.description, category: entry.category }),
            registryDependencies: item.registryDependencies ?? [],
          };
        });
        return json({ total: components.length, components });
      } catch (error) {
        return fail(`Could not reach the Zard UI registry: ${errorMessage(error)}`);
      }
    },
  );
}
