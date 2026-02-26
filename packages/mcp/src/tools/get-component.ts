import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { registryService } from '../services/registry.service.js';

export function registerGetComponent(server: McpServer): void {
  server.tool(
    'get-component',
    'Get the complete source code of a Zard UI component',
    { name: z.string().describe('Component name (e.g., "button", "card", "dialog")') },
    async ({ name }) => {
      const component = await registryService.getComponent(name);

      const output = {
        name: component.name,
        type: component.type,
        registryDependencies: component.registryDependencies ?? [],
        dependencies: component.dependencies ?? [],
        files: component.files.map(f => ({
          name: f.name,
          content: f.content,
        })),
      };

      return {
        content: [{ type: 'text' as const, text: JSON.stringify(output, null, 2) }],
      };
    },
  );
}
