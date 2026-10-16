import { expect, test } from '@playwright/test';

import { MAP_LAUNCH_ARGS, routeMapTiles } from './utils/map-fixtures';

test.use({ launchOptions: { args: MAP_LAUNCH_ARGS } });

const CATEGORIES = [
  { path: '/maps', tab: 'Analytics', cards: 4 },
  { path: '/maps/logistics', tab: 'Logistics', cards: 3 },
  { path: '/maps/data', tab: 'Data', cards: 3 },
  { path: '/maps/3d', tab: '3D', cards: 2 },
  { path: '/maps/draw', tab: 'Draw', cards: 1 },
];

test.describe('Maps gallery', () => {
  test.beforeEach(async ({ page }) => {
    await routeMapTiles(page);
  });

  for (const { path, tab, cards } of CATEGORIES) {
    test(`${tab} lists its cards and renders the first map without console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', message => {
        // A failed request to a third party the gallery does not own (the GitHub star count) is not a map error.
        if (message.type() === 'error' && !message.text().startsWith('Failed to load resource')) {
          errors.push(message.text());
        }
      });
      page.on('pageerror', error => errors.push(error.message));

      await page.goto(path);
      await expect(page.locator('z-map-card')).toHaveCount(cards);
      await expect(page.locator('z-map-card').first().locator('canvas.maplibregl-canvas').first()).toBeVisible({
        timeout: 20_000,
      });

      expect(errors).toEqual([]);
    });
  }

  test('maps initialise only as they enter the viewport', async ({ page }) => {
    await page.goto('/maps');
    const canvases = page.locator('canvas.maplibregl-canvas');
    await expect(canvases.first()).toBeVisible({ timeout: 20_000 });
    const before = await canvases.count();
    expect(before).toBeLessThan(4);

    await page.locator('z-map-card').last().scrollIntoViewIfNeeded();
    await expect(page.locator('z-map-card').last().locator('canvas.maplibregl-canvas').first()).toBeVisible({
      timeout: 20_000,
    });
  });

  test('switching categories back and forth leaves no map behind', async ({ page }) => {
    const warnings: string[] = [];
    page.on('console', message => {
      if (/Too many active WebGL contexts/i.test(message.text())) warnings.push(message.text());
    });

    await page.goto('/maps');
    await expect(page.locator('canvas.maplibregl-canvas').first()).toBeVisible({ timeout: 20_000 });

    for (let i = 0; i < 10; i++) {
      await page.getByRole('link', { name: 'Logistics', exact: true }).click();
      await page.getByRole('link', { name: 'Analytics', exact: true }).click();
    }

    await expect(page.locator('canvas.maplibregl-canvas').first()).toBeVisible({ timeout: 20_000 });
    expect(await page.locator('canvas.maplibregl-canvas').count()).toBeLessThan(4);
    expect(warnings).toEqual([]);
  });

  test('"View Code" opens the source of the block', async ({ page }) => {
    await page.goto('/maps');
    await page.getByRole('button', { name: 'View Code' }).first().click();

    await expect(page.getByRole('dialog')).toContainText('ZardMapImports');
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
