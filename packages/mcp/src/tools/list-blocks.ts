import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { registryService } from '../services/registry.service.js';
import { errorMessage, fail, json } from '../utils/result.js';

export function registerListBlocks(server: McpServer): void {
  server.registerTool(
    'list-blocks',
    {
      title: 'List blocks',
      description:
        'List Zard UI blocks: ready-made page sections (login, signup, dashboard, …) built from Zard UI components. Optionally filter by category.',
      inputSchema: {
        category: z.string().optional().describe('Only blocks in this category, case-insensitive (e.g. "Login")'),
      },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async ({ category }) => {
      try {
        const { blocks } = await registryService.getBlocksRegistry();
        const wanted = category?.toLowerCase();
        const filtered = wanted ? blocks.filter(block => block.category.toLowerCase() === wanted) : blocks;
        const categories = [...new Set(blocks.map(block => block.category))];
        return json({ total: filtered.length, categories, blocks: filtered });
      } catch (error) {
        return fail(
          `Could not fetch the blocks registry: ${errorMessage(error)}. Browse https://zardui.com/blocks instead.`,
        );
      }
    },
  );
}
