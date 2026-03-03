import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { registryService } from '../services/registry.service.js';

export function registerSearchComponents(server: McpServer): void {
  server.tool(
    'search-components',
    'Search for Zard UI components by name using fuzzy matching',
    { query: z.string().describe('Search query to match against component names') },
    async ({ query }) => {
      const items = await registryService.getItems();
      const lowerQuery = query.toLowerCase();

      const matches = items
        .filter(item => item.name.toLowerCase().includes(lowerQuery))
        .map(item => ({
          name: item.name,
          type: item.type,
          filesCount: item.files.length,
          registryDependencies: item.registryDependencies ?? [],
        }));

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({ matches, total: matches.length, query }, null, 2),
          },
        ],
      };
    },
  );
}
