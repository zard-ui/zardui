/**
 * Highlights everything the `/docs/forms/*` guides render, from TypeScript sources.
 * There is no Markdown in this pipeline: a demo is a real component and a prose
 * snippet is an entry in a typed map, so both stay reviewable and refactorable.
 *
 * Demos — one live component per example:
 *   apps/web/src/app/domain/pages/forms/demos/<approach>/<name>.ts
 *     -> apps/web/src/generated/forms/<approach>/<name>.ts
 *        export const FORMS_<APPROACH>_<NAME>: CodeBlockData
 *
 * Snippets — the prose code blocks, keyed by name:
 *   apps/web/src/app/domain/pages/forms/snippets/<approach>.snippets.ts
 *     -> apps/web/src/generated/forms/snippets/<approach>.ts
 *        export const FORMS_<APPROACH>_SNIPPET_<KEY>: CodeBlockData
 */
import fs from 'fs-extra';
import path from 'path';
import { pathToFileURL } from 'url';

import { writeIfChanged } from './file-utils';
import { highlightCode } from './highlighter';
import type { CodeBlockData } from '../types';

const FORMS_PATH = path.resolve('apps/web/src/app/domain/pages/forms');
const DEMOS_PATH = path.join(FORMS_PATH, 'demos');
const SNIPPETS_PATH = path.join(FORMS_PATH, 'snippets');
const OUTPUT_PATH = path.resolve('apps/web/src/generated/forms');
const SNIPPETS_OUTPUT_PATH = path.join(OUTPUT_PATH, 'snippets');

interface FormSnippet {
  language: string;
  title?: string;
  highlightLines?: number[];
  code: string;
}

export async function generateFormDemoFiles(): Promise<number> {
  if (!fs.existsSync(DEMOS_PATH)) return 0;

  let count = 0;
  const approaches = fs
    .readdirSync(DEMOS_PATH)
    .filter(entry => fs.statSync(path.join(DEMOS_PATH, entry)).isDirectory());

  for (const approach of approaches) {
    const approachDir = path.join(DEMOS_PATH, approach);
    const outputDir = path.join(OUTPUT_PATH, approach);
    fs.ensureDirSync(outputDir);

    const writtenNames = new Set<string>();

    for (const file of fs.readdirSync(approachDir)) {
      if (path.extname(file) !== '.ts') continue;

      const outputFile = path.join(outputDir, file);
      const content = await buildExport(approach, path.join(approachDir, file), path.basename(file, '.ts'));

      if (writeIfChanged(outputFile, content)) count++;
      writtenNames.add(file);
    }

    for (const existing of fs.readdirSync(outputDir)) {
      if (path.extname(existing) === '.ts' && !writtenNames.has(existing)) {
        fs.unlinkSync(path.join(outputDir, existing));
      }
    }
  }

  return count;
}

/**
 * Highlights the prose snippets of every guide.
 *
 * The source files are TypeScript modules exporting a `FormSnippetMap`, so they
 * are imported (not parsed) — the generator runs under tsx, which resolves them
 * the same way the app would.
 */
export async function generateFormSnippetFiles(): Promise<number> {
  if (!fs.existsSync(SNIPPETS_PATH)) return 0;

  let count = 0;
  fs.ensureDirSync(SNIPPETS_OUTPUT_PATH);

  const sources = fs.readdirSync(SNIPPETS_PATH).filter(file => file.endsWith('.snippets.ts'));
  const writtenNames = new Set<string>();

  for (const file of sources) {
    const approach = path.basename(file, '.snippets.ts');
    const snippets = await loadSnippets(path.join(SNIPPETS_PATH, file));
    if (!snippets) continue;

    const outputFile = path.join(SNIPPETS_OUTPUT_PATH, `${approach}.ts`);
    if (writeIfChanged(outputFile, await buildSnippetExports(approach, snippets))) count++;
    writtenNames.add(`${approach}.ts`);
  }

  for (const existing of fs.readdirSync(SNIPPETS_OUTPUT_PATH)) {
    if (path.extname(existing) === '.ts' && !writtenNames.has(existing)) {
      fs.unlinkSync(path.join(SNIPPETS_OUTPUT_PATH, existing));
    }
  }

  return count;
}

/** Regenerates a single demo or snippet source. Used by the dev watcher. */
export async function generateSingleFormDemo(filePath: string): Promise<void> {
  if (filePath.endsWith('.snippets.ts')) {
    await generateFormSnippetFiles();
    return;
  }

  const relative = path.relative(DEMOS_PATH, filePath);
  const parts = relative.split(path.sep);
  if (parts.length !== 2 || path.extname(parts[1]) !== '.ts') return;

  const [approach, fileName] = parts;
  const outputDir = path.join(OUTPUT_PATH, approach);
  fs.ensureDirSync(outputDir);

  const content = await buildExport(approach, filePath, path.basename(fileName, '.ts'));
  writeIfChanged(path.join(outputDir, fileName), content);
}

async function loadSnippets(filePath: string): Promise<Record<string, FormSnippet> | null> {
  // Cache-bust so the watcher picks up edits instead of the first import.
  const moduleUrl = `${pathToFileURL(filePath).href}?t=${fs.statSync(filePath).mtimeMs}`;
  const loaded: Record<string, unknown> = await import(moduleUrl);

  const map = Object.values(loaded).find(value => value && typeof value === 'object');
  return (map as Record<string, FormSnippet>) ?? null;
}

async function buildSnippetExports(approach: string, snippets: Record<string, FormSnippet>): Promise<string> {
  let out = `import type { CodeBlockData } from '@highlight/types';\n\n`;

  for (const [key, snippet] of Object.entries(snippets)) {
    const code = snippet.code.replace(/\r\n/g, '\n');
    const data: CodeBlockData = {
      html: await highlightCode(code, snippet.language, snippet.highlightLines),
      code,
      language: snippet.language,
      title: snippet.title,
      showLineNumbers: true,
      copyButton: true,
      expandable: false,
      highlightLines: snippet.highlightLines,
    };

    out += `export const ${toSnippetConstName(approach, key)}: CodeBlockData = ${JSON.stringify(data, null, 2)};\n\n`;
  }

  return out;
}

function toSnippetConstName(approach: string, key: string): string {
  const normalize = (value: string) =>
    value
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '_');
  return `FORMS_${normalize(approach)}_SNIPPET_${normalize(key)}`;
}

async function buildExport(approach: string, filePath: string, demoName: string): Promise<string> {
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

export const ${toConstName(approach, demoName)}: CodeBlockData = ${JSON.stringify(data, null, 2)};
`;
}

function toConstName(approach: string, demoName: string): string {
  const normalize = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, '_');
  return `FORMS_${normalize(approach)}_${normalize(demoName)}`;
}
