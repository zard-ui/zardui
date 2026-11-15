/**
 * Visual parity of the /create component examples against shadcn/ui's own previews.
 *
 * For each example, style and mode it screenshots shadcn's preview (`ui.shadcn.com/preview/base/<name>-example`) and
 * zard's (`/create/preview/component:<name>`), at the same viewport, with animations off, and writes:
 *
 *   <out>/<name>/<style>-<mode>.png   shadcn | zard | diff (red: pixels that differ)
 *   <out>/summary.json                 percent of differing pixels and page heights, worst first
 *
 * shadcn's preview switches style by the `style-<id>` class on <body> and the mode by `dark` on <html>, so each of
 * its pages is loaded once. zard's preview takes a `design` message (the same one /create sends), so it is loaded
 * once too. Both use Inter and the neutral base color: color themes are checked apart, by token value.
 *
 *   npx tsx scripts/create-parity/shadcn-visual.mts --items button,card --styles nova,lyra --modes light,dark
 *     [--zard http://localhost:4222] [--out <dir>] [--width 1280]
 *
 * Without --items it runs every example of `create-examples.ts`; an example shadcn has no page for is reported as
 * `no-reference`, not as a difference.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { chromium, type Page } from 'playwright';
import sharp from 'sharp';

import { DEFAULT_DESIGN, normalizeDesign, STYLE_IDS, type StyleId } from '../../packages/cli/src/core/design/index';

const argv = process.argv.slice(2);
const flag = (name: string, fallback?: string): string | undefined => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : fallback;
};

const ZARD = flag('zard', 'http://localhost:4222')!;
const SHADCN = 'https://ui.shadcn.com/preview/base';
const outDir = resolve(flag('out', 'dist/shadcn-visual')!);
const width = Number(flag('width', '1280'));
const styles = (flag('styles') ?? STYLE_IDS.join(',')).split(',') as StyleId[];
const modes = (flag('modes') ?? 'light,dark').split(',') as ('light' | 'dark')[];

const EXAMPLES_FILE = resolve('apps/web/src/app/domain/pages/create/lib/create-examples.ts');
const allItems = [...readFileSync(EXAMPLES_FILE, 'utf8').matchAll(/name: '([a-z0-9-]+)'/g)].map(match => match[1]);
const items = flag('items')?.split(',') ?? allItems;

/** No animation, no caret, no scrollbar: what is left to differ is the design. */
const STILL = `*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }
  ::-webkit-scrollbar { display: none; }`;
/** zard's preview scrolls inside <main>; unclamped, the page grows and a full-page screenshot takes it all. */
const ZARD_UNCLAMP = `html, body, main { height: auto !important; max-height: none !important; overflow: visible !important; }`;

interface Result {
  item: string;
  style: StyleId;
  mode: string;
  percent: number | null;
  heights: string;
  status: 'ok' | 'no-reference' | 'error';
  error?: string;
}

async function shadcnPage(page: Page, item: string): Promise<boolean> {
  const response = await page.goto(`${SHADCN}/${item}-example`, { waitUntil: 'networkidle', timeout: 60_000 });
  if (!response || response.status() >= 400) return false;
  // A missing example renders shadcn's not-found page with a 200.
  const notFound = await page.evaluate(
    () => /not found|404/i.test(document.title) || !document.body.className.includes('style-'),
  );
  if (notFound) return false;
  await page.addStyleTag({ content: STILL });
  return true;
}

async function shadcnSet(page: Page, style: StyleId, mode: string): Promise<void> {
  await page.evaluate(
    ({ style, dark }) => {
      const body = document.body.classList;
      for (const name of Array.from(body)) if (name.startsWith('style-')) body.remove(name);
      body.add(`style-${style}`);
      const html = document.documentElement.classList;
      html.toggle('dark', dark);
      html.toggle('light', !dark);
    },
    { style, dark: mode === 'dark' },
  );
  await page.waitForTimeout(400);
}

async function zardPage(page: Page, item: string): Promise<void> {
  await page.goto(`${ZARD}/create/preview/component:${item}`, { waitUntil: 'load', timeout: 120_000 });
  await page.waitForFunction(
    () => !document.documentElement.hasAttribute('data-design-pending') && document.querySelector('main[data-item]'),
    undefined,
    { timeout: 60_000 },
  );
  await page.addStyleTag({ content: STILL + ZARD_UNCLAMP });
}

async function zardSet(page: Page, style: StyleId, mode: string): Promise<void> {
  const design = normalizeDesign({ ...DEFAULT_DESIGN, style });
  await page.evaluate(
    ({ design, dark }) => {
      // The preview takes messages from its parent; standalone, it is its own parent.
      window.postMessage({ channel: 'zard-create', type: 'design', design, dark, custom: null }, location.origin);
    },
    { design, dark: mode === 'dark' },
  );
  await page.waitForFunction(
    ({ style, dark }) =>
      document.body.classList.contains(`style-${style}`) &&
      document.documentElement.classList.contains('dark') === dark,
    { style, dark: mode === 'dark' },
    { timeout: 20_000 },
  );
  await page.waitForTimeout(600);
}

/** pixelmatch's colour distance (YIQ), without the anti-aliasing heuristics. */
function delta(a: Buffer, b: Buffer, i: number): number {
  const blend = (c: number, alpha: number): number => 255 + (c - 255) * alpha;
  const a1 = a[i + 3] / 255;
  const a2 = b[i + 3] / 255;
  const dr = blend(a[i], a1) - blend(b[i], a2);
  const dg = blend(a[i + 1], a1) - blend(b[i + 1], a2);
  const db = blend(a[i + 2], a1) - blend(b[i + 2], a2);
  const y = dr * 0.29889531 + dg * 0.58662247 + db * 0.11448223;
  const iq = dr * 0.59597799 - dg * 0.2741761 - db * 0.32180189;
  const q = dr * 0.21147017 - dg * 0.52261711 + db * 0.31114694;
  return 0.5053 * y * y + 0.299 * iq * iq + 0.1957 * q * q;
}

async function compose(reference: Buffer, ours: Buffer, file: string): Promise<{ percent: number; heights: string }> {
  const [ma, mb] = await Promise.all([sharp(reference).metadata(), sharp(ours).metadata()]);
  const w = Math.max(ma.width!, mb.width!);
  const h = Math.max(ma.height!, mb.height!);
  const raw = (input: Buffer, m: sharp.Metadata) =>
    sharp(input)
      .ensureAlpha()
      .extend({ right: w - m.width!, bottom: h - m.height!, background: { r: 255, g: 0, b: 255, alpha: 1 } })
      .raw()
      .toBuffer();
  const [ra, rb] = await Promise.all([raw(reference, ma), raw(ours, mb)]);

  const out = Buffer.alloc(w * h * 4);
  const max = 35215 * 0.1 * 0.1;
  let count = 0;
  for (let i = 0; i < w * h * 4; i += 4) {
    if (delta(ra, rb, i) > max) {
      count++;
      out[i] = 255;
      out[i + 3] = 255;
    } else {
      out[i] = out[i + 1] = out[i + 2] = ra[i] * 0.3 + 178;
      out[i + 3] = 255;
    }
  }

  const tile = (buffer: Buffer) =>
    sharp(buffer, { raw: { width: w, height: h, channels: 4 } })
      .png()
      .toBuffer();
  const image = await sharp({ create: { width: w * 3 + 16, height: h, channels: 4, background: '#ff00ff' } })
    .composite([
      { input: await tile(ra), left: 0, top: 0 },
      { input: await tile(rb), left: w + 8, top: 0 },
      { input: await tile(out), left: w * 2 + 16, top: 0 },
    ])
    .png()
    .toBuffer();
  // Kept readable: a long page is scaled down rather than written at full height.
  await sharp(image)
    .resize({ width: Math.min(w * 3 + 16, 2400), withoutEnlargement: true })
    .png()
    .toFile(file);

  return { percent: Number(((count / (w * h)) * 100).toFixed(2)), heights: `${ma.height}/${mb.height}` };
}

async function main(): Promise<void> {
  mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  const results: Result[] = [];

  for (const item of items) {
    const reference = await context.newPage();
    const ours = await context.newPage();
    try {
      if (!(await shadcnPage(reference, item))) {
        results.push({ item, style: 'nova', mode: '-', percent: null, heights: '-', status: 'no-reference' });
        console.log(`${item}: no shadcn reference`);
        continue;
      }
      await zardPage(ours, item);
      mkdirSync(join(outDir, item), { recursive: true });

      for (const style of styles) {
        for (const mode of modes) {
          try {
            await shadcnSet(reference, style, mode);
            await zardSet(ours, style, mode);
            const [a, b] = [await reference.screenshot({ fullPage: true }), await ours.screenshot({ fullPage: true })];
            const file = join(outDir, item, `${style}-${mode}.png`);
            const { percent, heights } = await compose(a, b, file);
            results.push({ item, style, mode, percent, heights, status: 'ok' });
            console.log(`${item} ${style} ${mode}: ${percent}% (heights ${heights})`);
          } catch (error) {
            results.push({ item, style, mode, percent: null, heights: '-', status: 'error', error: String(error) });
            console.log(`${item} ${style} ${mode}: ERROR ${String(error).slice(0, 160)}`);
          }
        }
      }
    } catch (error) {
      results.push({
        item,
        style: 'nova',
        mode: '-',
        percent: null,
        heights: '-',
        status: 'error',
        error: String(error),
      });
      console.log(`${item}: ERROR ${String(error).slice(0, 160)}`);
    } finally {
      await reference.close();
      await ours.close();
    }
  }

  await browser.close();
  results.sort((a, b) => (b.percent ?? -1) - (a.percent ?? -1));
  const summaryFile = join(outDir, 'summary.json');
  const previous = (() => {
    try {
      return JSON.parse(readFileSync(summaryFile, 'utf8')) as Result[];
    } catch {
      return [];
    }
  })();
  // Runs for a few items merge into the summary instead of wiping the others.
  const merged = [
    ...previous.filter(old => !results.some(r => r.item === old.item && r.style === old.style && r.mode === old.mode)),
    ...results,
  ].sort((a, b) => (b.percent ?? -1) - (a.percent ?? -1));
  writeFileSync(summaryFile, JSON.stringify(merged, null, 2));
  console.log(`\n${results.length} results → ${summaryFile}`);
}

void main();
