import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { docsService, sectionOf } from '../services/docs.service.js';

export function registerGetComponentExamples(server: McpServer): void {
  server.tool(
    'get-component-examples',
    'Get the usage examples of a Zard UI component, with the code of each one',
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

      // A página inteira responderia à pergunta, mas devolver instalação e API a
      // quem pediu exemplos gasta contexto de quem chamou. Sem a seção — um
      // componente sem exemplos —, o documento é a melhor resposta que existe.
      const examples = sectionOf(markdown, 'Examples') ?? sectionOf(markdown, 'Usage') ?? markdown;

      return { content: [{ type: 'text' as const, text: examples }] };
    },
  );
}
