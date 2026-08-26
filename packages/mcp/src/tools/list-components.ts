import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { registryService } from '../services/registry.service.js';
import type { RegistryItem } from '../types/registry.types.js';

/**
 * What the item actually is, since the registry calls everything
 * `registry:component`.
 *
 * Without this, an agent asks for `get-component typeset` expecting an Angular
 * component and gets a stylesheet — and `get-component-docs typeset` finds
 * nothing, because the typeset page does not live under `/docs/components`.
 * The label is what heads off both wrong questions; the same goes for `core`,
 * `utils` and `dark-mode`, which were never UI components either.
 *
 * The base path falls back to the name because the registry publishes `core`
 * without one — matching how `getTargetDir` reads the same item in the CLI.
 */
function kindOf(item: RegistryItem): 'component' | 'stylesheet' | 'utility' {
  const basePath = item.basePath ?? item.name;

  if (basePath === 'styles') return 'stylesheet';
  if (basePath === 'core' || basePath === 'services' || basePath === 'utils') return 'utility';
  return 'component';
}

/** Where the item's documentation is published, when there is one. */
function docsPathOf(item: RegistryItem): string | undefined {
  switch (kindOf(item)) {
    case 'component':
      return `/docs/components/${item.name}`;
    case 'stylesheet':
      return `/docs/${item.name}`;
    default:
      return undefined;
  }
}

export function registerListComponents(server: McpServer): void {
  server.tool(
    'list-components',
    'List everything the Zard UI registry publishes: UI components, plus the stylesheets and utilities that are installable but are not components. Read `kind` before asking for a component.',
    {},
    async () => {
      const items = await registryService.getItems();

      const components = items.map(item => ({
        name: item.name,
        type: item.type,
        kind: kindOf(item),
        docsPath: docsPathOf(item),
        filesCount: item.files.length,
        dependencies: item.dependencies ?? [],
        registryDependencies: item.registryDependencies ?? [],
      }));

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({ components, total: components.length }, null, 2),
          },
        ],
      };
    },
  );
}
