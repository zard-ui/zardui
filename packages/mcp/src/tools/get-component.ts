import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { componentName, failure, unknownComponent } from './shared.js';
import { registryService } from '../services/registry.service.js';
import { isNotFound } from '../utils/http.js';
import { json } from '../utils/result.js';

export function registerGetComponent(server: McpServer): void {
  server.registerTool(
    'get-component',
    {
      title: 'Get component source',
      description:
        'Get the source files of a Zard UI component exactly as the CLI would install them, plus its npm and registry dependencies and the icons it uses. ' +
        'To add it to a project, prefer install-component; to learn how to use it, prefer get-component-docs.',
      inputSchema: { name: componentName },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async ({ name }) => {
      try {
        const component = await registryService.getComponent(name);
        return json({
          name: component.name,
          type: component.type,
          registryDependencies: component.registryDependencies ?? [],
          dependencies: component.dependencies ?? [],
          // Whoever generates code from this needs to know which icons the
          // component registers, and which set they come from.
          icons: component.icons ?? null,
          files: component.files.map(f => ({ name: f.name, content: f.content })),
        });
      } catch (error) {
        return isNotFound(error) ? unknownComponent(name) : failure(error, `component "${name}"`);
      }
    },
  );
}
