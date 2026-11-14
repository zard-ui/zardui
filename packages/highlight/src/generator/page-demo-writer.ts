/**
 * Highlights the live demos of a docs section whose demos live next to its pages
 * in `apps/web` rather than next to a component in `libs/zard`, from TypeScript sources.
 * The prose snippets of those pages come from Markdown through `page-data-writer`, not from here.
 *
 * Demos — one live component per example:
 *   <sourcePath>/<group>/<name>.ts
 *     -> apps/web/src/generated/<outputDir>/<group>/<name>.ts
 *        export const <PREFIX>_<GROUP>_<NAME>: CodeBlockData
 */
import fs from 'fs-extra';
import path from 'path';

import { writeIfChanged } from './file-utils';
import { highlightCode } from './highlighter';
import type { CodeBlockData } from '../types';

export interface PageDemoWriterOptions {
  /** The folder that holds one sub-folder of demos per group, such as a utility or a pattern. */
  sourcePath: string;
  /** Where the highlighted demos are written, one sub-folder per group. */
  outputPath: string;
  /** Leads every exported constant, such as `UTILS` in `UTILS_SHIMMER_BASIC`. */
  prefix: string;
}

export interface PageDemoWriter {
  generateAll(): Promise<number>;
  /** Regenerates a single demo source. Used by the dev watcher. */
  generateOne(filePath: string): Promise<void>;
}

export function createPageDemoWriter({ sourcePath, outputPath, prefix }: PageDemoWriterOptions): PageDemoWriter {
  async function buildExport(group: string, filePath: string, demoName: string): Promise<string> {
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

export const ${toConstName(prefix, group, demoName)}: CodeBlockData = ${JSON.stringify(data, null, 2)};
`;
  }

  async function generateAll(): Promise<number> {
    if (!fs.existsSync(sourcePath)) return 0;

    let count = 0;
    const groups = fs.readdirSync(sourcePath).filter(entry => fs.statSync(path.join(sourcePath, entry)).isDirectory());

    for (const group of groups) {
      const groupDir = path.join(sourcePath, group);
      const outputDir = path.join(outputPath, group);
      fs.ensureDirSync(outputDir);

      const writtenNames = new Set<string>();

      for (const file of fs.readdirSync(groupDir)) {
        if (path.extname(file) !== '.ts') continue;

        const outputFile = path.join(outputDir, file);
        const content = await buildExport(group, path.join(groupDir, file), path.basename(file, '.ts'));

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

  async function generateOne(filePath: string): Promise<void> {
    const relative = path.relative(sourcePath, filePath);

    // A path outside sourcePath relativizes to something like '../elsewhere.ts', whose
    // two segments would otherwise pass the shape check below and send the output to
    // outputPath/../elsewhere.ts. Same guard the CLI uses before it writes a component.
    if (path.isAbsolute(relative) || relative === '..' || relative.startsWith(`..${path.sep}`)) return;

    const parts = relative.split(path.sep);
    if (parts.length !== 2 || path.extname(parts[1]) !== '.ts') return;

    const [group, fileName] = parts;
    const outputDir = path.join(outputPath, group);
    fs.ensureDirSync(outputDir);

    const content = await buildExport(group, filePath, path.basename(fileName, '.ts'));
    writeIfChanged(path.join(outputDir, fileName), content);
  }

  return { generateAll, generateOne };
}

function toConstName(prefix: string, group: string, demoName: string): string {
  const normalize = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, '_');
  return `${prefix}_${normalize(group)}_${normalize(demoName)}`;
}
