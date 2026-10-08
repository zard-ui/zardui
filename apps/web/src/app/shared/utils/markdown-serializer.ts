import type { CodeBlockData } from '@highlight/types';

import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';
import type { ComponentData, CodeSnippet, ExampleData } from '@doc/shared/constants/components.constant';

const BASE_URL = 'https://zardui.com';

/** `date-picker` -> `Date Picker` */
function titleCase(value: string): string {
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function frontmatter(title: string, description: string): string {
  // Escape only what breaks single-line YAML values.
  const safe = (value: string) => value.replace(/\r?\n/g, ' ').trim();
  return `---\ntitle: ${safe(title)}\ndescription: ${safe(description)}\n---`;
}

function fence(code: string | undefined, language: string | undefined): string {
  if (!code?.trim()) return '';
  return `\`\`\`${language ?? ''}\n${code.replace(/\s+$/, '')}\n\`\`\``;
}

function codeBlock(block: CodeBlockData | undefined): string {
  return block?.code ? fence(block.code, block.language) : '';
}

/** Markdown-table cells must not contain raw pipes or newlines. */
function cell(value: string | undefined): string {
  return (value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ').trim();
}

function code(value: string | undefined): string {
  const text = cell(value);
  return text ? `\`${text}\`` : '';
}

function snippet(entry: CodeSnippet | CodeSnippet[] | undefined): string {
  if (!entry) return '';
  const items = Array.isArray(entry) ? entry : [entry];
  return items
    .map(item => {
      const parts: string[] = [];
      if (item.title) parts.push(`**${item.title}**`);
      if (item.description) parts.push(item.description);
      const block = codeBlock(item.codeData);
      if (block) parts.push(block);
      return parts.join('\n\n');
    })
    .filter(Boolean)
    .join('\n\n');
}

function serializeExamples(examples: ExampleData[] | undefined): string {
  if (!examples?.length) return '';

  return examples
    .map(example => {
      const parts: string[] = [`### ${titleCase(example.name)}`];
      if (example.description) parts.push(example.description);

      const before = snippet(example.codeBefore);
      if (before) parts.push(before);

      const main = codeBlock(example.codeData);
      if (main) parts.push(main);

      const after = snippet(example.codeAfter);
      if (after) parts.push(after);

      return parts.join('\n\n');
    })
    .join('\n\n');
}

function serializeApi(sections: ApiSection[] | undefined): string {
  if (!sections?.length) return '';

  return sections
    .map(section => {
      const parts: string[] = [`### ${section.selector}`];
      if (section.description) parts.push(section.description);

      if (section.props?.length) {
        const rows = section.props.map(
          prop => `| ${code(prop.name)} | ${cell(prop.description)} | ${code(prop.type)} | ${code(prop.default)} |`,
        );
        parts.push(['| Prop | Description | Type | Default |', '| --- | --- | --- | --- |', ...rows].join('\n'));
      }

      if (section.outputs?.length) {
        const rows = section.outputs.map(
          output =>
            `| ${code(output.name)} | ${cell(output.description)} | ${code(output.type)} | ${code(output.default)} |`,
        );

        parts.push(['| Output | Description | Type | Default |', '| --- | --- | --- | --- |', ...rows].join('\n'));
      }

      return parts.join('\n\n');
    })
    .join('\n\n');
}

function serializeInstallation(data: ComponentData): string {
  const parts: string[] = [];

  const cli = data.installData?.cliAdd?.tabs?.[0];
  if (cli?.code) {
    parts.push('### CLI', fence(cli.code, cli.language));
  }

  const manual = (data.installData?.manualCode ?? []).map(codeBlock).filter(Boolean);
  if (manual.length) {
    parts.push('### Manual', ...manual);
  }

  const register = codeBlock(data.installData?.register);
  if (register) {
    parts.push('### Register', register);
  }

  return parts.join('\n\n');
}

function serializeUsage(data: ComponentData): string {
  return [codeBlock(data.usage?.importBlock), codeBlock(data.usage?.codeBlock)].filter(Boolean).join('\n\n');
}

/** Wraps a heading + body only when the body is non-empty, so we never emit empty sections. */
function section(heading: string, body: string): string {
  return body ? `## ${heading}\n\n${body}` : '';
}

/**
 * Builds the full Markdown document for a component docs page straight from its
 * structured {@link ComponentData}. Mirrors the shadcn/ui `<page>.md` shape
 * (frontmatter + Installation / Usage / Examples / API Reference).
 */
export function serializeComponentToMarkdown(data: ComponentData): string {
  const title = titleCase(data.componentName);

  const blocks: string[] = [
    frontmatter(title, data.description),
    `# ${title}\n\n${data.description}`,
    data.about?.description ? section('About', serializeAbout(data)) : '',
    section('Installation', serializeInstallation(data)),
    section('Usage', serializeUsage(data)),
    section('Composition', codeBlock(data.composition)),
    section('Examples', serializeExamples(data.examples)),
    section('API Reference', serializeApi(data.api)),
    `---\n\n[Open in browser](${BASE_URL}/docs/components/${data.componentName})`,
  ];

  return `${blocks.filter(Boolean).join('\n\n')}\n`;
}

function serializeAbout(data: ComponentData): string {
  const about = data.about;
  if (!about) return '';
  const parts: string[] = [about.description];
  if (about.link) parts.push(`[${about.link.label}](${about.link.href})`);
  return parts.join('\n\n');
}

/**
 * Minimal document used when full component data cannot be loaded, or for
 * static docs pages that don't yet ship a hand-authored `.md`. Keeps the
 * "Copy Page" action working everywhere while richer content lands incrementally.
 */
export function serializeFallbackMarkdown(title: string, description: string, path: string): string {
  const heading = title.trim() || 'ZardUI';
  const body = description?.trim() || 'Documentation and guides for ZardUI.';
  return `${frontmatter(heading, body)}\n\n# ${heading}\n\n${body}\n\n[Open in browser](${BASE_URL}${path})\n`;
}
