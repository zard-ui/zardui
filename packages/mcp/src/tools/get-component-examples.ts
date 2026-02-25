import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { registryService } from '../services/registry.service.js';

export function registerGetComponentExamples(server: McpServer): void {
  server.tool(
    'get-component-examples',
    'Get usage examples and demo code for a Zard UI component',
    { name: z.string().describe('Component name (e.g., "button", "card", "dialog")') },
    async ({ name }) => {
      const component = await registryService.getComponent(name);

      if (!component.demos || component.demos.length === 0) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `No embedded examples found for "${name}". Visit https://zardui.com/docs/components/${name} for examples.`,
            },
          ],
        };
      }

      const output = {
        name: component.name,
        examples: component.demos.map(d => ({
          name: d.name,
          content: d.content,
        })),
        total: component.demos.length,
      };

      return {
        content: [{ type: 'text' as const, text: JSON.stringify(output, null, 2) }],
      };
    },
  );
}
