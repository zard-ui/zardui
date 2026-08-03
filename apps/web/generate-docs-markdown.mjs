/**
 * Generates a raw Markdown file for every static documentation page, mirroring
 * its URL: `/docs/<page>` -> `public/docs/<page>.md` (like the component `.md`,
 * served as a static asset — navigable in dev and prod, like llms.txt).
 *
 * Unlike components, doc pages have no structured data source — their prose lives
 * in Angular templates. So this reads the prerendered HTML (post-build) and
 * converts the page content to Markdown. Runs AFTER `nx build`.
 *
 *   node apps/web/generate-docs-markdown.mjs
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { Window } from 'happy-dom';

const domParser = new new Window().DOMParser();

const BROWSER_DOCS = 'dist/apps/web/browser/docs';
const PUBLIC_DOCS = 'apps/web/public/docs';

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
function skipEl(el) {
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

function inlineText(node) {
  let out = '';
  for (const child of node.childNodes) {
    if (child.nodeType === 3) {
      out += child.textContent.replace(/\s+/g, ' ');
    } else if (child.nodeType === 1) {
      const tag = child.tagName;
      if (skipEl(child)) continue;
      const inner = inlineText(child);
      if (!inner.trim() && tag !== 'BR') continue;
      if (tag === 'A') {
        const href = child.getAttribute('href') || '';
        out += href && !href.startsWith('#') ? `[${inner.trim()}](${href})` : inner;
      } else if (tag === 'STRONG' || tag === 'B') {
        out += `**${inner.trim()}**`;
      } else if (tag === 'EM' || tag === 'I') {
        out += `*${inner.trim()}*`;
      } else if (tag === 'CODE') {
        out += `\`${inner.trim()}\``;
      } else if (tag === 'BR') {
        out += '\n';
      } else {
        // Insert a space at element boundaries that would otherwise merge two words
        // (e.g. adjacent card title/description spans → "DiscordJoin", "customizationsKeep").
        const needsSpace = /\w$/.test(out) && /^\w/.test(inner);
        out += (needsSpace ? ' ' : '') + inner;
      }
    }
  }
  return out;
}

function blockMarkdown(node, out) {
  for (const child of node.childNodes) {
    if (child.nodeType === 3) {
      const text = child.textContent.replace(/\s+/g, ' ').trim();
      if (text) out.push(text);
      continue;
    }
    if (child.nodeType !== 1) continue;
    const tag = child.tagName;
    if (skipEl(child)) continue;

    if (/^H[1-6]$/.test(tag)) {
      const text = inlineText(child).trim();
      if (text) out.push(`${'#'.repeat(Number(tag[1]))} ${text}`);
    } else if (tag === 'P') {
      const text = inlineText(child).trim();
      if (text) out.push(text);
    } else if (tag === 'PRE') {
      const code = child.textContent.replace(/\n+$/, '');
      if (code.trim()) out.push('```\n' + code + '\n```');
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
    } else if (
      /bg-code|code-tabs-wrapper/.test(child.getAttribute('class') || '') &&
      child.querySelectorAll('pre').length >= 2
    ) {
      // Code-tabs (npm/pnpm/yarn/bun) — two implementations (`bg-code` on doc pages,
      // `code-tabs-wrapper` on install steps). Keep only the first variant, not all four.
      const code = child.querySelector('pre').textContent.replace(/\n+$/, '');
      if (code.trim()) out.push('```\n' + code + '\n```');
    } else if ((child.getAttribute('class') || '').includes('bg-code') && !child.querySelector('pre')) {
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
        else out.push(isButton ? `[${text}](${href})` : `- [${text}](${href})`);
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

function convertPage(html, slug) {
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
function collectDocPaths(dir, base = '') {
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

function generate() {
  if (!existsSync(BROWSER_DOCS)) {
    console.error(`❌ ${BROWSER_DOCS} not found — run the build first.`);
    process.exit(1);
  }

  let count = 0;
  const skipped = [];

  for (const relPath of collectDocPaths(BROWSER_DOCS)) {
    const html = readFileSync(join(BROWSER_DOCS, relPath, 'index.html'), 'utf-8');
    const markdown = convertPage(html, relPath.split('/').pop());
    if (!markdown) {
      skipped.push(relPath);
      continue;
    }
    // Committed source (served in dev + next build) and the current build output.
    for (const file of [join(PUBLIC_DOCS, `${relPath}.md`), join(BROWSER_DOCS, `${relPath}.md`)]) {
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
  if (skipped.length) console.warn(`⚠️  Skipped (no content extracted): ${skipped.join(', ')}`);
}

generate();
