/**
 * Highlights the live demos of the `/docs/ai-elements/*` pages, from TypeScript sources.
 * An AI Element is a copy-paste composition of existing components, so its demo *is*
 * the code people take away — the prose snippets come from Markdown through
 * `page-data-writer`, not from here.
 *
 * Demos — one live component per example:
 *   apps/web/src/app/domain/pages/ai-elements/demos/<pattern>/<name>.ts
 *     -> apps/web/src/generated/ai-elements/<pattern>/<name>.ts
 *        export const AI_ELEMENTS_<PATTERN>_<NAME>: CodeBlockData
 */
import path from 'path';

import { createPageDemoWriter } from './page-demo-writer';

export const AI_ELEMENTS_PATH = path.resolve('apps/web/src/app/domain/pages/ai-elements');

const writer = createPageDemoWriter({
  sourcePath: path.join(AI_ELEMENTS_PATH, 'demos'),
  outputPath: path.resolve('apps/web/src/generated/ai-elements'),
  prefix: 'AI_ELEMENTS',
});

export const generateAiElementsDemoFiles = writer.generateAll;
export const generateSingleAiElementsDemo = writer.generateOne;
