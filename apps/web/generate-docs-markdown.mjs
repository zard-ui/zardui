/**
 * Generates a raw Markdown file for every static documentation page, mirroring
 * its URL: `/docs/<page>` -> `public/docs/<page>.md` (like the component `.md`,
 * served as a static asset — navigable in dev and prod, like llms.txt).
 *
 * Unlike components, doc pages have no structured data source — their prose lives
 * in Angular templates. So this reads the prerendered HTML (post-build) and
 * converts the page content to Markdown. Runs AFTER `nx build`.
 *
 *   node apps/web/generate-docs-markdown.mjs [--volatile]
 *
 * Pages in VOLATILE carry data fetched from GitHub while prerendering (sponsors,
 * contributors), so a build with no network or a rate-limited token renders them degraded.
 * The committed `.md` of those pages is only rewritten with `--volatile`.
 *
 * `apps/web/check-docs-markdown.mjs` reuses `convertPage`/`collectDocPaths` to verify the
 * committed files against the prerendered pages.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { Window } from 'happy-dom';

const domParser = new new Window().DOMParser();

export const BROWSER_DOCS = 'dist/apps/web/browser/docs';
export const PUBLIC_DOCS = 'apps/web/public/docs';

/** Pages whose content tracks the GitHub API and not the branch. */
export const VOLATILE = new Set(['about', 'changelog']);

// Chrome / non-content elements to drop before converting.
// `Z-AVATAR` renders an initials fallback (`<span>HE</span>`) next to the image while it
// loads, which is decorative — without it the person's own name/username is the link text.
const SKIP = new Set([
  'SCRIPT',
  'STYLE',
  'SVG',
  'BUTTON',
  'NAV',
  'Z-ASSIST',
  'Z-AVATAR',
  'Z-DYNAMIC-ANCHOR',
  'NG-ICON',
]);
const INLINE = new Set(['A', 'STRONG', 'B', 'EM', 'I', 'CODE', 'SPAN', 'SMALL', 'LABEL']);

/**
 * Whether to drop an element entirely. `sr-only` is visually-hidden content: the
 * inactive CLI/Manual tab (duplicate steps) and screen-reader-only figcaptions
 * (duplicate code filenames) both carry it, so skipping it dedupes both.
 */
export function skipEl(el) {
  // `data-slot="preview"` is a live demo rendered next to its code: UI chrome, not documentation.
  if (el.getAttribute('data-slot') === 'preview') return true;
  return SKIP.has(el.tagName) || (el.getAttribute('class') || '').split(/\s+/).includes('sr-only');
}

/**
 * Reconstruct a terminal/CLI block (a `bg-code` styled div, not a real `<pre>`)
 * as fenced code by collecting each leaf element's text as one line.
 */
function terminalCode(el) {
  const lines = [];
  for (const leaf of el.querySelectorAll('*')) {
    if (leaf.children.length === 0) {
      const text = leaf.textContent.replace(/\s+/g, ' ').trim();
      if (text) lines.push(text);
    }
  }
  // Merge a lone shell prompt ("$"/">") with the command on the next line.
  const merged = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^[$>]$/.test(lines[i]) && i + 1 < lines.length) {
      merged.push(`${lines[i]} ${lines[i + 1]}`);
      i++;
    } else {
      merged.push(lines[i]);
    }
  }
  return merged.length ? '```bash\n' + merged.join('\n') + '\n```' : '';
}

/**
 * Detects the install-page CLI/Manual tab switcher: a container with a <nav> of
 * short-label buttons followed by sibling `transition-all` <section> panels. Both
 * panels are in the DOM (the inactive one is `sr-only`); we keep both and label
 * each with its tab name so the `.md` documents every install method.
 */
function tabContainer(el) {
  const nav = [...el.children].find(c => c.tagName === 'NAV');
  const sections = [...el.children].filter(
    c => c.tagName === 'SECTION' && (c.getAttribute('class') || '').includes('transition-all'),
  );
  if (!nav || sections.length < 2) return null;

  const buttons = [...nav.querySelectorAll('button')]
    .map(b => ({
      label: b.textContent.replace(/\s+/g, ' ').trim(),
      active: (b.getAttribute('class') || '').split(/\s+/).includes('font-semibold'),
    }))
    .filter(b => b.label);
  if (buttons.length < 2) return null;

  // Tabs that name their panel (`aria-controls`), or hide the inactive one without `sr-only`
  // (dark mode: `invisible h-0`): match by id, then by position.
  const controlled = [...nav.querySelectorAll('button')]
    .filter(b => b.textContent.trim())
    .map(b => ({
      label: b.textContent.replace(/\s+/g, ' ').trim(),
      section: sections.find(section => section.id && section.id === b.getAttribute('aria-controls')),
    }));
  if (controlled.length === buttons.length && controlled.every(entry => entry.section)) return controlled;
  if (
    sections.length === buttons.length &&
    !sections.some(s => (s.getAttribute('class') || '').split(/\s+/).includes('sr-only'))
  ) {
    return buttons.map((b, i) => ({ label: b.label, section: sections[i] }));
  }

  const isSrOnly = section => (section.getAttribute('class') || '').split(/\s+/).includes('sr-only');
  const activeLabel = (buttons.find(b => b.active) || buttons[0]).label;
  const activeSection = sections.find(section => !isSrOnly(section));
  const inactiveSections = sections.filter(isSrOnly);
  let inactive = 0;

  // Emit panels in tab (button) order, so the default/recommended tab comes first.
  return buttons
    .map(b => ({ label: b.label, section: b.label === activeLabel ? activeSection : inactiveSections[inactive++] }))
    .filter(entry => entry.section);
}

/** Custom elements that wrap one or more `<pre>` blocks (single block, tabs, expandable). */
const CODE_CONTAINERS = new Set(['Z-CODE-BLOCK', 'Z-CODE-DISPLAY', 'Z-CODE-TABS', 'Z-EXPANDABLE-CODE']);
/** Tab labels of a code-tabs switcher that only vary the package manager (same command, four spellings). */
export const PACKAGE_MANAGERS = new Set(['npm', 'pnpm', 'yarn', 'bun']);

function fence(code) {
  const text = code.replace(/\n+$/, '');
  if (!text.trim()) return '';
  // A fence longer than any backtick run inside the code, so embedded fences cannot close it.
  const longest = Math.max(2, ...[...text.matchAll(/`+/g)].map(m => m[0].length));
  const ticks = '`'.repeat(longest + 1);
  return `${ticks}\n${text}\n${ticks}`;
}

/**
 * Converts a code element (`z-code-block`, `z-code-display`, `z-code-tabs`,
 * `z-expandable-code`) to Markdown blocks, labelling every block with its file
 * name (the header title) or its tab name, so the reader knows which file a block
 * belongs to. Package-manager tabs (npm/pnpm/yarn/bun) keep only the first variant.
 */
function codeMarkdown(el, out) {
  const pres = [...el.querySelectorAll('pre')];
  if (!pres.length) return;

  const tabs = [...el.querySelectorAll('[role="tab"]')].map(t => t.textContent.replace(/\s+/g, ' ').trim());
  const panels = [...el.querySelectorAll('[role="tabpanel"]')];
  if (tabs.length >= 2 && panels.length === tabs.length) {
    const onlyPackageManagers = tabs.every(label => PACKAGE_MANAGERS.has(label.toLowerCase()));
    const count = onlyPackageManagers ? 1 : tabs.length;
    for (let i = 0; i < count; i++) {
      const pre = panels[i].querySelector('pre');
      const block = pre ? fence(pre.textContent) : '';
      if (!block) continue;
      if (!onlyPackageManagers) out.push(`**${tabs[i]}**`);
      out.push(block);
    }
    return;
  }

  // File name: the first text in the header that is outside the code and the controls.
  const title = [...el.querySelectorAll('span')]
    .filter(span => !span.closest('pre, button, z-copy-button'))
    .map(span => span.textContent.replace(/\s+/g, ' ').trim())
    .find(Boolean);
  for (const pre of pres) {
    const block = fence(pre.textContent);
    if (!block) continue;
    if (title && pres.length === 1) out.push(`**${title}**`);
    out.push(block);
  }
}

/** Convert an HTML <table> (e.g. a component's API reference) to a Markdown table. */
function convertTable(table) {
  // Escape the backslash together with the pipe: escaping `|` alone would turn a literal
  // `\` in the cell into the escape for our own `\|`, leaking a column separator.
  const cell = tr =>
    [...tr.children]
      .filter(c => /^(TH|TD)$/.test(c.tagName))
      .map(c => inlineText(c).replace(/[\\|]/g, '\\$&').replace(/\s+/g, ' ').trim());
  const rows = [...table.querySelectorAll('tr')].map(cell).filter(r => r.length);
  if (rows.length < 2) return '';

  const width = Math.max(...rows.map(r => r.length));
  const pad = r => [...r, ...Array(width - r.length).fill('')];
  const [header, ...body] = rows;

  return [
    `| ${pad(header).join(' | ')} |`,
    `| ${Array(width).fill('---').join(' | ')} |`,
    ...body.map(r => `| ${pad(r).join(' | ')} |`),
  ].join('\n');
}

const BLOCKISH = new Set([
  'DIV',
  'P',
  'SECTION',
  'ARTICLE',
  'LI',
  'DL',
  'DD',
  'UL',
  'OL',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
]);

function inlineText(node) {
  let out = '';
  // True right after an element, until a text node (which carries its own whitespace) follows.
  let afterElement = false;
  for (const child of node.childNodes) {
    if (child.nodeType === 3) {
      out += child.textContent.replace(/\s+/g, ' ');
      afterElement = false;
    } else if (child.nodeType === 1) {
      const tag = child.tagName;
      if (skipEl(child)) continue;
      const inner = inlineText(child);
      if (!inner.trim() && tag !== 'BR') continue;
      let piece;
      if (tag === 'A') {
        const href = child.getAttribute('href') || '';
        piece = href && !href.startsWith('#') ? `[${inner.trim()}](${href})` : inner;
      } else if (tag === 'STRONG' || tag === 'B') {
        piece = `**${inner.trim()}**`;
      } else if (tag === 'EM' || tag === 'I') {
        piece = `*${inner.trim()}*`;
      } else if (tag === 'CODE') {
        piece = `\`${inner.trim()}\``;
      } else if (tag === 'BR') {
        piece = '\n';
      } else if (tag === 'DT') {
        piece = ` **${inner.trim()}** `;
      } else if (BLOCKISH.has(tag)) {
        // Blocks nested in a list item or table cell: keep them apart, inline.
        piece = ` ${inner.trim()} `;
      } else {
        piece = inner;
      }
      // Two elements with no text between them (`<strong>Run the CLI.</strong><code>x</code>`,
      // adjacent card title/description spans, a row of `<code>` chips) would be glued
      // together. Separate chips with a comma, everything else with a space.
      if (afterElement && tag !== 'BR' && !/\s$/.test(out) && !/^\s/.test(piece)) {
        if (tag === 'CODE' && out.endsWith('`')) out += ', ';
        else if (/[\w`*\])]$/.test(out) && /^[\w`*[]/.test(piece)) out += ' ';
      }
      // A label span glued to the end of a sentence ("…color.<span>Without it</span>").
      else if ((tag === 'SPAN' || tag === 'SMALL') && /[.!?:;,]$/.test(out) && /^[\w`*[]/.test(piece)) out += ' ';
      out += piece;
      afterElement = tag !== 'BR';
    }
  }
  return out.replace(/ {2,}/g, ' ');
}

/** Elements that start a new block: an inline wrapper containing one is walked as a container. */
const BLOCK_SELECTOR =
  'p,pre,ul,ol,dl,table,h1,h2,h3,h4,h5,h6,div,section,article,blockquote,hr,z-code-block,z-code-tabs,z-code-display';

function isInlineFlow(el) {
  if (!INLINE.has(el.tagName) || el.querySelector(BLOCK_SELECTOR)) return false;
  // A link on its own is a block-level card/CTA (a list entry); inside a sentence it is inline.
  if (el.tagName === 'A') {
    const neighbour = n => n && n.nodeType === 3 && n.textContent.trim();
    return Boolean(neighbour(el.previousSibling) || neighbour(el.nextSibling));
  }
  return true;
}

/**
 * Whether an inline element continues the current paragraph. Sibling `<span>`s with no
 * running text around them (card title + description, a row of goals) are separate
 * lines, not one sentence.
 */
function joinsRun(el, run) {
  if (!['SPAN', 'SMALL', 'LABEL'].includes(el.tagName)) return true;
  if (run.some(n => (n.nodeType === 3 ? n.textContent.trim() : !['SPAN', 'SMALL', 'LABEL'].includes(n.tagName))))
    return true;
  let next = el.nextSibling;
  while (next && next.nodeType === 3 && !next.textContent.trim()) next = next.nextSibling;
  if (!next) return false;
  return next.nodeType === 3 || !['SPAN', 'SMALL', 'LABEL'].includes(next.tagName);
}

/** A link styled as a button is an action, not a list entry. */
function isButtonLink(el) {
  return el.tagName === 'A' && el.getAttribute('data-slot') === 'button';
}

function blockMarkdown(node, out) {
  // Text and inline elements that sit directly in a container (`<dd>text <code>x</code> more</dd>`)
  // are one paragraph: collect the run and flush it as a single block.
  let run = [];
  const flush = () => {
    if (!run.length) return;
    const holder = { childNodes: run };
    const text = inlineText(holder).replace(/\s+/g, ' ').trim();
    run = [];
    if (text) out.push(text);
  };

  for (const child of node.childNodes) {
    if (child.nodeType === 3) {
      run.push(child);
      continue;
    }
    if (child.nodeType !== 1) continue;
    if (skipEl(child)) continue;
    if (isInlineFlow(child) && !isButtonLink(child) && joinsRun(child, run)) {
      run.push(child);
      continue;
    }
    flush();
    blockChild(child, out);
  }
  flush();
}

function blockChild(child, out) {
  {
    const tag = child.tagName;

    if (/^H[1-6]$/.test(tag)) {
      const text = inlineText(child).trim();
      if (text) out.push(`${'#'.repeat(Number(tag[1]))} ${text}`);
    } else if (tag === 'P') {
      const text = inlineText(child).trim();
      if (text) out.push(text);
    } else if (tag === 'PRE') {
      const block = fence(child.textContent);
      if (block) out.push(block);
    } else if (tag === 'UL' || tag === 'OL') {
      const items = [];
      let i = 1;
      for (const li of child.children) {
        if (li.tagName !== 'LI') continue;
        const text = inlineText(li).trim();
        if (text) items.push(`${tag === 'OL' ? `${i++}.` : '-'} ${text}`);
      }
      if (items.length) out.push(items.join('\n'));
    } else if (tag === 'TABLE') {
      const table = convertTable(child);
      if (table) out.push(table);
    } else if (tag === 'HR') {
      out.push('---');
    } else if (tag === 'BLOCKQUOTE') {
      const text = inlineText(child).trim();
      if (text) {
        out.push(
          text
            .split('\n')
            .map(line => `> ${line}`)
            .join('\n'),
        );
      }
    } else if (CODE_CONTAINERS.has(tag)) {
      codeMarkdown(child, out);
    } else if (tag === 'DL') {
      // Definition list (e.g. troubleshooting): the term as a bold line, then its definition.
      for (const part of child.querySelectorAll('dt, dd')) {
        const text = inlineText(part).replace(/\s+/g, ' ').trim();
        if (text) out.push(part.tagName === 'DT' ? `**${text}**` : text);
      }
    } else if (/bg-code|code-tabs-wrapper/.test(child.getAttribute('class') || '') && child.querySelector('pre')) {
      // Bare code UI without a custom-element wrapper: same handling.
      codeMarkdown(child, out);
    } else if ((child.getAttribute('class') || '').includes('bg-code')) {
      // Terminal-style code UI (styled div, not a <pre>) — render as fenced code.
      const code = terminalCode(child);
      if (code) out.push(code);
    } else if (tag === 'A') {
      // Block-level link (component-index cards, CTAs, block cards). For rich cards
      // (image + title + description), the heading alone makes a clean label.
      const href = child.getAttribute('href') || '';
      const heading = child.querySelector('h1,h2,h3,h4,h5,h6');
      const text = (heading ? heading.textContent : inlineText(child)).replace(/\s+/g, ' ').trim();
      // A link styled as a button is an action, not a list entry — emitting it as a
      // bullet would append it to whatever list precedes it (e.g. the sponsors list).
      const isButton = child.getAttribute('data-slot') === 'button';
      if (text) {
        if (!href || href.startsWith('#')) out.push(text);
        else if (isButton) {
          // Consecutive action links ("Add to Cursor", "Add to VS Code") share one line.
          const link = `[${text}](${href})`;
          if (out.buttonRun === out.length - 1 && out.length) out[out.length - 1] += ` · ${link}`;
          else out.push(link);
          out.buttonRun = out.length - 1;
        } else out.push(`- [${text}](${href})`);
      }
    } else if (INLINE.has(tag)) {
      const text = inlineText(child).trim();
      if (text) out.push(text);
    } else {
      const tabs = tabContainer(child);
      if (tabs) {
        for (const { section, label } of tabs) {
          if (label) out.push(`## ${label}`);
          const panel = [];
          blockMarkdown(section, panel);
          // Demote the panel's own headings one level so steps nest under the tab.
          // No `m` flag: only whole-block headings match, never `#` inside code.
          out.push(...panel.map(block => block.replace(/^(#{1,5}) /, '#$1 ')));
        }
      } else {
        blockMarkdown(child, out);
      }
    }
  }
}

/** Collapse 3+ newlines and duplicate blank blocks the walker may emit. */
function tidy(markdown) {
  return (
    markdown
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+\n/g, '\n')
      // Tighten loose bullet lists: drop blank lines between consecutive "- " items.
      .replace(/^(-\s.+)\n\n(?=-\s)/gm, '$1\n')
      .trim()
  );
}

export function convertPage(html, slug) {
  const document = domParser.parseFromString(html, 'text/html');
  const content = document.querySelector('z-content');
  if (!content) return null;

  const blocks = [];
  blockMarkdown(content, blocks);
  // Drop noise blocks.
  const kept = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    // Step-number badge: a lone digit right before a step heading. The heading
    // check keeps legitimate standalone numbers (e.g. the blocks page stats).
    if (/^\d{1,2}$/.test(block) && /^#{1,6}\s/.test(blocks[i + 1] || '')) continue;
    // Lone decorative glyph (note icon "ℹ", bullet "•") — excludes digits.
    if (block.length <= 2 && !/[a-z0-9]/i.test(block)) continue;
    // Prerender-time fetch errors that leak into the page (e.g. the changelog).
    if (/^Error loading markdown/.test(block)) continue;
    // Drop consecutive duplicate lines (badge + label rendering the same text,
    // e.g. the roadmap's "Completed"/"Completed"). Never dedupes code fences.
    if (kept.length && block === kept[kept.length - 1] && !block.startsWith('```')) continue;
    kept.push(block);
  }
  const body = tidy(kept.join('\n\n'));
  if (!body) return null;

  // The first heading + paragraph are the page title + description.
  const titleMatch = body.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : slug;
  const descMatch = body.match(/^#\s+.+\n+([^#\n].*)$/m);
  const description = descMatch ? descMatch[1].trim() : '';

  const frontmatter = `---\ntitle: ${title}\ndescription: ${description}\n---`;
  return `${frontmatter}\n\n${body}\n`;
}

/**
 * Recursively collects every prerendered doc page path under `docs/`, e.g.
 * "theming", "components" (the list page), "installation/angular". Individual
 * component pages (`components/<name>`) are skipped — they get a richer `.md`
 * from generate-markdown.mts.
 */
export function collectDocPaths(dir, base = '') {
  const paths = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (rel.startsWith('components/')) continue; // component pages: handled elsewhere
    const full = join(dir, entry.name);
    if (existsSync(join(full, 'index.html'))) paths.push(rel);
    paths.push(...collectDocPaths(full, rel));
  }
  return paths;
}

function generate({ volatile = false } = {}) {
  if (!existsSync(BROWSER_DOCS)) {
    console.error(`❌ ${BROWSER_DOCS} not found — run the build first.`);
    process.exit(1);
  }

  let count = 0;
  const skipped = [];
  const kept = [];

  for (const relPath of collectDocPaths(BROWSER_DOCS)) {
    const html = readFileSync(join(BROWSER_DOCS, relPath, 'index.html'), 'utf-8');
    const markdown = convertPage(html, relPath.split('/').pop());
    if (!markdown) {
      skipped.push(relPath);
      continue;
    }
    // Committed source (served in dev + next build) and the current build output.
    const files = [join(PUBLIC_DOCS, `${relPath}.md`), join(BROWSER_DOCS, `${relPath}.md`)];
    if (VOLATILE.has(relPath) && !volatile && existsSync(files[0])) {
      // Keep the committed file; the build output serves it as is.
      mkdirSync(dirname(files[1]), { recursive: true });
      writeFileSync(files[1], readFileSync(files[0], 'utf-8'), 'utf-8');
      kept.push(relPath);
      continue;
    }
    for (const file of files) {
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, markdown, 'utf-8');
    }
    count++;
  }

  // Recover component pages whose serializer (generate-markdown.mts) produced only a
  // minimal fallback stub — loadData failed under tsx (parameter decorators, circular
  // init). Convert those from their prerendered HTML instead so nothing stays a stub.
  const componentsDir = join(BROWSER_DOCS, 'components');
  const recovered = [];
  if (existsSync(componentsDir)) {
    for (const entry of readdirSync(componentsDir, { withFileTypes: true })) {
      const htmlPath = join(componentsDir, entry.name, 'index.html');
      if (!entry.isDirectory() || !existsSync(htmlPath)) continue;
      const mdPath = join(PUBLIC_DOCS, 'components', `${entry.name}.md`);
      // Keep the richer serializer output; only replace fallback stubs.
      if (existsSync(mdPath) && readFileSync(mdPath, 'utf-8').includes('## Installation')) continue;
      const raw = convertPage(readFileSync(htmlPath, 'utf-8'), entry.name);
      if (!raw) continue;
      // Align with the serializer format: title-case the name, keep a single H1.
      const title = entry.name
        .split(/[-_]/)
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      const markdown = raw
        .replace(/^title: .+$/m, `title: ${title}`)
        .replace(/^# .+$/m, `# ${title}`)
        .replace(/^# API Reference$/m, '## API Reference');
      for (const file of [mdPath, join(componentsDir, `${entry.name}.md`)]) {
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, markdown, 'utf-8');
      }
      recovered.push(entry.name);
    }
  }

  console.log(`✅ Wrote ${count} documentation markdown files to ${PUBLIC_DOCS}`);
  if (recovered.length)
    console.log(`↳ Recovered ${recovered.length} component stub(s) from HTML: ${recovered.join(', ')}`);
  if (kept.length)
    console.log(`↳ Kept the committed file of volatile page(s) (use --volatile to rewrite): ${kept.join(', ')}`);
  if (skipped.length) console.warn(`⚠️  Skipped (no content extracted): ${skipped.join(', ')}`);
}

// Run only when invoked directly, not when imported by the check script.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  generate({ volatile: process.argv.includes('--volatile') });
}
