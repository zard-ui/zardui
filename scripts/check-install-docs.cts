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

/*
 * Same files is not enough: a guide that lists every file but shows last month's code still installs a stale core. The
 * built registry item (`public/r/<item>.json`, run `npm run build:registry` first) holds exactly what init writes, so
 * each titled block must match it. `--write` rewrites the blocks that drifted.
 */
const WRITE = process.argv.includes('--write');
const FENCE_PATTERN = /^(```\S*\s[^\n]*\btitle="([^"]+)"[^\n]*\n)([\s\S]*?)^```$/gm;
const normalize = (code: string): string => code.replace(/\r\n/g, '\n').replace(/\s+$/, '');

/** The folder each guide's files live in, inside the item: titles are bare names and `index.ts` exists twice. */
const FOLDER_OF: Record<string, string> = {
  'core-directives.md': 'directives/',
  'core-overlay.md': 'overlay/',
  'core-i18n.md': 'i18n/',
  'core-i18n-locales.md': 'i18n/locales/',
  'core-event-manager.md': 'provider/event-manager-plugins/',
  'core-provider.md': 'provider/',
  'core-css.md': 'css/',
  'core-index.md': '',
  'helpers.md': '',
};

for (const [itemName, docFiles] of Object.entries(DOCS_FOR)) {
  const built = path.join(ROOT, 'apps/web/public/r', `${itemName}.json`);
  if (!fs.existsSync(built)) {
    problems.push(`${itemName}: ${path.relative(ROOT, built)} is missing — run npm run build:registry.`);
    continue;
  }
  const shipped: { name: string; content: string }[] = JSON.parse(fs.readFileSync(built, 'utf8')).files;

  for (const docFile of docFiles) {
    const docPath = path.join(SHARED_SETUP_DIR, docFile);
    if (!fs.existsSync(docPath)) continue;
    const before = fs.readFileSync(docPath, 'utf8');
    const eol = before.includes('\r\n') ? '\r\n' : '\n';
    const after = before.replace(FENCE_PATTERN, (fence, opening: string, title: string, body: string) => {
      const name = `${FOLDER_OF[docFile] ?? ''}${title}`;
      const file = shipped.find(candidate => candidate.name === name);
      if (!file) {
        problems.push(`${itemName}: ${docFile} titles "${title}", but the item ships no "${name}".`);
        return fence;
      }
      if (normalize(body) === normalize(file.content)) return fence;
      if (!WRITE) problems.push(`${itemName}: ${docFile} shows an outdated "${name}" — run with --write to sync it.`);
      return `${opening}${normalize(file.content).replace(/\n/g, eol)}${eol}\`\`\``;
    });
    if (WRITE && after !== before) {
      fs.writeFileSync(docPath, after);
      console.log(`↻ synced ${docFile}`);
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
