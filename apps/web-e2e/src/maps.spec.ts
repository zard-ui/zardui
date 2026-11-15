import { expect, test } from '@playwright/test';

import { MAP_LAUNCH_ARGS, routeMapTiles } from './utils/map-fixtures';

test.use({ launchOptions: { args: MAP_LAUNCH_ARGS } });

/** The blocks of each category, in the order the page lists them. Each category is a page of its own. */
const CATEGORIES = [
  { path: '/maps', label: 'Analytics', blocks: ['analytics-map', 'choropleth', 'analytics-card', 'uptime-monitor'] },
  { path: '/maps/logistics', label: 'Logistics', blocks: ['delivery-tracker', 'logistics-network', 'store-locator'] },
  { path: '/maps/data', label: 'Data', blocks: ['heatmap', 'clusters', 'flights'] },
  { path: '/maps/3d', label: '3D', blocks: ['city-3d', 'terrain'] },
  { path: '/maps/draw', label: 'Draw', blocks: ['draw'] },
];

/** What `/maps` shows: the first category. */
const BLOCKS = CATEGORIES[0].blocks;

test.describe('Maps gallery', () => {
  test.beforeEach(async ({ page }) => {
    await routeMapTiles(page);
  });

  test('lists the blocks of the first category and renders the first map without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', message => {
      // A failed request to a third party the gallery does not own (the GitHub star count) is not a map error.
      if (message.type() === 'error' && !message.text().startsWith('Failed to load resource')) {
        errors.push(message.text());
      }
    });
    page.on('pageerror', error => errors.push(error.message));

    await page.goto('/maps');

    await expect(page.locator('z-map-block')).toHaveCount(BLOCKS.length);
    for (const id of BLOCKS) {
      await expect(page.locator(`z-map-block[data-block="${id}"]`)).toHaveCount(1);
    }
    await expect(page.locator('z-map-block').first().locator('canvas.maplibregl-canvas').first()).toBeVisible({
      timeout: 20_000,
    });

    expect(errors).toEqual([]);
  });

  test('maps initialise as they come near the viewport, and stay once they are there', async ({ page }) => {
    await page.goto('/maps');
    const canvases = page.locator('canvas.maplibregl-canvas');
    await expect(canvases.first()).toBeVisible({ timeout: 20_000 });
    const before = await canvases.count();
    expect(before).toBeLessThan(BLOCKS.length);

    const last = page.locator('z-map-block').last();
    await last.scrollIntoViewIfNeeded();
    await expect(last.locator('canvas.maplibregl-canvas').first()).toBeVisible({ timeout: 20_000 });

    // Back at the top, the first block is still a map and not an empty placeholder.
    await page.locator('z-map-block').first().scrollIntoViewIfNeeded();
    await expect(page.locator('z-map-block').first().locator('canvas.maplibregl-canvas').first()).toBeVisible();
    expect(await canvases.count()).toBeGreaterThan(before);
  });

  test('leaving the page destroys its maps, and going back and forth leaks no WebGL context', async ({ page }) => {
    test.setTimeout(240_000);
    const warnings: string[] = [];
    page.on('console', message => {
      if (/Too many active WebGL contexts/i.test(message.text())) warnings.push(message.text());
    });

    await page.goto('/maps');
    await expect(page.locator('canvas.maplibregl-canvas').first()).toBeVisible({ timeout: 20_000 });

    // Four maps per visit, six visits: more contexts than a browser allows, unless each visit gives them back.
    for (let i = 0; i < 6; i++) {
      await page.locator('z-map-block').nth(3).scrollIntoViewIfNeeded();
      await expect(page.locator('z-map-block').nth(3).locator('canvas.maplibregl-canvas').first()).toBeVisible({
        timeout: 20_000,
      });
      await page.locator('header a[href="/docs/components"]').click();
      await expect(page).toHaveURL(/\/docs\/components/);
      await expect(page.locator('canvas.maplibregl-canvas')).toHaveCount(0);
      await page.goBack();
      await expect(page).toHaveURL(/\/maps/);
    }

    await expect(page.locator('canvas.maplibregl-canvas').first()).toBeVisible({ timeout: 20_000 });
    expect(warnings).toEqual([]);
  });

  test('opens with a centred title, a description and the two calls to action, like the charts page', async ({
    page,
  }) => {
    await page.goto('/maps/data');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Beautiful Maps for the Web');
    await expect(page.locator('a', { hasText: 'Browse Maps' })).toBeVisible();
    await expect(page.locator('a', { hasText: 'Map docs' })).toHaveAttribute('href', '/docs/components/map');
  });

  test('every block is the preview alone, named where the tabs used to be', async ({ page }) => {
    await page.goto('/maps');
    const block = page.locator('z-map-block[data-block="analytics-map"]');

    await expect(block.getByRole('heading', { level: 2 })).toHaveText('Analytics Map');
    await expect(block.getByRole('tab')).toHaveCount(0);
    await expect(page.getByRole('button', { name: /install command|full screen/i })).toHaveCount(0);
    await expect(block.locator('canvas.maplibregl-canvas').first()).toBeVisible({ timeout: 20_000 });
  });

  test('every block can open its code in a sheet, like the chart cards', async ({ page }) => {
    await page.goto('/maps');
    const block = page.locator('z-map-block[data-block="choropleth"]');

    await expect(block.getByRole('button', { name: 'View Code' })).toBeVisible();
    await block.getByRole('button', { name: 'View Code' }).click();

    const sheet = page.getByRole('dialog');
    await expect(sheet).toBeVisible();
    await expect(sheet).toContainText('block-choropleth.ts');
    await expect(sheet).toContainText('ZardMapImports');
  });

  test('keeps the map style picker in reach, as a popover of presets', async ({ page }) => {
    await page.goto('/maps');
    const picker = page.locator('[data-slot="maps-toolbar"] z-map-style-select');
    await expect(picker).toBeVisible();
    // The page is interactive once its first map is up.
    await expect(page.locator('canvas.maplibregl-canvas').first()).toBeVisible({ timeout: 20_000 });

    await picker.getByRole('button', { name: /Map style/ }).click();
    const options = page.getByRole('radiogroup', { name: 'Map style' }).getByRole('radio');
    await expect(options.first()).toBeVisible();
    await expect(options.filter({ hasText: 'Default' })).toHaveCount(1);
    await expect(page.getByRole('radio', { checked: true })).toHaveCount(1);
  });

  test('categories are tabs, one page each, like the charts', async ({ page }) => {
    await page.goto('/maps');
    const tabs = page.locator('z-category-tabs');

    for (const category of CATEGORIES) {
      await expect(tabs.getByRole('link', { name: category.label, exact: true })).toBeVisible();
    }
    await expect(tabs.getByRole('link', { name: 'Analytics' })).toHaveAttribute('data-active', 'true');

    await tabs.getByRole('link', { name: 'Logistics' }).click();
    await expect(page).toHaveURL(/\/maps\/logistics$/);
    await expect(tabs.getByRole('link', { name: 'Logistics' })).toHaveAttribute('data-active', 'true');
    await expect(page.locator('z-map-block')).toHaveCount(CATEGORIES[1].blocks.length);
    await expect(page.locator('z-map-block[data-block="analytics-map"]')).toHaveCount(0);
  });

  for (const category of CATEGORIES) {
    test(`${category.path} lists only the blocks of ${category.label}`, async ({ page }) => {
      await page.goto(category.path);

      await expect(page.locator('z-map-block')).toHaveCount(category.blocks.length);
      for (const id of category.blocks) {
        await expect(page.locator(`z-map-block[data-block="${id}"]`)).toHaveCount(1);
      }
      await expect(page).toHaveTitle(new RegExp(category.label, 'i'));
    });
  }

  test('switching category destroys the maps of the old one', async ({ page }) => {
    await page.goto('/maps');
    await expect(page.locator('canvas.maplibregl-canvas').first()).toBeVisible({ timeout: 20_000 });

    await page.locator('z-category-tabs').getByRole('link', { name: 'Data' }).click();
    await expect(page).toHaveURL(/\/maps\/data$/);
    await expect(page.locator('z-map-block[data-block="analytics-map"]')).toHaveCount(0);
    await expect(page.locator('z-map-block').first().locator('canvas.maplibregl-canvas').first()).toBeVisible({
      timeout: 20_000,
    });
  });

  test('an unknown category falls back to the first one', async ({ page }) => {
    await page.goto('/maps/nope');

    await expect(page.locator('z-map-block')).toHaveCount(BLOCKS.length);
  });

  test('has no horizontal overflow on a phone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/maps');
    await expect(page.locator('canvas.maplibregl-canvas').first()).toBeVisible({ timeout: 20_000 });

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('shows a message instead of a map when the browser has no WebGL2', async ({ page }) => {
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
        if (type === 'webgl2') return null;
        return (original as (...args: unknown[]) => unknown).call(this, type, ...rest) as never;
      } as typeof original;
    });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));

    await page.goto('/maps');

    await expect(page.locator('z-map-state[data-state="unsupported"]').first()).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('canvas.maplibregl-canvas')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
});
