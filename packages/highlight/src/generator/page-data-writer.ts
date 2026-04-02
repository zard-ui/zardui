/**
 * Generates a single .ts data file per markdown doc page.
 * Each file exports named constants for individual code blocks and tab groups.
 * Tab groups (consecutive blocks with `tab` meta) become CodeTabData.
 * Individual blocks become CodeBlockData.
 */
import fs from 'fs-extra';
import path from 'path';

import { highlightCode } from './highlighter';
import { parseCodeFenceMeta, type CodeFenceMeta } from './meta-parser';
import type { CodeBlockData, CodeTabData, CodeTabItem } from '../types';

interface ParsedBlock {
  meta: CodeFenceMeta;
  code: string;
}

interface PageExport {
  name: string;
  type: 'block' | 'tabs';
  data: CodeBlockData | CodeTabData;
}

const DOCS_PATH = path.resolve('apps/web/public/documentation');
const OUTPUT_PATH = path.resolve('apps/web/src/generated/pages');

export async function generatePageDataFiles(): Promise<number> {
  let count = 0;

  const sections = fs.readdirSync(DOCS_PATH).filter(f => {
    const full = path.join(DOCS_PATH, f);
    return fs.statSync(full).isDirectory();
  });

  for (const section of sections) {
    const sectionDir = path.join(DOCS_PATH, section);
    const files = fs.readdirSync(sectionDir).filter(f => f.endsWith('.md'));

    const outputDir = path.join(OUTPUT_PATH, section);
    fs.ensureDirSync(outputDir);

    for (const file of files) {
      const filePath = path.join(sectionDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const exports = await processMarkdownPage(content, section, path.basename(file, '.md'));

      if (exports.length === 0) continue;

      const baseName = path.basename(file, '.md');
      const outputFile = path.join(outputDir, `${baseName}.ts`);
      fs.writeFileSync(outputFile, generatePageExportFile(exports));
      count++;
    }
  }

  return count;
}

async function processMarkdownPage(markdown: string, _section: string, _baseName: string): Promise<PageExport[]> {
  const lines = markdown.split('\n').map(l => l.replace(/\r$/, ''));
  const exports: PageExport[] = [];

  let blockIndex = 0;
  let pendingTabBlocks: ParsedBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('```') && line.trim() !== '```') {
      const meta = parseCodeFenceMeta(line);
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== '```') {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```

      const block: ParsedBlock = { meta, code: codeLines.join('\n') };

      if (meta.tab) {
        pendingTabBlocks.push(block);
      } else {
        // Flush any pending tabs first
        if (pendingTabBlocks.length > 0) {
          exports.push(await buildTabExport(pendingTabBlocks, blockIndex++));
          pendingTabBlocks = [];
        }
        exports.push(await buildBlockExport(block, blockIndex++));
      }
    } else {
      // Non-code line — flush pending tabs if we hit a gap
      if (pendingTabBlocks.length > 0 && line.trim() !== '') {
        exports.push(await buildTabExport(pendingTabBlocks, blockIndex++));
        pendingTabBlocks = [];
      }
      i++;
    }
  }

  // Flush remaining tabs
  if (pendingTabBlocks.length > 0) {
    exports.push(await buildTabExport(pendingTabBlocks, blockIndex++));
  }

  return exports;
}

async function buildTabExport(blocks: ParsedBlock[], index: number): Promise<PageExport> {
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
  return {
    name: `TABS_${index}`,
    type: 'tabs',
    data: { tabs },
  };
}

async function buildBlockExport(block: ParsedBlock, index: number): Promise<PageExport> {
  const html = await highlightCode(block.code, block.meta.language);
  return {
    name: `BLOCK_${index}`,
    type: 'block',
    data: {
      html,
      code: block.code,
      language: block.meta.language,
      title: block.meta.title,
      showLineNumbers: block.meta.showLineNumbers,
      copyButton: block.meta.copyButton,
      expandable: block.meta.expandable,
      expandableTitle: block.meta.expandableTitle,
    } as CodeBlockData,
  };
}

function generatePageExportFile(exports: PageExport[]): string {
  const hasBlocks = exports.some(e => e.type === 'block');
  const hasTabs = exports.some(e => e.type === 'tabs');

  const imports: string[] = [];
  if (hasBlocks) imports.push('CodeBlockData');
  if (hasTabs) imports.push('CodeTabData');

  let out = `import type { ${imports.join(', ')} } from '@highlight/types';\n\n`;

  for (const exp of exports) {
    const type = exp.type === 'tabs' ? 'CodeTabData' : 'CodeBlockData';
    out += `export const ${exp.name}: ${type} = ${JSON.stringify(exp.data, null, 2)};\n\n`;
  }

  return out;
}
