/**
 * Captures the light/dark thumbnails that `/blocks` renders for each block card.
 *
 * Nothing generates these automatically, and a missing file shows up as a broken image on the
 * blocks page. Run it against a dev server that is already up:
 *
 *   npx nx serve web --configuration=local --port=4222
 *   npx tsx scripts/capture-blocks.mts                 # every block in the registry
 *   npx tsx scripts/capture-blocks.mts sidebar-07      # or just the ones you name
 */
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

import { chromium, type Browser } from '@playwright/test';

const BASE_URL = process.env['BASE_URL'] ?? 'http://localhost:4222';
const VIEWPORT = { width: 1440, height: 900 };
const THEMES = ['light', 'dark'] as const;
const OUTPUT_ROOT = join(process.cwd(), 'apps', 'web', 'public', 'blocks');

const ALL_BLOCKS = [
  ...Array.from({ length: 16 }, (_, index) => `sidebar-${String(index + 1).padStart(2, '0')}`),
];

async function capture(browser: Browser, blockId: string, theme: (typeof THEMES)[number]): Promise<void> {
  const context = await browser.newContext({ viewport: VIEWPORT, colorScheme: theme });

  // The site reads the theme from localStorage before the first paint — see services/dark-mode.ts.
  await context.addInitScript(`localStorage.setItem('theme', '${theme}')`);

  const page = await context.newPage();

  try {
    await page.goto(`${BASE_URL}/blocks/preview/${blockId}`, { waitUntil: 'networkidle' });

    // sidebar-13 keeps its sidebar inside a dialog, so the thumbnail has to show it open.
    const dialogTrigger = page.getByRole('button', { name: 'Open Dialog' });
    if (await dialogTrigger.count()) {
      await dialogTrigger.click();
    }

    await page.waitForSelector('[data-slot="sidebar-wrapper"], [data-slot="sidebar-inset"]', { timeout: 20_000 });
    // Let the sidebar's width transition settle before the shot.
    await page.waitForTimeout(600);

    await mkdir(join(OUTPUT_ROOT, blockId), { recursive: true });
    await page.screenshot({ path: join(OUTPUT_ROOT, blockId, `${theme}.png`) });

    console.log(`✅ ${blockId}/${theme}.png`);
  } catch (error) {
    console.error(`❌ ${blockId}/${theme}.png — ${(error as Error).message}`);
    process.exitCode = 1;
  } finally {
    await context.close();
  }
}

const blocks = process.argv.slice(2).length ? process.argv.slice(2) : ALL_BLOCKS;
const browser = await chromium.launch();

try {
  for (const blockId of blocks) {
    for (const theme of THEMES) {
      await capture(browser, blockId, theme);
    }
  }
} finally {
  await browser.close();
}
