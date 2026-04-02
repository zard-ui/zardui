export interface CodeFenceMeta {
  language: string;
  title?: string;
  tab?: string;
  showLineNumbers: boolean;
  copyButton: boolean;
  expandable: boolean;
  expandableTitle?: string;
}

/**
 * Parses a markdown code fence opening line into structured metadata.
 *
 * Examples:
 *   ```angular-ts showLineNumbers copyButton
 *   ```bash tab="npm" copyButton
 *   ```typescript title="app.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
 */
export function parseCodeFenceMeta(fenceLine: string): CodeFenceMeta {
  const match = fenceLine.replace(/\r/g, '').match(/^```(\S+)?\s*(.*)?$/);
  if (!match) {
    return {
      language: 'text',
      showLineNumbers: false,
      copyButton: false,
      expandable: false,
    };
  }

  const language = match[1] ?? 'text';
  const metaStr = match[2] ?? '';

  return {
    language,
    title: extractQuotedAttr(metaStr, 'title'),
    tab: extractQuotedAttr(metaStr, 'tab'),
    showLineNumbers: metaStr.includes('showLineNumbers'),
    copyButton: metaStr.includes('copyButton'),
    expandable: metaStr.includes('expandable="true"'),
    expandableTitle: extractQuotedAttr(metaStr, 'expandableTitle'),
  };
}

function extractQuotedAttr(meta: string, attr: string): string | undefined {
  const regex = new RegExp(`${attr}="([^"]+)"`);
  const match = meta.match(regex);
  return match?.[1];
}

/**
 * Extracts code blocks from a markdown string.
 * Returns an array of { meta, code } pairs.
 */
export function extractCodeBlocks(markdown: string): Array<{ meta: CodeFenceMeta; code: string }> {
  const blocks: Array<{ meta: CodeFenceMeta; code: string }> = [];
  const lines = markdown.split('\n');

  let inBlock = false;
  let currentMeta: CodeFenceMeta | null = null;
  let currentCode: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.replace(/\r$/, '');
    if (!inBlock && line.startsWith('```') && line.trim() !== '```') {
      inBlock = true;
      currentMeta = parseCodeFenceMeta(line);
      currentCode = [];
    } else if (inBlock && line.trim() === '```') {
      if (currentMeta) {
        blocks.push({ meta: currentMeta, code: currentCode.join('\n') });
      }
      inBlock = false;
      currentMeta = null;
      currentCode = [];
    } else if (inBlock) {
      currentCode.push(line);
    }
  }

  return blocks;
}
