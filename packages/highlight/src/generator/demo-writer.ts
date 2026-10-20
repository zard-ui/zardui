import fs from 'fs-extra';
import path from 'path';

import { writeIfChanged } from './file-utils';
import { highlightCode } from './highlighter';
import type { CodeBlockData } from '../types';

const COMPONENTS_PATH = path.resolve('libs/zard/src/lib/shared/components');
const OUTPUT_PATH = path.resolve('apps/web/src/generated/components');
const SKIPPED_DIRS = ['styles', 'core'];

/**
 * The RTL examples (`demo/rtl.ts`) are shown in the RTL preview, which wraps them in `dir` and `data-lang` and feeds
 * them the language picked in its header. Their code gets this note first, so nobody copies the translations helper
 * thinking the component needs it.
 */
const RTL_DEMO_NAME = 'rtl';
const RTL_CODE_NOTE = `// You will notice this example is rendered inside a wrapper that sets the dir and data-lang attributes, and
// reads its text from a translations helper. This is because this site is not RTL by default.
// In your application you won't need either: set dir="rtl" on <html> (or use the CDK Dir directive on a subtree)
// and write the text of your own language. See the RTL guide: https://zardui.com/docs/rtl

`;

function prepareDemoCode(code: string, fileName: string): string {
  return path.basename(fileName, '.ts') === RTL_DEMO_NAME ? RTL_CODE_NOTE + code : code;
}

export async function generateDemoFiles(): Promise<number> {
  let count = 0;
  const componentDirs = fs.readdirSync(COMPONENTS_PATH);

  for (const componentName of componentDirs) {
    if (SKIPPED_DIRS.includes(componentName)) continue;

    const componentDir = path.join(COMPONENTS_PATH, componentName);
    if (!fs.statSync(componentDir).isDirectory()) continue;

    const demoDir = path.join(componentDir, 'demo');
    if (!fs.existsSync(demoDir)) continue;

    const demoFiles = fs.readdirSync(demoDir);
    const outputDir = path.join(OUTPUT_PATH, componentName, 'demo');
    fs.ensureDirSync(outputDir);

    const writtenNames = new Set<string>();

    for (const file of demoFiles) {
      if (path.extname(file) !== '.ts') continue;
      if (isConfigFile(file, componentName)) continue;

      const filePath = path.join(demoDir, file);
      const code = prepareDemoCode(fs.readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n'), file);
      const html = await highlightCode(code, 'angular-ts');

      const data: CodeBlockData = {
        html,
        code,
        language: 'angular-ts',
        showLineNumbers: true,
        copyButton: true,
        expandable: false,
      };

      const constName = toConstName(componentName, path.basename(file, '.ts'));
      const outputFile = path.join(outputDir, path.basename(file));
      const content = generateTsExport(constName, data);

      if (writeIfChanged(outputFile, content)) count++;
      writtenNames.add(path.basename(file));
    }

    for (const existing of fs.readdirSync(outputDir)) {
      if (path.extname(existing) === '.ts' && !writtenNames.has(existing)) {
        fs.unlinkSync(path.join(outputDir, existing));
      }
    }
  }

  return count;
}

export async function generateSingleDemo(filePath: string): Promise<void> {
  const relative = path.relative(COMPONENTS_PATH, filePath);
  const parts = relative.split(path.sep);
  if (parts.length < 3 || parts[1] !== 'demo') return;

  const componentName = parts[0];
  const fileName = parts[2];
  if (isConfigFile(fileName, componentName)) return;
  if (path.extname(fileName) !== '.ts') return;

  const code = prepareDemoCode(fs.readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n'), fileName);
  const html = await highlightCode(code, 'angular-ts');

  const data: CodeBlockData = {
    html,
    code,
    language: 'angular-ts',
    showLineNumbers: true,
    copyButton: true,
    expandable: false,
  };

  const constName = toConstName(componentName, path.basename(fileName, '.ts'));
  const outputDir = path.join(OUTPUT_PATH, componentName, 'demo');
  fs.ensureDirSync(outputDir);

  const outputFile = path.join(outputDir, fileName);
  writeIfChanged(outputFile, generateTsExport(constName, data));
}

function isConfigFile(fileName: string, componentName: string): boolean {
  return path.basename(fileName, '.ts') === componentName;
}

function toConstName(componentName: string, demoName: string): string {
  const comp = componentName.toUpperCase().replace(/-/g, '_');
  const demo = demoName.toUpperCase().replace(/-/g, '_');
  return `${comp}_DEMO_${demo}`;
}

function generateTsExport(constName: string, data: CodeBlockData): string {
  return `import type { CodeBlockData } from '@highlight/types';

export const ${constName}: CodeBlockData = ${JSON.stringify(data, null, 2)};
`;
}
