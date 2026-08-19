import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { registryService } from '../services/registry.service.js';
import type { RegistryItem } from '../types/registry.types.js';

/**
 * O que o item é de fato, já que o registry chama todos de `registry:component`.
 *
 * Sem isto, um agente pede `get-component typeset` esperando um componente
 * Angular e recebe uma folha de estilo — e `get-component-docs typeset` não
 * acha nada, porque a página do typeset não mora sob `/docs/components`. O
 * rótulo é o que evita as duas perguntas erradas; o mesmo vale para `core`,
 * `utils` e `dark-mode`, que também nunca foram componentes de UI.
 */
function kindOf(item: RegistryItem): 'component' | 'stylesheet' | 'utility' {
  if (item.basePath === 'styles') return 'stylesheet';
  if (item.basePath === 'core' || item.basePath === 'services' || item.basePath === 'utils') return 'utility';
  return 'component';
}

/** Onde a documentação do item é publicada, quando existe uma. */
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
