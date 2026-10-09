/**
 * Proves the hand-authored core/utils setup guides cover exactly what the
 * `core` and `utils` registry items ship.
 *
 * `registry-data.ts` is the file list `zard-cli init` actually installs. The
 * manual installation guides under `apps/web/public/documentation/setup/shared/`
 * (`core-*.md`, `helpers.md`) copy those same files by hand, one fenced code
 * block per file, titled with the bare file name (never a path — see
 * `packages/highlight/src/generator/installation-writer.ts` for the convention
 * this mirrors). Nothing re-generates those blocks from the registry today, so
 * a file added to, removed from, or renamed within `core`/`utils` can drift
 * from the guide silently — this check is what catches it before a reader
 * follows a guide that is missing a step, or one that still shows a deleted
 * file.
 *
 * Run it with `npm run check:install-docs`.
 */

import * as fs from 'fs';
import * as path from 'path';

import { registry } from '../packages/cli/src/core/registry/registry-data';

const ROOT = path.resolve(__dirname, '..');
const SHARED_SETUP_DIR = path.join(ROOT, 'apps/web/public/documentation/setup/shared');

/** Which markdown files document each registry item's files. */
const DOCS_FOR: Record<string, string[]> = {
  core: [
    'core-directives.md',
    'core-overlay.md',
    'core-i18n.md',
    'core-i18n-locales.md',
    'core-event-manager.md',
    'core-provider.md',
    'core-css.md',
    'core-index.md',
  ],
  utils: ['helpers.md'],
};

const TITLE_PATTERN = /^```\S*\s.*\btitle="([^"]+)"/gm;

/** The bare file name a code fence documents, for every fence with a `title`. */
function titledFilesIn(markdownPath: string): string[] {
  const content = fs.readFileSync(markdownPath, 'utf8');
  return [...content.matchAll(TITLE_PATTERN)].map(match => match[1] as string);
}

const problems: string[] = [];

for (const [itemName, docFiles] of Object.entries(DOCS_FOR)) {
  const item = registry.find(entry => entry.name === itemName);
  if (!item) {
    problems.push(`registry-data.ts no longer has an item named "${itemName}" — update DOCS_FOR in this script.`);
    continue;
  }

  const expected = item.files.map(file => path.basename(file.name)).sort();

  const documented = docFiles
    .flatMap(docFile => {
      const docPath = path.join(SHARED_SETUP_DIR, docFile);
      if (!fs.existsSync(docPath)) {
        problems.push(`${itemName}: ${docFile} is missing from apps/web/public/documentation/setup/shared/.`);
        return [];
      }
      return titledFilesIn(docPath);
    })
    .sort();

  for (const file of expected) {
    if (!documented.includes(file)) {
      problems.push(`${itemName}: registry ships "${file}" but no setup/shared/*.md code block titles it.`);
    }
  }

  const expectedSet = new Set(expected);
  for (const file of documented) {
    if (!expectedSet.has(file)) {
      problems.push(
        `${itemName}: a setup/shared/*.md code block titles "${file}", which the registry item no longer ships.`,
      );
    }
  }

  // No `/` in a title: it must be a bare file name, the step subtitle names the folder.
  for (const file of documented) {
    if (file.includes('/')) {
      problems.push(`${itemName}: code block titled "${file}" contains a path — titles must be bare file names.`);
    }
  }
}

if (problems.length > 0) {
  console.error(`\n✖ install docs are not self-consistent — ${problems.length} problem(s):\n`);
  for (const problem of problems) console.error(`  ${problem}`);
  console.error(
    '\nEvery file the "core"/"utils" registry items ship must have a titled code block under apps/web/public/documentation/setup/shared/, and vice versa.\n',
  );
  process.exit(1);
}

console.log('✔ install docs cover exactly the "core" and "utils" registry items');
