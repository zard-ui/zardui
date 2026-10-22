import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { docsService, headingsOf, sectionOf } from '../services/docs.service.js';
import { guidesAliasedAs, sectionAliasedAs } from '../utils/aliases.js';
import { didYouMean } from '../utils/fuzzy.js';
import { errorMessage, fail, json, text } from '../utils/result.js';

export function registerGetDocs(server: McpServer): void {
  server.registerTool(
    'get-docs',
    {
      title: 'Get guide',
      description:
        'Read a Zard UI guide as markdown: installation, theming (CSS variables, colors), dark mode, right-to-left (RTL) support, forms (signal, reactive, template-driven), components.json, CLI (create a project from a design preset, init, add, apply a preset) and utilities. ' +
        'Call without a topic to list the guides. For a single component, use get-component-docs instead.',
      inputSchema: {
        topic: z
          .string()
          .optional()
          .describe(
            'Guide slug from the list (e.g. "theming", "dark-mode", "rtl", "forms/signal-forms"). Omit to list them. ' +
              'Command names work too: "create" and "apply" return that command from the CLI guide.',
          ),
        section: z
          .string()
          .optional()
          .describe(
            'Only this section (level two or three) of the guide (e.g. "Validation", or "create" in "cli"). Long guides run to 15k tokens.',
          ),
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
        const requested = topic
          .trim()
          .toLowerCase()
          .replace(/^\/?(docs\/)?/, '')
          .replace(/\.md$/, '')
          .replace(/\s+/g, '-');
        // `arabic` or `right-to-left` find the RTL guide, as `toast` finds sonner.
        const slug = guides.has(requested)
          ? requested
          : (guidesAliasedAs(requested).find(candidate => guides.has(candidate)) ?? requested);
        const viaAlias = slug !== requested;
        const markdown = await docsService.getGuideMarkdown(slug);
        if (markdown === null) {
          const hint = didYouMean(slug, [...guides.keys()]) || ' Call get-docs without a topic to list the guides.';
          return fail(`No guide named "${topic}".${hint}`);
        }
        if (!section) {
          // `create` or `apply` asked as a topic is the command, not the whole CLI guide.
          const target = viaAlias ? sectionAliasedAs(slug, requested) : undefined;
          return text((target ? sectionOf(markdown, target) : null) ?? markdown);
        }
        const part = sectionOf(markdown, section) ?? sectionOf(markdown, sectionAliasedAs(slug, section) ?? section);
        if (part) return text(part);
        const headings = headingsOf(markdown);
        return fail(`No section "${section}" in "${slug}". Sections: ${headings.join(', ')}.`);
      } catch (error) {
        return fail(`Could not fetch the guide: ${errorMessage(error)}`);
      }
    },
  );
}
