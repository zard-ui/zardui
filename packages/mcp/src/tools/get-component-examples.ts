import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { componentName, failure, unknownComponent } from './shared.js';
import { docsService, sectionOf } from '../services/docs.service.js';
import { text } from '../utils/result.js';

export function registerGetComponentExamples(server: McpServer): void {
  server.registerTool(
    'get-component-examples',
    {
      title: 'Get component examples',
      description:
        'Get only the examples section of a Zard UI component page, each example with its full code. ' +
        'Cheaper than get-component-docs when you just need a pattern to copy.',
      inputSchema: { name: componentName },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async ({ name }) => {
      try {
        const markdown = await docsService.getComponentMarkdown(name);
        if (markdown === null) return unknownComponent(name);
        // The whole page would answer the question, but handing installation and
        // API back to someone who asked for examples spends the caller's context.
        // With no such section — a component without examples — the document is
        // the best answer there is.
        return text(sectionOf(markdown, 'Examples') ?? sectionOf(markdown, 'Usage') ?? markdown);
      } catch (error) {
        return failure(error, `the examples for "${name}"`);
      }
    },
  );
}
