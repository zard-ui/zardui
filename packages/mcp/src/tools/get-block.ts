import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { registryService } from '../services/registry.service.js';

export function registerGetBlock(server: McpServer): void {
  server.tool(
    'get-block',
    'Get the complete source code of a Zard UI block',
    { id: z.string().describe('Block ID (e.g., "authentication-01", "dashboard-01")') },
    async ({ id }) => {
      try {
        const block = await registryService.getBlock(id);

        return {
          content: [{ type: 'text' as const, text: JSON.stringify(block, null, 2) }],
        };
      } catch {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Block "${id}" not found. Use "list-blocks" to see available blocks.`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
