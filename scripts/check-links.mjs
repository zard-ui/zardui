/**
 * Proves that every internal link of the documentation site lands on a real page, and that every
 * `#anchor` lands on a real element. The site's catch-all route (`**`) redirects an unknown path
 * to the home page, so a typo in a link never shows up as a 404: the reader just ends up on the
 * wrong page. This script is what notices.
 *
 * It reads the production build (`dist/apps/web/browser`, so run it after `npm run build`):
 *
 *   links     every `<a href>` of every prerendered page that points at this site (a path, or
 *             `https://zardui.com/...`) must resolve to a prerendered page or a file of `public/`.
 *   anchors   a `#fragment` (alone or after a path) must match an `id` (or `name`) of the target page.
 *             An id that appears twice on a page is reported too: the browser lands on the first.
 *   llms.txt  the links of `public/llms.txt` follow the same rules.
 *   markdown  the relative links of `public/docs/**.md` follow the same rules.
 *
 * Pages rendered only in the browser (`index.csr.html` fallback, e.g. `/create`) are valid targets,
 * but their anchors cannot be verified and are skipped.
 *
 *   npm run check:links
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const BROWSER = join(ROOT, 'dist/apps/web/browser');
const PUBLIC_DIR = join(ROOT, 'apps/web/public');
const ORIGINS = ['https://zardui.com', 'https://www.zardui.com'];

if (!existsSync(BROWSER)) {
  console.error('check:links needs the production build. Run `npm run build` first.');
  process.exit(1);
}

/** Every file under `dir`, relative to it, with forward slashes. */
function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full).map(f => `${name}/${f}`));
    else out.push(name);
  }
  return out;
}

const files = walk(BROWSER);
const fileSet = new Set(files);

/**
 * Routes the app serves with a route parameter, so there is no prerendered file per value.
 * Keep in step with `apps/web/src/app/app.routes.ts` and the `*.routes.ts` of blocks and charts.
 */
const PARAM_ROUTES = [
  /^\/blocks\/[^/]+$/,
  /^\/charts\/[^/]+$/,
  /^\/blocks\/preview\/[^/]+$/,
  /^\/create\/preview\/[^/]+$/,
  /^\/typeset\/preview$/,
];

/** The prerendered HTML file that serves a route, or null when the route has none. */
function pageFile(path) {
  const clean = path.replace(/^\/+|\/+$/g, '');
  const candidates = clean ? [`${clean}/index.html`, `${clean}.html`] : ['index.html'];
  return candidates.find(c => fileSet.has(c)) ?? null;
}

/** Ids the table of contents and the section links point at: a repeat sends the reader to the wrong block. */
const TARGET_IDS = new Set(['overview', 'installation', 'usage', 'composition', 'examples', 'api', 'about']);

const idsCache = new Map();
/** The ids of a prerendered page (id -> how many times it appears). Only the counts stay in memory. */
function idsOf(file) {
  if (idsCache.has(file)) return idsCache.get(file);
  const seen = new Map();
  const html = readFileSync(join(BROWSER, file), 'utf8');
  for (const [, id] of html.matchAll(/\sid="([^"]+)"/g)) seen.set(id, (seen.get(id) ?? 0) + 1);
  idsCache.set(file, seen);
  return seen;
}

const problems = [];
const report = (from, href, reason) => problems.push(`${from}  ${href}  ${reason}`);

/**
 * Checks one link found on `fromRoute` (a path like `/docs/cli`). Returns nothing; pushes problems.
 */
function checkLink(from, fromRoute, href, { anchors = true } = {}) {
  if (!href || /^(mailto:|tel:|javascript:|data:|blob:)/i.test(href)) return;

  let target = href;
  for (const origin of ORIGINS) {
    if (target.startsWith(origin)) target = target.slice(origin.length) || '/';
  }
  if (/^[a-z][a-z0-9+.-]*:|^\/\//i.test(target)) return; // another site

  const hashAt = target.indexOf('#');
  const fragment = hashAt >= 0 ? decodeURIComponent(target.slice(hashAt + 1)) : '';
  let path = hashAt >= 0 ? target.slice(0, hashAt) : target;
  path = path.split('?')[0];

  if (path === '') path = fromRoute;
  else if (!path.startsWith('/'))
    path = new URL(path, `http://x${fromRoute.endsWith('/') ? fromRoute : `${fromRoute}/`}`).pathname;

  const normalized = path.replace(/\/+$/, '') || '/';
  const file = pageFile(normalized);

  if (!file) {
    if (PARAM_ROUTES.some(re => re.test(normalized))) return;
    // A file of public/ (image, .md, llms.txt, json) is a valid target.
    const asset = normalized.replace(/^\//, '');
    if (!fileSet.has(asset) && !existsSync(join(PUBLIC_DIR, asset))) {
      report(from, href, `no page or file at ${normalized}`);
    }
    return;
  }

  if (!anchors || !fragment || fragment === 'top') return;
  if (file === 'index.csr.html') return;
  const seen = idsOf(file);
  if (!seen.has(fragment)) report(from, href, `no element with id "${fragment}" on ${normalized}`);
}

// 1. Prerendered pages.
const pages = files.filter(f => f.endsWith('.html') && f !== 'index.csr.html' && !f.includes('/preview'));
for (const file of pages) {
  const route = file === 'index.html' ? '/' : `/${file.replace(/(\/index)?\.html$/, '')}`;
  const html = readFileSync(join(BROWSER, file), 'utf8');
  const seen = idsOf(file);

  for (const [, href] of html.matchAll(/<a\s[^>]*?href="([^"]*)"/g)) {
    checkLink(file, route, href.replace(/&amp;/g, '&'));
  }

  for (const [id, count] of seen) {
    // An example named like a section (`api`) or a section rendered twice makes `#id` land on the wrong one.
    if (count > 1 && TARGET_IDS.has(id) && route.startsWith('/docs/')) {
      report(file, `#${id}`, `id appears ${count} times on the page`);
    }
  }
}

// 2. llms.txt.
const llms = readFileSync(join(PUBLIC_DIR, 'llms.txt'), 'utf8');
for (const [, href] of llms.matchAll(/\]\(([^)\s]+)\)/g)) checkLink('llms.txt', '/', href);

// 3. Markdown of the docs: only links to this site.
const docsDir = join(PUBLIC_DIR, 'docs');
if (existsSync(docsDir)) {
  for (const f of walk(docsDir).filter(n => n.endsWith('.md'))) {
    const text = readFileSync(join(docsDir, f), 'utf8').replace(/```[\s\S]*?```/g, '');
    const route = `/docs/${f.replace(/\.md$/, '')}`;
    for (const [, href] of text.matchAll(/\[[^\]]*\]\(((?:\/|https:\/\/(?:www\.)?zardui\.com)[^)\s]*)\)/g)) {
      checkLink(`docs/${f}`, route, href, { anchors: false });
    }
  }
}

const unique = [...new Set(problems)];
if (unique.length) {
  console.error(`check:links found ${unique.length} problem(s) in ${relative(ROOT, BROWSER)}:\n`);
  for (const p of unique) console.error(`  ${p}`);
  process.exit(1);
}
console.log(
  `check:links: ${pages.length} pages, llms.txt and the docs Markdown have no broken internal link or anchor.`,
);
