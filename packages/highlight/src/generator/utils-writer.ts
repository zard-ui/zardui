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
import path from 'path';

import { createPageDemoWriter } from './page-demo-writer';

export const UTILS_PATH = path.resolve('apps/web/src/app/domain/pages/utils');

const writer = createPageDemoWriter({
  sourcePath: path.join(UTILS_PATH, 'demos'),
  outputPath: path.resolve('apps/web/src/generated/utils'),
  prefix: 'UTILS',
});

export const generateUtilsDemoFiles = writer.generateAll;
export const generateSingleUtilsDemo = writer.generateOne;
