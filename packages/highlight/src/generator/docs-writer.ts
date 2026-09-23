import fs from 'fs-extra';
import path from 'path';

import { writeIfChanged } from './file-utils';
import { highlightCode } from './highlighter';
import { extractCodeBlocks } from './meta-parser';
import type { CodeBlockData, CodeTabData, CodeTabItem } from '../types';

const DOCS_PATH = path.resolve('apps/web/public/documentation');
const OUTPUT_PATH = path.resolve('apps/web/src/generated/documentation');

/**
 * Every `.md` under the documentation root, at any depth.
 *
 * The scan used to be one level deep, which left the installation guides out —
 * they are organised by environment and by mode (`setup/nx/manual/…`) — so they
 * had to be fetched over HTTP at runtime, with a spinner before every code block.
 */
function markdownFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) return markdownFiles(full);
    return entry.name.endsWith('.md') ? [full] : [];
  });
}

export async function generateDocsFiles(): Promise<number> {
  let count = 0;

  for (const filePath of markdownFiles(DOCS_PATH)) {
    const relative = path.relative(DOCS_PATH, filePath).split(path.sep).join('/');
    const content = fs.readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n');
    const blocks = extractCodeBlocks(content);

    if (blocks.length === 0) continue;

    const outputDir = path.join(OUTPUT_PATH, path.dirname(relative));
    fs.ensureDirSync(outputDir);

    const baseName = path.basename(filePath, '.md');
    const constName = toConstName(relative);
    const outputFile = path.join(outputDir, `${baseName}.ts`);

    // Check if this is a tabbed file (multiple blocks with tab meta)
    const hasTabs = blocks.some(b => b.meta.tab);

    if (hasTabs) {
      const tabs: CodeTabItem[] = [];
      for (const block of blocks) {
        const html = await highlightCode(block.code, block.meta.language);
        tabs.push({
          label: block.meta.tab ?? block.meta.language,
          html,
          code: block.code,
          language: block.meta.language,
        });
      }
      const data: CodeTabData = { tabs };
      if (writeIfChanged(outputFile, generateTabExport(constName, data))) count++;
    } else if (blocks.length === 1) {
      const block = blocks[0];
      const html = await highlightCode(block.code, block.meta.language, block.meta.highlightLines);
      if (writeIfChanged(outputFile, generateCodeBlockExport(constName, toCodeBlock(block, html)))) count++;
    } else {
      // Multiple non-tabbed blocks → export as array
      const dataBlocks: CodeBlockData[] = [];
      for (const block of blocks) {
        const html = await highlightCode(block.code, block.meta.language, block.meta.highlightLines);
        dataBlocks.push(toCodeBlock(block, html));
      }
      if (writeIfChanged(outputFile, generateCodeBlockArrayExport(constName, dataBlocks))) count++;
    }
  }

  return count;
}

function toCodeBlock(
  block: { meta: ReturnType<typeof extractCodeBlocks>[number]['meta']; code: string },
  html: string,
): CodeBlockData {
  return {
    html,
    code: block.code,
    language: block.meta.language,
    title: block.meta.title,
    showLineNumbers: block.meta.showLineNumbers,
    copyButton: block.meta.copyButton,
    expandable: block.meta.expandable,
    expandableTitle: block.meta.expandableTitle,
    highlightLines: block.meta.highlightLines,
  };
}

/**
 * The exported constant's name, derived from the file path.
 *
 * `cli/installation.md` still becomes `CLI_INSTALLATION`; deeper paths simply add
 * segments, so `setup/nx/manual/tsconfig.md` becomes `SETUP_NX_MANUAL_TSCONFIG`.
 */
function toConstName(relativePath: string): string {
  return relativePath
    .replace(/\.md$/, '')
    .split('/')
    .map(segment => segment.toUpperCase().replace(/[^A-Z0-9]/g, '_'))
    .join('_');
}

function generateTabExport(constName: string, data: CodeTabData): string {
  return `import type { CodeTabData } from '@highlight/types';

export const ${constName}: CodeTabData = ${JSON.stringify(data, null, 2)};
`;
}

function generateCodeBlockExport(constName: string, data: CodeBlockData): string {
  return `import type { CodeBlockData } from '@highlight/types';

export const ${constName}: CodeBlockData = ${JSON.stringify(data, null, 2)};
`;
}

function generateCodeBlockArrayExport(constName: string, data: CodeBlockData[]): string {
  return `import type { CodeBlockData } from '@highlight/types';

export const ${constName}: CodeBlockData[] = ${JSON.stringify(data, null, 2)};
`;
}
