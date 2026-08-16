import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { docsService } from '../services/docs.service.js';

export function registerGetComponentDocs(server: McpServer): void {
  server.tool(
    'get-component-docs',
    'Get the full documentation page for a Zard UI component: installation, usage, examples and API reference',
    { name: z.string().describe('Component name (e.g., "button", "card", "dialog")') },
    async ({ name }) => {
      const markdown = await docsService.getComponentMarkdown(name);

      if (markdown === null) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `No documentation page for "${name}". Check the component name with list-components.`,
            },
          ],
        };
      }

      // The markdown goes back raw, not wrapped in JSON: it already is the
      // format a model reads best, and escaping it into a string would only
      // get in the way.
      return { content: [{ type: 'text' as const, text: markdown }] };
    },
  );
}
