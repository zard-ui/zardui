/**
 * Proves that every component selector and registry item name the skills claim
 * actually exists — the check that would have caught `z-tree` and `z-layout`
 * sitting in `skills/zard/SKILL.md`'s component-selection table after both were
 * removed from the registry (see `skills/zard-migration/renames.md`).
 *
 * Two passes:
 *
 *   selectors  — every `z-<kebab>` token found anywhere in `skills/**\/*.md` must
 *                resolve to a selector actually declared by a `@Component` or
 *                `@Directive` in `libs/zard/src/lib/shared/components/**`.
 *   registry   — every argument that follows a `zard-cli add` (or `npx zard-cli
 *                add`, `pnpm dlx zard-cli add`, …) invocation in the docs must
 *                name a real registry item (`registry.json`) or a real block
 *                (`blocks-registry.json`).
 *
 * `skills/zard-migration/**` documents names that were renamed or removed on
 * purpose — a rename table is not a claim that the old name still resolves. The
 * IGNORE list below is exactly that: it is scoped per file, so a name ignored in
 * the migration skill's history is still an error if it reappears in the `zard`
 * skill itself, which is the one an assistant treats as current.
 *
 * Run it with `npm run check:skills`.
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(ROOT, 'skills');
const COMPONENTS_DIR = path.join(ROOT, 'libs/zard/src/lib/shared/components');
const REGISTRY_JSON = path.join(ROOT, 'apps/web/public/r/registry.json');
const BLOCKS_REGISTRY_JSON = path.join(ROOT, 'apps/web/public/r/blocks-registry.json');

/**
 * Selectors mentioned only as historical fact — a name the registry used to
 * publish, documented as removed or renamed. Keyed by the file that is allowed
 * to name them; every other file still fails on them. Comment each with why.
 */
const IGNORED_SELECTORS: Record<string, readonly string[]> = {
  'zard-migration/renames.md': [
    // Removed entirely — no replacement component (see the "tree" row).
    'z-tree',
    // Removed entirely — replaced by `sidebar` (see the "layout" row).
    'z-layout',
    'z-header',
    'z-footer',
    'z-content',
    // Renamed away — see the rename table rows for each.
    'z-divider',
    'z-loader',
    'z-progress-bar',
    'z-toast',
    'z-toaster',
    'z-menu',
    'z-form-field',
    'z-form-control',
    'z-form-label',
    'z-form-message',
    'z-segmented',
    'z-button-group-divider',
  ],
  'zard-migration/SKILL.md': [
    // Detection markers in the "what an old project looks like" table.
    'z-button-group-divider',
    'z-toast',
    'z-toaster',
    'z-divider',
  ],
};

/** Not a component selector — a CSS property/utility name that happens to match `z-[a-z]`. */
const NON_SELECTOR_TOKENS = new Set(['z-index']);

const IGNORED_REGISTRY_NAMES: Record<string, readonly string[]> = {
  'zard-migration/renames.md': [
    // Removed/renamed registry items, named as the "old" side of a rename row.
    'divider',
    'loader',
    'radio',
    'progress-bar',
    'toast',
    'menu',
    'form',
    'segmented',
    'tree',
    'layout',
  ],
};

const problems: string[] = [];
const report = (file: string, message: string) => problems.push(`${file}: ${message}`);

// ---------------------------------------------------------------------------
// What actually exists
// ---------------------------------------------------------------------------

/** Every `z-<kebab>` selector declared by a `@Component`/`@Directive` in the library. */
function realSelectors(): Set<string> {
  const selectors = new Set<string>();

  const walk = (dir: string): void => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'demo' || entry.name === 'doc') continue;
      const full = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(full);
        continue;
      }

      // Most declarations live in `<name>.component.ts` / `<name>.directive.ts`,
      // but not all — `tooltip/tooltip.ts` holds both a directive and a
      // component. Read every `.ts` file (never `.spec.ts`) and look for the
      // decorator property itself, rather than trusting the file name.
      if (!entry.name.endsWith('.ts') || entry.name.endsWith('.spec.ts')) continue;

      const source = fs.readFileSync(full, 'utf8');
      for (const match of source.matchAll(/selector:\s*'([^']+)'/g)) {
        for (const token of match[1].matchAll(/z-[a-z][a-z0-9-]*/g)) selectors.add(token[0]);
      }
    }
  };

  walk(COMPONENTS_DIR);
  return selectors;
}

/** Every name `zard-cli add` accepts: registry components/items plus block ids. */
function realRegistryNames(): Set<string> {
  const registry = JSON.parse(fs.readFileSync(REGISTRY_JSON, 'utf8')) as { items: Array<{ name: string }> };
  const blocks = JSON.parse(fs.readFileSync(BLOCKS_REGISTRY_JSON, 'utf8')) as { blocks: Array<{ id: string }> };

  const names = new Set(registry.items.map(item => item.name));
  for (const block of blocks.blocks) names.add(block.id);
  return names;
}

// ---------------------------------------------------------------------------
// What the skills claim
// ---------------------------------------------------------------------------

function markdownFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...markdownFiles(full));
    else if (entry.name.endsWith('.md')) files.push(full);
  }
  return files;
}

/** Flags that follow `zard-cli add`, never a component/block name. */
const ADD_FLAGS = new Set(['-y', '--yes', '-o', '--overwrite', '-c', '--cwd', '-a', '--all', '-p', '--path']);

const RUNNER_PREFIX = /^(?:npx |pnpm dlx |yarn |bunx (?:--bun )?)?zard-cli add\b(.*)$/;

/**
 * Every self-contained "line of code" in the markdown: one entry per fenced
 * code block line, and one entry per inline single-backtick span. Prose around
 * an inline span (`` `zard-cli add typeset` installs the stylesheet. ``) is
 * never included — only the span's own content is, which is what keeps this
 * from reading the rest of the sentence as arguments.
 */
function codeLinesIn(content: string): string[] {
  const lines: string[] = [];

  const withoutFences = content.replace(/```[\s\S]*?```/g, block => {
    for (const raw of block.split('\n').slice(1, -1)) {
      const withoutComment = raw.replace(/\s+#.*$/, '');
      lines.push(withoutComment.trim());
    }
    return '';
  });

  for (const match of withoutFences.matchAll(/`([^`\n]+)`/g)) lines.push(match[1].trim());

  return lines;
}

/** Arguments named after a `zard-cli add` invocation that is a whole code line/span. */
function addArgumentsIn(codeLine: string): string[] {
  const match = RUNNER_PREFIX.exec(codeLine);
  if (!match) return [];

  const args: string[] = [];
  for (const token of match[1].trim().split(/\s+/)) {
    if (!token) continue;
    if (ADD_FLAGS.has(token)) continue;
    if (token.startsWith('-') || token.startsWith('<') || token.startsWith('$')) continue;
    if (!/^[a-z][a-z0-9-]*$/.test(token)) continue;
    args.push(token);
  }
  return args;
}

function checkFile(filePath: string, realSelectorSet: Set<string>, realRegistrySet: Set<string>): void {
  const relativeToSkills = path.relative(SKILLS_DIR, filePath).split(path.sep).join('/');
  const relativeToRoot = path.relative(ROOT, filePath).split(path.sep).join('/');
  // Normalise CRLF: an un-normalised trailing "\r" stops `.*$` short of the
  // true end of line (`.` does not match a line terminator), which silently
  // breaks the comment-stripping in `codeLinesIn` on a Windows checkout.
  const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

  const ignoredSelectors = new Set(IGNORED_SELECTORS[relativeToSkills] ?? []);
  const ignoredRegistryNames = new Set(IGNORED_REGISTRY_NAMES[relativeToSkills] ?? []);

  const foundSelectors = new Set<string>();
  for (const match of content.matchAll(/z-[a-z][a-z0-9-]*/g)) foundSelectors.add(match[0]);

  for (const selector of foundSelectors) {
    if (NON_SELECTOR_TOKENS.has(selector)) continue;
    if (realSelectorSet.has(selector)) continue;
    if (ignoredSelectors.has(selector)) continue;
    report(relativeToRoot, `references selector "${selector}", which no component or directive declares`);
  }

  for (const codeLine of codeLinesIn(content)) {
    for (const arg of addArgumentsIn(codeLine)) {
      if (realRegistrySet.has(arg)) continue;
      if (ignoredRegistryNames.has(arg)) continue;
      report(relativeToRoot, `"zard-cli add ${arg}" names an item the registry does not publish`);
    }
  }
}

// ---------------------------------------------------------------------------

const selectors = realSelectors();
const registryNames = realRegistryNames();

for (const file of markdownFiles(SKILLS_DIR)) {
  checkFile(file, selectors, registryNames);
}

if (problems.length > 0) {
  console.error(`\n✖ skills reference ${problems.length} name(s) that do not exist:\n`);
  for (const problem of problems) console.error(`  ${problem}`);
  console.error(
    '\nEvery z-* selector and every "zard-cli add <name>" argument in skills/**/*.md must resolve to a real ' +
      'component, directive, registry item or block — see scripts/check-skills.cts for the (small, per-file) ' +
      'exceptions for skills/zard-migration, which documents removed and renamed names on purpose.\n',
  );
  process.exit(1);
}

console.log(`✔ skills are self-consistent — ${selectors.size} selectors, ${registryNames.size} registry names checked`);
