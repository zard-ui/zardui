import { expect, test } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';
import { MAP_LAUNCH_ARGS, routeMapTiles, type MapRequests } from '../utils/map-fixtures';

test.use({ launchOptions: { args: MAP_LAUNCH_ARGS } });

// A map is created in the browser with software WebGL, so give it room when the machine is busy.
const READY = { timeout: 20_000 };

test.describe('Map component', () => {
  test.setTimeout(60_000);
  let demoPage: ComponentDemoPage;
  let requests: MapRequests;

  test.beforeEach(async ({ page }) => {
    requests = await routeMapTiles(page);
    demoPage = new ComponentDemoPage(page, 'map');
    await demoPage.goto();
  });

  test('renders a MapLibre canvas in the first demo', async () => {
    await expect(demoPage.firstDemoBox.locator('ng-map canvas.maplibregl-canvas')).toBeVisible(READY);
  });

  test('the zoom control changes the zoom', async ({ page }) => {
    // The controlled-viewport example prints the camera, so it can prove the control moved it.
    const example = page.locator('#viewport');
    await example.scrollIntoViewIfNeeded();
    await expect(example.locator('canvas.maplibregl-canvas')).toBeVisible(READY);

    const zoom = example.locator('dd').nth(2);
    const before = Number(await zoom.textContent());
    await example.getByRole('button', { name: 'Zoom in' }).click();

    await expect.poll(async () => Number(await zoom.textContent())).toBeGreaterThan(before);
  });

  test('opens the marker popup on click, styled as a popover', async ({ page }) => {
    const marker = demoPage.firstDemoBox.locator('.maplibregl-marker').first();
    await expect(marker).toBeVisible();
    await marker.click({ force: true });

    const card = page.locator('.ng-popup-card').first();
    await expect(card).toBeVisible();
    // MapLibre's own white box and tip are neutralised: the zard card is the only surface.
    await expect(page.locator('.maplibregl-popup-tip').first()).toBeHidden();
    await expect(page.locator('.maplibregl-popup-content').first()).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  });

  test('swaps the basemap when the theme changes', async ({ page }) => {
    await expect(demoPage.firstDemoBox.locator('canvas.maplibregl-canvas')).toBeVisible(READY);
    await expect.poll(() => requests.styles.some(url => url.includes('positron'))).toBe(true);

    await page.evaluate(() => document.documentElement.classList.add('dark'));

    await expect.poll(() => requests.styles.some(url => url.includes('dark-matter'))).toBe(true);
  });

  test('the style picker swaps the basemap of every map and remembers the choice', async ({ page }) => {
    await expect(demoPage.firstDemoBox.locator('canvas.maplibregl-canvas')).toBeVisible(READY);

    const picker = page.locator('z-map-style-select').first();
    await picker.getByRole('button', { name: /Map style/ }).click();
    await page.getByRole('radio', { name: /Liberty/ }).click();

    await expect.poll(() => requests.styles.some(url => url.includes('openfreemap.org/styles/liberty'))).toBe(true);
    await expect.poll(() => page.evaluate(() => localStorage.getItem('zard-map-style'))).toBe('openfreemap-liberty');

    await page.reload();
    await expect(page.locator('z-map-style-select').first()).toContainText('Liberty', READY);
  });

  test('a key-based preset asks for a key and changes nothing without one', async ({ page }) => {
    await expect(demoPage.firstDemoBox.locator('canvas.maplibregl-canvas')).toBeVisible(READY);
    const before = requests.styles.length;

    const picker = page.locator('z-map-style-select').first();
    await picker.getByRole('button', { name: /Map style/ }).click();
    await page.getByRole('radio', { name: /Streets/ }).click();

    // The key is asked for inside the popover, under the list.
    await expect(page.getByLabel(/MapTiler API key/)).toBeVisible();
    await expect(picker).toContainText('Carto', READY);
    expect(requests.styles.length).toBe(before);
  });

  test('falls back to Carto when the stored preset no longer exists', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('zard-map-style', 'nope'));
    await page.reload();

    await expect(page.locator('z-map-style-select').first()).toContainText('Carto', READY);
    await expect(demoPage.firstDemoBox.locator('canvas.maplibregl-canvas')).toBeVisible(READY);
  });

  test('every example renders as it scrolls into view, with a context to spare', async ({ page }) => {
    for (const id of ['markers', 'draw']) {
      await expect(async () => {
        await page.locator(`#${id}`).scrollIntoViewIfNeeded({ timeout: 2_000 });
        await expect(page.locator(`#${id} canvas.maplibregl-canvas`)).toBeVisible({ timeout: 4_000 });
      }).toPass({ timeout: 30_000 });
    }
  });

  test('passes accessibility checks', async ({ page }) => {
    // button-name: the demo box ships icon-only copy buttons. color-contrast: the basemap is an image.
    await checkA11y(page, '#overview', ['button-name', 'color-contrast']);
  });
});
