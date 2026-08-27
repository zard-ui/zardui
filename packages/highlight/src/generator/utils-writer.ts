/**
 * Highlights the live demos of the `/docs/utils/*` pages, from TypeScript sources.
 * The utilities are pure CSS, so a page's only moving part is its demos — the prose
 * snippets come from Markdown through `page-data-writer`, not from here.
 *
 * Demos — one live component per example:
 *   apps/web/src/app/domain/pages/utils/demos/<utility>/<name>.ts
 *     -> apps/web/src/generated/utils/<utility>/<name>.ts
 *        export const UTILS_<UTILITY>_<NAME>: CodeBlockData
 */
import fs from 'fs-extra';
import path from 'path';

import { writeIfChanged } from './file-utils';
import { highlightCode } from './highlighter';
import type { CodeBlockData } from '../types';

const UTILS_PATH = path.resolve('apps/web/src/app/domain/pages/utils');
const DEMOS_PATH = path.join(UTILS_PATH, 'demos');
const OUTPUT_PATH = path.resolve('apps/web/src/generated/utils');

export async function generateUtilsDemoFiles(): Promise<number> {
  if (!fs.existsSync(DEMOS_PATH)) return 0;

  let count = 0;
  const utilities = fs.readdirSync(DEMOS_PATH).filter(entry => fs.statSync(path.join(DEMOS_PATH, entry)).isDirectory());

  for (const utility of utilities) {
    const utilityDir = path.join(DEMOS_PATH, utility);
    const outputDir = path.join(OUTPUT_PATH, utility);
    fs.ensureDirSync(outputDir);

    const writtenNames = new Set<string>();

    for (const file of fs.readdirSync(utilityDir)) {
      if (path.extname(file) !== '.ts') continue;

      const outputFile = path.join(outputDir, file);
      const content = await buildExport(utility, path.join(utilityDir, file), path.basename(file, '.ts'));

      if (writeIfChanged(outputFile, content)) count++;
      writtenNames.add(file);
    }

    // Without this pass a renamed demo leaves its old generated file behind.
    for (const existing of fs.readdirSync(outputDir)) {
      if (path.extname(existing) === '.ts' && !writtenNames.has(existing)) {
        fs.unlinkSync(path.join(outputDir, existing));
      }
    }
  }

  return count;
}

/** Regenerates a single demo source. Used by the dev watcher. */
export async function generateSingleUtilsDemo(filePath: string): Promise<void> {
  const relative = path.relative(DEMOS_PATH, filePath);

  // A path outside DEMOS_PATH relativizes to something like '../elsewhere.ts', whose
  // two segments would otherwise pass the shape check below and send the output to
  // OUTPUT_PATH/../elsewhere.ts. Same guard the CLI uses before it writes a component.
  if (path.isAbsolute(relative) || relative.startsWith('..')) return;

  const parts = relative.split(path.sep);
  if (parts.length !== 2 || path.extname(parts[1]) !== '.ts') return;

  const [utility, fileName] = parts;
  const outputDir = path.join(OUTPUT_PATH, utility);
  fs.ensureDirSync(outputDir);

  const content = await buildExport(utility, filePath, path.basename(fileName, '.ts'));
  writeIfChanged(path.join(outputDir, fileName), content);
}

async function buildExport(utility: string, filePath: string, demoName: string): Promise<string> {
  const code = fs.readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n');
  const html = await highlightCode(code, 'angular-ts');

  const data: CodeBlockData = {
    html,
    code,
    language: 'angular-ts',
    showLineNumbers: true,
    copyButton: true,
    expandable: false,
  };

  return `import type { CodeBlockData } from '@highlight/types';

export const ${toConstName(utility, demoName)}: CodeBlockData = ${JSON.stringify(data, null, 2)};
`;
}

function toConstName(utility: string, demoName: string): string {
  const normalize = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, '_');
  return `UTILS_${normalize(utility)}_${normalize(demoName)}`;
}
