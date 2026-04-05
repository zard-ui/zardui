import fs from 'fs-extra';
import path from 'path';

import { highlightCode } from './highlighter';
import { USAGE_DATA } from './usage-data';
import type { CodeBlockData } from '../types';

const OUTPUT_PATH = path.resolve('apps/web/src/generated/usage');

export async function generateUsageFiles(): Promise<number> {
  let count = 0;
  fs.ensureDirSync(OUTPUT_PATH);

  for (const [componentName, rawData] of Object.entries(USAGE_DATA)) {
    const importHtml = await highlightCode(rawData.importCode, 'angular-ts');
    const templateHtml = await highlightCode(rawData.templateCode, 'angular-html');

    const importBlock: CodeBlockData = {
      html: importHtml,
      code: rawData.importCode,
      language: 'angular-ts',
      showLineNumbers: true,
      copyButton: true,
      expandable: false,
    };

    const codeBlock: CodeBlockData = {
      html: templateHtml,
      code: rawData.templateCode,
      language: 'angular-html',
      showLineNumbers: true,
      copyButton: true,
      expandable: false,
    };

    const constPrefix = componentName.toUpperCase().replace(/-/g, '_');
    const content = `import type { CodeBlockData } from '@highlight/types';

export const ${constPrefix}_USAGE_IMPORT: CodeBlockData = ${JSON.stringify(importBlock, null, 2)};

export const ${constPrefix}_USAGE_CODE: CodeBlockData = ${JSON.stringify(codeBlock, null, 2)};
`;
    fs.writeFileSync(path.join(OUTPUT_PATH, `${componentName}.ts`), content);
    count++;
  }

  return count;
}
