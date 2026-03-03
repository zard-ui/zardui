import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { registryService } from '../services/registry.service.js';

export function registerGetComponentDocs(server: McpServer): void {
  server.tool(
    'get-component-docs',
    'Get the documentation (overview and API reference) for a Zard UI component',
    { name: z.string().describe('Component name (e.g., "button", "card", "dialog")') },
    async ({ name }) => {
      const component = await registryService.getComponent(name);

      if (!component.docs) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `No embedded docs found for "${name}". Visit https://zardui.com/docs/components/${name} for documentation.`,
            },
          ],
        };
      }

      const output = {
        name: component.name,
        overview: component.docs.overview,
        api: component.docs.api,
      };

      return {
        content: [{ type: 'text' as const, text: JSON.stringify(output, null, 2) }],
      };
    },
  );
}
