/**
 * Proves that the committed Markdown of the documentation (`apps/web/public/docs/**`) says
 * what the rendered pages say. The MCP server (`get-docs`) and the "copy page" action serve
 * these files, so a generator that quietly drops a section or a code block hands an AI
 * assistant a worse page than the one a person reads.
 *
 * It compares the prerendered HTML (`dist/apps/web/browser/docs`, so run it after the build)
 * with the committed `.md`, for every page:
 *
 *   headings   every heading of the page (h1-h4) exists in the `.md`, by text.
 *   code       every `<pre>` of the page exists in the `.md` as a fenced block. The three
 *              package-manager spellings of a command (npm/pnpm/yarn/bun tabs) count once.
 *   stale      the `.md` equals what the generator produces from the page today, so a build
 *              never leaves a tracked file modified. Skipped for the pages in VOLATILE: they
 *              render data fetched from GitHub while prerendering, so only headings and code
 *              are compared.
 *
 * Component pages (`components/<name>`) get the code check too: their `.md` comes from the
 * structured component data, and every code block the page shows must be in it.
 *
 *   npm run check:docs-md
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Window } from 'happy-dom';

import {
  BROWSER_DOCS,
  PACKAGE_MANAGERS,
  PUBLIC_DOCS,
  VOLATILE,
  collectDocPaths,
  convertPage,
  skipEl,
} from '../apps/web/generate-docs-markdown.mjs';

const domParser = new new Window().DOMParser();

/** Collapses whitespace so a block compares equal whatever its indentation or line wrapping. */
const normalize = text => text.replace(/\s+/g, ' ').trim();
/** Heading text without Markdown decoration. */
const plain = text => normalize(text.replace(/[`*]/g, ''));

/**
 * Whether the generator leaves an element out. The inactive panel of an install-page tab
 * switcher is `sr-only` but is kept (both methods are documented), so it is not hidden.
 */
function isHidden(el, root) {
  for (let node = el; node && node !== root; node = node.parentElement) {
    if (node.tagName === 'SECTION' && (node.getAttribute('class') || '').includes('transition-all')) continue;
    if (skipEl(node)) return true;
  }
  return false;
}

/** A heading inside a card link or a list item is an entry of that list, not a section. */
const isEntry = (el, root) => {
  for (let node = el.parentElement; node && node !== root; node = node.parentElement) {
    if (node.tagName === 'A' || node.tagName === 'LI') return true;
  }
  return false;
};

/** The headings and code blocks a reader of the page sees. */
function pageContent(html, { maxHeading = 4 } = {}) {
  const content = domParser.parseFromString(html, 'text/html').querySelector('z-content');
  if (!content) return null;

  const headings = [...content.querySelectorAll(['h1', 'h2', 'h3', 'h4'].slice(0, maxHeading).join(', '))]
    .filter(el => !isHidden(el, content) && !isEntry(el, content))
    .map(el => plain(el.textContent))
    .filter(Boolean);

  // Alternative spellings of one command are one block: keep only the first tab's panel.
  const redundant = new Set();
  for (const tabs of content.querySelectorAll('[role="tablist"]')) {
    const labels = [...tabs.querySelectorAll('[role="tab"]')].map(t => t.textContent.trim().toLowerCase());
    if (labels.length < 2 || !labels.every(label => PACKAGE_MANAGERS.has(label))) continue;
    let box = tabs.parentElement;
    while (box && !box.querySelector('[role="tabpanel"]')) box = box.parentElement;
    const panels = box ? [...box.querySelectorAll('[role="tabpanel"]')] : [];
    panels.slice(1).forEach(panel => redundant.add(panel));
  }
  const code = [...content.querySelectorAll('pre')]
    .filter(pre => !isHidden(pre, content))
    .filter(pre => ![...redundant].some(panel => panel.contains(pre)))
    .map(pre => normalize(pre.textContent))
    .filter(Boolean);

  return { headings, code };
}

const ENTITIES = { '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&#x27;': "'", '&amp;': '&' };

/**
 * Code blocks of a component page, read from the markup with no DOM: those pages weigh
 * up to 1.5 MB each and parsing 55 of them with happy-dom exhausts the heap. The
 * package-manager tabs of the CLI command are the only duplicated blocks, so the first
 * panel of a tab group is kept and the other panels (hidden) are dropped.
 */
function componentCode(html) {
  const blocks = [];
  const pre = /<pre\b[^>]*>([\s\S]*?)<\/pre>/g;
  const hiddenPanel = /role="tabpanel"[^>]*class="[^"]*\bhidden\b[^"]*"[^>]*>\s*$/;
  let match;
  while ((match = pre.exec(html))) {
    const text = match[1].replace(/<[^>]+>/g, '').replace(/&(?:lt|gt|quot|amp|#39|#x27);/g, e => ENTITIES[e]);
    const before = html.slice(Math.max(0, match.index - 400), match.index);
    blocks.push({ text: normalize(text), hidden: hiddenPanel.test(before) });
  }
  return blocks.filter(block => block.text && !block.hidden).map(block => block.text);
}

/** The headings and fenced blocks of a Markdown document (fences may be longer than 3 ticks). */
function markdownContent(markdown) {
  const headings = [];
  const code = [];
  let fence = null;
  let buffer = [];
  for (const line of markdown.replace(/^---\n[\s\S]*?\n---\n/, '').split('\n')) {
    const open = line.match(/^(`{3,})/);
    if (fence) {
      if (open && open[1].length >= fence.length && line.trim() === open[1]) {
        code.push(normalize(buffer.join('\n')));
        fence = null;
        buffer = [];
      } else buffer.push(line);
    } else if (open) fence = open[1];
    else {
      const heading = line.match(/^#{1,6}\s+(.+)$/);
      if (heading) headings.push(plain(heading[1]));
    }
  }
  return { headings, code };
}

/** Items of `expected` that `actual` does not hold, counting duplicates. */
function missing(expected, actual) {
  const pool = new Map();
  for (const item of actual) pool.set(item, (pool.get(item) ?? 0) + 1);
  const lost = [];
  for (const item of expected) {
    const left = pool.get(item) ?? 0;
    if (left > 0) pool.set(item, left - 1);
    else lost.push(item);
  }
  return lost;
}

const preview = text => (text.length > 90 ? `${text.slice(0, 90)}…` : text);
const problems = [];
const fail = (page, message) => problems.push(`${page}: ${message}`);

function compare(page, expected, markdown, { headings = true } = {}) {
  const actual = markdownContent(markdown);
  if (headings) {
    for (const heading of missing(expected.headings, actual.headings)) fail(page, `heading lost: "${heading}"`);
  }
  // A block shown in both install tabs (CLI and Manual) is documented once: compare as a set.
  for (const block of new Set(expected.code)) {
    if (!actual.code.includes(block)) fail(page, `code block lost: ${preview(block)}`);
  }
}

if (!existsSync(BROWSER_DOCS)) {
  console.error(`✖ ${BROWSER_DOCS} not found. Run the production build first (npm run build).`);
  process.exit(1);
}

let pages = 0;
for (const relPath of collectDocPaths(BROWSER_DOCS)) {
  const mdPath = join(PUBLIC_DOCS, `${relPath}.md`);
  const html = readFileSync(join(BROWSER_DOCS, relPath, 'index.html'), 'utf-8');
  // Volatile pages list people fetched from GitHub as h3 cards: compare the page structure only.
  const expected = pageContent(html, { maxHeading: VOLATILE.has(relPath) ? 2 : 4 });
  if (!expected) continue;
  if (!existsSync(mdPath)) {
    fail(relPath, `no committed Markdown (${mdPath})`);
    continue;
  }
  pages++;
  const committed = readFileSync(mdPath, 'utf-8').replace(/\r\n/g, '\n');
  compare(relPath, expected, committed);

  if (!VOLATILE.has(relPath)) {
    const generated = convertPage(html, relPath.split('/').pop());
    if (generated !== committed)
      fail(relPath, 'stale: differs from the generator output. Run npm run generate:md:docs');
  }
}

// Component pages: their code blocks must all be in the structured Markdown.
const componentsDir = join(BROWSER_DOCS, 'components');
if (existsSync(componentsDir)) {
  for (const entry of readdirSync(componentsDir, { withFileTypes: true })) {
    const htmlPath = join(componentsDir, entry.name, 'index.html');
    if (!entry.isDirectory() || !existsSync(htmlPath)) continue;
    const mdPath = join(PUBLIC_DOCS, 'components', `${entry.name}.md`);
    const page = `components/${entry.name}`;
    if (!existsSync(mdPath)) {
      fail(page, `no committed Markdown (${mdPath})`);
      continue;
    }
    const expected = { headings: [], code: componentCode(readFileSync(htmlPath, 'utf-8')) };
    pages++;
    // Component headings are generated, not authored: only the code is compared.
    compare(page, expected, readFileSync(mdPath, 'utf-8').replace(/\r\n/g, '\n'), { headings: false });
  }
}

if (problems.length) {
  console.error(`✖ ${problems.length} problem(s) in the docs Markdown:\n`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log(`✔ docs Markdown matches the rendered pages — ${pages} pages checked`);
