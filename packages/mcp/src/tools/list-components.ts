import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { docsService } from '../services/docs.service.js';
import { registryService } from '../services/registry.service.js';
import type { RegistryItem } from '../types/registry.types.js';
import { errorMessage, fail, json } from '../utils/result.js';

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
  server.registerTool(
    'list-components',
    {
      title: 'List components',
      description:
        'List everything the Zard UI registry publishes, with a one-line description and category: UI components, ' +
        'plus the stylesheets and utilities that are installable but are not components. Read `kind` before asking ' +
        'for a component. Prefer search-components when you already know roughly what you need.',
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async () => {
      try {
        const [items, catalog] = await Promise.all([registryService.getItems(), docsService.getCatalog()]);
        const components = items.map(item => {
          const entry = catalog.get(item.name);
          return {
            name: item.name,
            kind: kindOf(item),
            docsPath: docsPathOf(item),
            ...(entry && { description: entry.description, category: entry.category }),
            registryDependencies: item.registryDependencies ?? [],
          };
        });
        return json({ total: components.length, components });
      } catch (error) {
        return fail(`Could not reach the Zard UI registry: ${errorMessage(error)}`);
      }
    },
  );
}
