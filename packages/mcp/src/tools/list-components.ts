import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { registryService } from '../services/registry.service.js';

export function registerListComponents(server: McpServer): void {
  server.tool('list-components', 'List all available Zard UI components with metadata', {}, async () => {
    const items = await registryService.getItems();

    const components = items.map(item => ({
      name: item.name,
      type: item.type,
      filesCount: item.files.length,
      dependencies: item.dependencies ?? [],
      registryDependencies: item.registryDependencies ?? [],
    }));

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({ components, total: components.length }, null, 2),
        },
      ],
    };
  });
}
