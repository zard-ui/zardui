/**
 * Generates named CodeBlockData consts from per-component `doc/snippets.md` files.
 * Each fenced block becomes a `CodeBlockData` keyed by its `id="..."` meta (falling back to
 * its index), exported as `<COMPONENT>_SNIPPET_<ID>`. Supports `{1,3-5}` line highlighting.
 * These power the optional `codeBefore` / `codeAfter` and code-only examples on the docs page.
 */
import fs from 'fs-extra';
import path from 'path';

import { writeIfChanged } from './file-utils';
import { highlightCode } from './highlighter';
import { extractCodeBlocks } from './meta-parser';
import type { CodeBlockData } from '../types';

const COMPONENTS_PATH = path.resolve('libs/zard/src/lib/shared/components');
const OUTPUT_PATH = path.resolve('apps/web/src/generated/components');
const SKIPPED_DIRS = ['styles', 'core'];

interface SnippetExport {
  constName: string;
  data: CodeBlockData;
}

export async function generateSnippetFiles(): Promise<number> {
  let count = 0;
  const componentDirs = fs.readdirSync(COMPONENTS_PATH);

  for (const componentName of componentDirs) {
    if (SKIPPED_DIRS.includes(componentName)) continue;

    const componentDir = path.join(COMPONENTS_PATH, componentName);
    if (!fs.statSync(componentDir).isDirectory()) continue;

    const snippetsFile = path.join(componentDir, 'doc', 'snippets.md');
    const outputFile = path.join(OUTPUT_PATH, componentName, 'snippets.ts');

    if (!fs.existsSync(snippetsFile)) {
      // Clean up stale output when the source has been removed.
      if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
      continue;
    }

    const content = fs.readFileSync(snippetsFile, 'utf-8').replace(/\r\n/g, '\n');
    const blocks = extractCodeBlocks(content);
    if (blocks.length === 0) {
      if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
      continue;
    }

    const exports: SnippetExport[] = [];
    let autoIndex = 0;

    for (const block of blocks) {
      const id = block.meta.id ?? `${autoIndex++}`;
      const html = await highlightCode(block.code, block.meta.language, block.meta.highlightLines);
      const data: CodeBlockData = {
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
      exports.push({ constName: toConstName(componentName, id), data });
    }

    fs.ensureDirSync(path.join(OUTPUT_PATH, componentName));
    if (writeIfChanged(outputFile, generateExportFile(exports))) count++;
  }

  return count;
}

function toConstName(componentName: string, id: string): string {
  const comp = componentName.toUpperCase().replace(/[^A-Z0-9]/g, '_');
  const key = id.toUpperCase().replace(/[^A-Z0-9]/g, '_');
  return `${comp}_SNIPPET_${key}`;
}

function generateExportFile(exports: SnippetExport[]): string {
  let out = `import type { CodeBlockData } from '@highlight/types';\n\n`;
  for (const exp of exports) {
    out += `export const ${exp.constName}: CodeBlockData = ${JSON.stringify(exp.data, null, 2)};\n\n`;
  }
  return out;
}
