import fs from 'fs-extra';
import path from 'path';

import { writeIfChanged } from './file-utils';
import { highlightCode } from './highlighter';
import { extractCodeBlocks } from './meta-parser';
import type { CodeBlockData, CodeTabData, CodeTabItem } from '../types';

const DOCS_PATH = path.resolve('apps/web/public/documentation');
const OUTPUT_PATH = path.resolve('apps/web/src/generated/documentation');

export async function generateDocsFiles(): Promise<number> {
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
      const content = fs.readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n');
      const blocks = extractCodeBlocks(content);

      if (blocks.length === 0) continue;

      const baseName = path.basename(file, '.md');
      const constName = toConstName(section, baseName);

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
        const outputFile = path.join(outputDir, `${baseName}.ts`);
        if (writeIfChanged(outputFile, generateTabExport(constName, data))) count++;
      } else if (blocks.length === 1) {
        const block = blocks[0];
        const html = await highlightCode(block.code, block.meta.language);
        const data: CodeBlockData = {
          html,
          code: block.code,
          language: block.meta.language,
          title: block.meta.title,
          showLineNumbers: block.meta.showLineNumbers,
          copyButton: block.meta.copyButton,
          expandable: block.meta.expandable,
          expandableTitle: block.meta.expandableTitle,
        };
        const outputFile = path.join(outputDir, `${baseName}.ts`);
        if (writeIfChanged(outputFile, generateCodeBlockExport(constName, data))) count++;
      } else {
        // Multiple non-tabbed blocks → export as array
        const dataBlocks: CodeBlockData[] = [];
        for (const block of blocks) {
          const html = await highlightCode(block.code, block.meta.language);
          dataBlocks.push({
            html,
            code: block.code,
            language: block.meta.language,
            title: block.meta.title,
            showLineNumbers: block.meta.showLineNumbers,
            copyButton: block.meta.copyButton,
            expandable: block.meta.expandable,
            expandableTitle: block.meta.expandableTitle,
          });
        }
        const outputFile = path.join(outputDir, `${baseName}.ts`);
        if (writeIfChanged(outputFile, generateCodeBlockArrayExport(constName, dataBlocks))) count++;
      }
    }
  }

  return count;
}

function toConstName(section: string, baseName: string): string {
  const s = section.toUpperCase().replace(/[^A-Z0-9]/g, '_');
  const b = baseName.toUpperCase().replace(/[^A-Z0-9]/g, '_');
  return `${s}_${b}`;
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
