/**
 * Rewrites the `## Components` section of `public/llms.txt` from COMPONENTS_REGISTRY.
 *
 * The section used to be maintained by hand, and it drifted: five components were
 * missing and one that had been renamed was still listed. Everything else in the
 * file is prose and stays hand-written — only the block between `## Components`
 * and the next `## ` heading is replaced.
 *
 * Run with the web tsconfig so the path aliases resolve:
 *   npx tsx --tsconfig apps/web/tsconfig.generate.json apps/web/generate-llms.mts
 */
import '@angular/compiler';

import { Window } from 'happy-dom';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Angular's partially-compiled component modules touch browser globals at load
// time. Provide the few Node lacks before importing anything Angular.
const win = new Window({ url: 'http://localhost' });
const globals = globalThis as Record<string, unknown>;
globals['window'] = win;
globals['document'] = win.document;
globals['HTMLElement'] = win.HTMLElement;

const { COMPONENTS_REGISTRY } = await import('@doc/shared/constants/components.constant');
const { COMPONENTS_PATH } = await import('@doc/shared/constants/routes.constant');

const LLMS_PATH = resolve('apps/web/public/llms.txt');
const BASE_URL = 'https://zardui.com';

/** The order the groups appear in, which is broad-to-specific rather than alphabetical. */
const CATEGORY_ORDER = [
  'Form & Input',
  'Layout & Navigation',
  'Overlays & Dialogs',
  'Feedback & Status',
  'Display & Media',
  'Misc',
] as const;

/** The sidebar is the one place that already knows each component's display name. */
const displayNames = new Map(COMPONENTS_PATH.data.map(item => [item.path.replace('/docs/components/', ''), item.name]));

function renderComponents(): string {
  const lines: string[] = ['## Components', ''];

  for (const category of CATEGORY_ORDER) {
    const entries = COMPONENTS_REGISTRY.filter(entry => entry.category === category).sort((a, b) =>
      a.componentName.localeCompare(b.componentName),
    );
    if (entries.length === 0) continue;

    lines.push(`### ${category}`, '');
    for (const entry of entries) {
      const name = displayNames.get(entry.componentName) ?? entry.componentName;
      lines.push(`- [${name}](${BASE_URL}/docs/components/${entry.componentName}): ${entry.description}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

const source = readFileSync(LLMS_PATH, 'utf8');
const start = source.indexOf('## Components\n');

if (start === -1) {
  throw new Error(`No "## Components" heading in ${LLMS_PATH}.`);
}

const afterStart = start + '## Components\n'.length;
const nextHeading = source.indexOf('\n## ', afterStart);

if (nextHeading === -1) {
  throw new Error(`No heading after "## Components" in ${LLMS_PATH} — nothing to bound the section.`);
}

const updated = source.slice(0, start) + renderComponents() + source.slice(nextHeading + 1);

if (updated === source) {
  console.log(`✅ llms.txt already lists all ${COMPONENTS_REGISTRY.length} components`);
} else {
  writeFileSync(LLMS_PATH, updated);
  console.log(`✅ Rewrote the llms.txt component list — ${COMPONENTS_REGISTRY.length} components`);
}
