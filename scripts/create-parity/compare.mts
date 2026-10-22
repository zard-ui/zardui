/**
 * create-parity / compare — pixel comparison between what `/create` shows and what a project made by `zard-cli create`
 * renders, for the same preset, the same canvases and the same component examples.
 *
 *   npx tsx scripts/create-parity/compare.mts --projects C:/zq/t92 --out C:/zq/t92/out \
 *       [--only nova,mira] [--items preview-01,component:button] [--themes light,dark] [--base http://localhost:4201]
 *
 * For each project (a directory with `components.json` that `prepare.mts` already built):
 *   - serves `dist/<name>/browser` statically (SPA fallback);
 *   - opens `<base>/create/preview/<item>?preset=<code>` and the project's `/parity/<item>` at 1280x900;
 *   - screenshots every canvas card (`z-preview-0N-*`) or the example, with animations off, and diffs them;
 *   - for the menu surfaces (dropdown, select, combobox, context menu) also opens the first one and diffs the viewport.
 * A pair "differs" when more than `--tolerance` percent (default 0.2) of its pixels do; cards with an ECharts chart
 * get `--chart-tolerance` (default 5): a canvas drawn by an animation, with a tooltip that follows state.
 * Offenders are written to `--out` as `project | canvas | diff` images. Exit code 1 when any pair differs.
 *
 * A project with `"rtl": true` is shown with `dir="rtl"` on the canvas too (the preview has no RTL switch of its own).
 */
import { createServer, type Server } from 'node:http';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

import { chromium, type Browser, type Page } from 'playwright';
import sharp from 'sharp';

const argv = process.argv.slice(2);
const flag = (name: string, fallback?: string): string | undefined => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : fallback;
};

const projectsDir = resolve(flag('projects') ?? '.');
const outDir = resolve(flag('out') ?? join(projectsDir, 'parity-out'));
const base = flag('base', 'http://localhost:4201')!;
const tolerance = Number(flag('tolerance', '0.2'));
const only = flag('only')?.split(',');
const themes = (flag('themes', 'light,dark') ?? '').split(',');
const itemsFlag = flag('items')?.split(',');
const portBase = Number(flag('port', '4601'));
const chartTolerance = Number(flag('chart-tolerance', '5'));
const settleMs = Number(flag('settle', '4000'));

const OVERLAYS: Record<string, string> = {
  'component:dropdown-menu': '[data-slot="dropdown-menu-trigger"], [aria-haspopup="menu"]',
  'component:select': '[data-slot="select-trigger"], [role="combobox"]',
  'component:combobox': '[data-slot="combobox-trigger"], [role="combobox"]',
  'component:context-menu': '[data-slot="context-menu-trigger"]',
};

const KILL_MOTION = `*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; scroll-behavior: auto !important; }
* { content-visibility: visible !important; }
.font-mono, code, kbd, pre { font-family: Consolas, 'Courier New', monospace !important; }
:root { --font-mono: monospace; } /* the docs ship Geist Mono, a project has no mono face unless it adds one: not what is under test */
html, body { overflow: visible !important; height: auto !important; }
main[data-item] { height: auto !important; overflow: visible !important; }
*:has([data-slot="capture-target"]) { overflow: visible !important; contain: none !important; }`;

function serve(dir: string, port: number): Server {
  const types: Record<string, string> = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.png': 'image/png',
  };
  const server = createServer((req, res) => {
    const path = decodeURIComponent((req.url ?? '/').split('?')[0]);
    let file = join(dir, path);
    if (!file.startsWith(dir) || !existsSync(file) || statSync(file).isDirectory()) file = join(dir, 'index.html');
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
    res.end(readFileSync(file));
  });
  server.listen(port);
  return server;
}

/** Cards with no box at all (nothing to look at): listed in the report, never silently dropped. */
const skipped = new Set<string>();

/** Drawn by a timer from random input, so two renders are never the same frame: not comparable pixel by pixel. */
const NON_DETERMINISTIC = new Set(['z-preview-02-live-waveform']);

interface Shot {
  key: string;
  png: Buffer;
  /** Holds an ECharts chart (animated canvas, tooltip that follows state): it gets a wider budget. */
  chart?: boolean;
}

async function settle(page: Page, dark: boolean, rtl: boolean): Promise<void> {
  await page.addStyleTag({ content: KILL_MOTION });
  await page.evaluate(
    ([isDark, isRtl]) => {
      document.documentElement.classList.toggle('dark', isDark);
      if (isRtl) document.documentElement.setAttribute('dir', 'rtl');
    },
    [dark, rtl],
  );
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await page.waitForTimeout(settleMs);
}

/** A clip of the full page, not an element screenshot: no waiting for a "stable" box on canvases that keep moving. */
async function clipShot(page: Page, selector: string): Promise<Buffer> {
  const box = await page.evaluate(sel => {
    const el = document.querySelector<HTMLElement>(sel)!;
    // The two pages lay the card out at different fractional offsets (the cards above it differ by sub-pixels), and
    // Chrome snaps text to the device grid per box: put the card on whole pixels so that is not read as a difference.
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    const before = el.getBoundingClientRect();
    el.style.left = `${Math.round(before.x + scrollX) - (before.x + scrollX)}px`;
    el.style.top = `${Math.round(before.y + scrollY) - (before.y + scrollY)}px`;
    const r = el.getBoundingClientRect();
    return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height };
  }, selector);
  return page.screenshot({ fullPage: true, clip: box, animations: 'disabled', timeout: 120000 });
}

async function capture(page: Page, url: string, item: string, dark: boolean, rtl: boolean): Promise<Shot[]> {
  // Charts draw once they are on screen, so a canvas is shown in a viewport as big as the canvas: no scrolling around.
  await page.setViewportSize(
    item.startsWith('preview-') ? { width: 3200, height: 3200 } : { width: 1280, height: 900 },
  );
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
  // No hover state from wherever the pointer was left: parked in the corner before anything draws (a chart opens its
  // default tooltip once it exists and closes it on a pointer leaving, so the pointer must not move after that).
  await page.mouse.move(page.viewportSize()!.width - 1, page.viewportSize()!.height - 1);
  await page.waitForSelector('main[data-item] > *', { timeout: 120000 });
  await page.waitForFunction(() => !document.documentElement.hasAttribute('data-design-pending'), null, {
    timeout: 30000,
  });
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await settle(page, dark, rtl);

  const keys: string[] = await page.evaluate(
    ([canvas, which, nondeterministic]) => {
      const found: Element[] = canvas
        ? [...document.querySelectorAll('*')].filter(
            el =>
              /^z-preview-0[12]-/.test(el.localName) &&
              !!el.closest(`[data-canvas="${which}"]`) &&
              !(el.parentElement && /^z-preview-0[12]-/.test(el.parentElement.localName)),
          )
        : [document.querySelector('main[data-item] > *:not([hidden])')!];
      const seen = new Map<string, number>();
      return found.map(el => {
        const n = (seen.get(el.localName) ?? 0) + 1;
        seen.set(el.localName, n);
        const key = canvas ? `${el.localName}#${n}` : 'example';
        // A custom element is inline by default: when it has no box of its own, its first child is the card.
        const target = el.getBoundingClientRect().width > 0 ? el : (el.firstElementChild ?? el);
        if (target.getBoundingClientRect().width === 0 || nondeterministic.includes(el.localName)) return `!${key}`;
        target.setAttribute('data-parity-key', key);
        return key;
      });
    },
    [item.startsWith('preview-'), item, [...NON_DETERMINISTIC]] as const,
  );

  const shots: Shot[] = [];
  for (const key of keys) {
    if (key.startsWith('!')) {
      skipped.add(key.slice(1));
      continue;
    }
    const png = await clipShot(page, `[data-parity-key="${key}"]`);
    const chart = await page.evaluate(
      sel =>
        !!document.querySelector(sel)?.querySelector('[data-slot="chart"]') ||
        document.querySelector(sel)?.matches('[data-slot="chart"]'),
      `[data-parity-key="${key}"]`,
    );
    shots.push({ key, png, chart: !!chart });
  }

  const trigger = OVERLAYS[item];
  if (trigger) {
    await page.evaluate(() => window.scrollTo(0, 0));
    const el = page.locator(trigger).first();
    if (await el.count()) {
      await el.scrollIntoViewIfNeeded();
      await el.click({ button: item === 'component:context-menu' ? 'right' : 'left' });
      await page.waitForTimeout(500);
      // Only the overlay matters: its pane, which lives under <body>, outside the app.
      const pane = page.locator('.cdk-overlay-pane').first();
      if (await pane.count()) shots.push({ key: 'overlay', png: await pane.screenshot({ animations: 'disabled' }) });
      await page.keyboard.press('Escape');
    }
  }
  return shots;
}

/** pixelmatch's colour distance (YIQ), without the anti-aliasing heuristics. */
function delta(a: Uint8Array, b: Uint8Array, i: number): number {
  const blend = (c: number, alpha: number): number => 255 + (c - 255) * alpha;
  const a1 = a[i + 3] / 255;
  const a2 = b[i + 3] / 255;
  const r1 = blend(a[i], a1),
    g1 = blend(a[i + 1], a1),
    b1 = blend(a[i + 2], a1);
  const r2 = blend(b[i], a2),
    g2 = blend(b[i + 1], a2),
    b2 = blend(b[i + 2], a2);
  const y = (r1 - r2) * 0.29889531 + (g1 - g2) * 0.58662247 + (b1 - b2) * 0.11448223;
  const iq = (r1 - r2) * 0.59597799 - (g1 - g2) * 0.2741761 - (b1 - b2) * 0.32180189;
  const q = (r1 - r2) * 0.21147017 - (g1 - g2) * 0.52261711 + (b1 - b2) * 0.31114694;
  return 0.5053 * y * y + 0.299 * iq * iq + 0.1957 * q * q;
}

async function diff(a: Buffer, b: Buffer): Promise<{ percent: number; sizes: string; image: Buffer }> {
  const ia = sharp(a).ensureAlpha();
  const ib = sharp(b).ensureAlpha();
  const ma = await ia.metadata();
  const mb = await ib.metadata();
  const w = Math.max(ma.width!, mb.width!);
  const h = Math.max(ma.height!, mb.height!);
  const pad = async (img: sharp.Sharp): Promise<Buffer> =>
    img
      .extend({
        right: w - (await img.metadata()).width!,
        bottom: h - (await img.metadata()).height!,
        background: { r: 255, g: 0, b: 255, alpha: 1 },
      })
      .raw()
      .toBuffer();
  const [ra, rb] = [await pad(sharp(await ia.png().toBuffer())), await pad(sharp(await ib.png().toBuffer()))];
  const out = Buffer.alloc(w * h * 4);
  const max = 35215 * 0.1 * 0.1;
  let count = 0;
  for (let i = 0; i < w * h * 4; i += 4) {
    if (delta(ra, rb, i) > max) {
      count++;
      out[i] = 255;
      out[i + 1] = 0;
      out[i + 2] = 0;
      out[i + 3] = 255;
    } else {
      out[i] = out[i + 1] = out[i + 2] = ra[i] * 0.3 + 178;
      out[i + 3] = 255;
    }
  }
  const image = await sharp({ create: { width: w * 3, height: h, channels: 4, background: '#fff' } })
    .composite([
      {
        input: await sharp(ra, { raw: { width: w, height: h, channels: 4 } })
          .png()
          .toBuffer(),
        left: 0,
        top: 0,
      },
      {
        input: await sharp(rb, { raw: { width: w, height: h, channels: 4 } })
          .png()
          .toBuffer(),
        left: w,
        top: 0,
      },
      {
        input: await sharp(out, { raw: { width: w, height: h, channels: 4 } })
          .png()
          .toBuffer(),
        left: w * 2,
        top: 0,
      },
    ])
    .png()
    .toBuffer();
  return {
    percent: (count / (w * h)) * 100,
    sizes: `${ma.width}x${ma.height} vs ${mb.width}x${mb.height}`,
    image,
  };
}

const slug = (s: string): string => s.replaceAll(/[^\w.-]+/g, '_');

async function main(): Promise<void> {
  mkdirSync(outDir, { recursive: true });
  const names = readdirSync(projectsDir).filter(
    name => existsSync(join(projectsDir, name, 'components.json')) && (!only || only.includes(name)),
  );
  const browser: Browser = await chromium.launch({ args: ['--disable-lcd-text', '--font-render-hinting=none'] });
  const rows: { project: string; theme: string; pairs: number; worst: number; failing: string[] }[] = [];
  let failed = false;

  for (const [index, name] of names.entries()) {
    const dir = join(projectsDir, name);
    const config = JSON.parse(readFileSync(join(dir, 'components.json'), 'utf8'));
    const distRoot = join(dir, 'dist');
    const dist = join(distRoot, readdirSync(distRoot)[0], 'browser');
    const server = serve(dist, portBase + index);
    const items = itemsFlag ?? [
      'preview-01',
      'preview-02',
      ...readdirSync(join(dir, 'src/app/parity/examples'))
        .filter(f => f.endsWith('-example.component.ts'))
        .map(f => `component:${f.replace('-example.component.ts', '')}`),
    ];

    for (const theme of themes) {
      const dark = theme === 'dark';
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
      // The theme and the direction are on <html> before the app boots (the CDK and the charts read them once), as they
      // would be in a project that ships them in index.html. A string, not a function: tsx's helpers do not survive
      // being serialised into the page.
      await context.addInitScript(`(() => {
        const set = () => {
          const html = document.documentElement;
          if (!html) return;
          if (${dark}) html.classList.add('dark');
          if (${!!config.rtl}) html.setAttribute('dir', 'rtl');
        };
        set();
        new MutationObserver(set).observe(document, { childList: true, subtree: true });
      })()`);
      const page = await context.newPage();
      const errors: string[] = [];
      page.on('pageerror', e => errors.push(String(e)));
      let pairs = 0;
      let worst = 0;
      const failing: string[] = [];

      for (const item of items) {
        try {
          const canvas = await capture(
            page,
            `${base}/create/preview/${item}?preset=${config.preset}`,
            item,
            dark,
            !!config.rtl,
          );
          const installed = await capture(
            page,
            `http://localhost:${portBase + index}/parity/${item}`,
            item,
            dark,
            !!config.rtl,
          );
          for (const shot of installed) {
            const other = canvas.find(c => c.key === shot.key);
            const label = `${name}/${theme}/${item}/${shot.key}`;
            if (!other) {
              failing.push(`${label}: missing in the canvas`);
              failed = true;
              continue;
            }
            const result = await diff(shot.png, other.png);
            pairs++;
            worst = Math.max(worst, result.percent);
            if (result.percent > (shot.chart ? chartTolerance : tolerance)) {
              failed = true;
              failing.push(`${label}: ${result.percent.toFixed(2)}% (${result.sizes})`);
              writeFileSync(join(outDir, `${slug(label)}.png`), result.image);
            }
          }
        } catch (error) {
          failed = true;
          failing.push(`${name}/${theme}/${item}: ${String(error).split('\n')[0]}`);
        }
      }
      if (errors.length) failing.push(`page errors: ${errors.slice(0, 3).join(' | ')}`);
      rows.push({ project: name, theme, pairs, worst, failing });
      await context.close();
    }
    server.close();
  }
  await browser.close();

  console.log('\n| project | theme | pairs | worst % | over tolerance |\n|---|---|---|---|---|');
  for (const r of rows)
    console.log(`| ${r.project} | ${r.theme} | ${r.pairs} | ${r.worst.toFixed(3)} | ${r.failing.length} |`);
  for (const r of rows) for (const line of r.failing) console.log(`  ${line}`);
  if (skipped.size) console.log(`  skipped (no box, or drawn from random input): ${[...skipped].join(', ')}`);
  writeFileSync(join(outDir, 'results.json'), JSON.stringify(rows, null, 2));
  process.exit(failed ? 1 : 0);
}

void main();
