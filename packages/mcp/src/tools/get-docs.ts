import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { docsService, sectionOf } from '../services/docs.service.js';
import { didYouMean } from '../utils/fuzzy.js';
import { errorMessage, fail, json, text } from '../utils/result.js';

export function registerGetDocs(server: McpServer): void {
  server.registerTool(
    'get-docs',
    {
      title: 'Get guide',
      description:
        'Read a Zard UI guide as markdown: installation, theming (CSS variables, colors), dark mode, forms (signal, reactive, template-driven), components.json, CLI and utilities. ' +
        'Call without a topic to list the guides. For a single component, use get-component-docs instead.',
      inputSchema: {
        topic: z
          .string()
          .optional()
          .describe('Guide slug from the list (e.g. "theming", "dark-mode", "forms/signal-forms"). Omit to list them.'),
        section: z
          .string()
          .optional()
          .describe('Only this level-two section of the guide (e.g. "Validation"). Long guides run to 15k tokens.'),
      },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async ({ topic, section }) => {
      try {
        const guides = await docsService.getGuides();
        if (!topic) {
          return json({
            total: guides.size,
            guides: [...guides].map(([slug, entry]) => ({ topic: slug, ...entry })),
          });
        }
        const slug = topic
          .trim()
          .toLowerCase()
          .replace(/^\/?(docs\/)?/, '')
          .replace(/\.md$/, '')
          .replace(/\s+/g, '-');
        const markdown = await docsService.getGuideMarkdown(slug);
        if (markdown === null) {
          const hint = didYouMean(slug, [...guides.keys()]) || ' Call get-docs without a topic to list the guides.';
          return fail(`No guide named "${topic}".${hint}`);
        }
        if (!section) return text(markdown);
        const part = sectionOf(markdown, section);
        if (part) return text(part);
        const headings = markdown
          .split('\n')
          .filter(line => line.startsWith('## '))
          .map(line => line.slice(3).trim());
        return fail(`No section "${section}" in "${slug}". Sections: ${headings.join(', ')}.`);
      } catch (error) {
        return fail(`Could not fetch the guide: ${errorMessage(error)}`);
      }
    },
  );
}
