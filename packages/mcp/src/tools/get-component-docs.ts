import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { componentName, failure, unknownComponent } from './shared.js';
import { docsService } from '../services/docs.service.js';
import { text } from '../utils/result.js';

export function registerGetComponentDocs(server: McpServer): void {
  server.registerTool(
    'get-component-docs',
    {
      title: 'Get component docs',
      description:
        'Get the full documentation page of a Zard UI component as markdown: installation, usage, every example with its code, and the API reference (inputs, outputs, variants). ' +
        'Read this before writing template code that uses the component.',
      inputSchema: { name: componentName },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async ({ name }) => {
      try {
        const markdown = await docsService.getComponentMarkdown(name);
        // The markdown goes back raw, not wrapped in JSON: it already is the
        // format a model reads best, and escaping it into a string would only
        // get in the way.
        return markdown === null ? unknownComponent(name) : text(markdown);
      } catch (error) {
        return failure(error, `the docs for "${name}"`);
      }
    },
  );
}
