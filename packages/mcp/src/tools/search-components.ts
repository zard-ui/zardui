import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { docsService, type CatalogEntry } from '../services/docs.service.js';
import { registryService } from '../services/registry.service.js';
import { ALIASES } from '../utils/aliases.js';
import { distance, suggest } from '../utils/fuzzy.js';
import { errorMessage, fail, json } from '../utils/result.js';

/**
 * How well one component answers the query. Name beats title beats aliases
 * beats description, and each word of the query counts on its own, so
 * "searchable select" and "select with search" both reach combobox.
 */
function score(query: string, name: string, entry: CatalogEntry | undefined): number {
  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/).filter(word => word.length > 1);
  const title = entry?.title.toLowerCase() ?? '';
  const description = entry?.description.toLowerCase() ?? '';
  const aliases = ALIASES[name] ?? [];

  let total = 0;
  if (name === q || title === q) total += 100;
  else if (name.includes(q) || title.includes(q)) total += 50;
  if (aliases.includes(q)) total += 60;
  if (entry?.category.toLowerCase() === q) total += 30;
  for (const word of words) {
    if (name.split('-').includes(word)) total += 20;
    if (aliases.some(alias => alias.split(' ').includes(word))) total += 12;
    if (new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(description)) total += 5;
  }
  // A typo in a single-word query ("tooltp") still lands.
  if (total === 0 && words.length === 1 && distance(q, name) <= Math.max(1, Math.floor(name.length / 4))) total += 15;
  return total;
}

export function registerSearchComponents(server: McpServer): void {
  server.registerTool(
    'search-components',
    {
      title: 'Search components',
      description:
        'Find Zard UI components by name, purpose or the name other libraries use ' +
        '(e.g. "modal", "toast", "autocomplete", "date input"). Returns the best matches first, with descriptions.',
      inputSchema: {
        query: z.string().min(1).describe('What you are looking for: a name, a purpose or a synonym'),
        limit: z.number().int().min(1).max(56).optional().describe('Maximum results (default 8)'),
      },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async ({ query, limit }) => {
      try {
        const [items, catalog] = await Promise.all([registryService.getItems(), docsService.getCatalog()]);
        const matches = items
          .map(item => ({
            item,
            entry: catalog.get(item.name),
            score: score(query, item.name, catalog.get(item.name)),
          }))
          .filter(match => match.score > 0)
          .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
          .slice(0, limit ?? 8)
          .map(({ item, entry }) => ({
            name: item.name,
            ...(entry && { description: entry.description, category: entry.category }),
            registryDependencies: item.registryDependencies ?? [],
          }));

        if (matches.length === 0) {
          const guesses = suggest(
            query,
            items.map(item => item.name),
          );
          return json({
            query,
            total: 0,
            matches: [],
            hint: guesses.length
              ? `Nothing matched. Closest names: ${guesses.join(', ')}.`
              : 'Nothing matched. Use list-components to see the whole catalog.',
          });
        }
        return json({ query, total: matches.length, matches });
      } catch (error) {
        return fail(`Could not reach the Zard UI registry: ${errorMessage(error)}`);
      }
    },
  );
}
