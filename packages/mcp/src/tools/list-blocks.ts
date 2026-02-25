import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { registryService } from '../services/registry.service.js';

export function registerListBlocks(server: McpServer): void {
  server.tool(
    'list-blocks',
    'List all available Zard UI blocks (pre-built component compositions and templates)',
    {},
    async () => {
      try {
        const blocksRegistry = await registryService.getBlocksRegistry();

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({ blocks: blocksRegistry.blocks, total: blocksRegistry.blocks.length }, null, 2),
            },
          ],
        };
      } catch {
        return {
          content: [
            {
              type: 'text' as const,
              text: 'Blocks registry is not yet available. Visit https://zardui.com/blocks to browse blocks.',
            },
          ],
        };
      }
    },
  );
}
