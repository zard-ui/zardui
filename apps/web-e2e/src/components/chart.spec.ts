import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Chart component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'chart');
    await demoPage.goto();
  });

  test('renders an ECharts surface inside the chart host', async () => {
    const chart = demoPage.firstDemoBox.locator('z-chart').first();
    await expect(chart).toBeVisible();

    // ECharts paints into a canvas by default and an <svg> under the SVG renderer.
    const surface = chart.locator('canvas, svg').first();
    await expect(surface).toBeVisible();
  });

  test('shows the tooltip when the chart area is hovered', async ({ page }) => {
    const chart = demoPage.firstDemoBox.locator('z-chart').first();
    await expect(chart.locator('canvas').first()).toBeVisible();

    // ECharts appends its tooltip container to the chart element once it is shown, but it binds
    // the canvas pointer handlers asynchronously — so re-hover until the tooltip actually appears.
    const tooltip = chart.getByRole('tooltip').first();
    await expect(async () => {
      const box = await chart.boundingBox();
      if (!box) throw new Error('the chart has no layout box');
      await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.5, { steps: 4 });
      await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5, { steps: 4 });
      await expect(tooltip).toBeVisible({ timeout: 1_500 });
    }).toPass({ timeout: 15_000 });
  });

  test('clicking a legend item toggles the series', async () => {
    const legendItem = demoPage.firstDemoBox.locator('z-chart-legend button').first();
    await expect(legendItem).toBeVisible();
    await expect(legendItem).toHaveAttribute('aria-pressed', 'true');

    await legendItem.click();
    await expect(legendItem).toHaveAttribute('aria-pressed', 'false');

    await legendItem.click();
    await expect(legendItem).toHaveAttribute('aria-pressed', 'true');
  });

  test('passes accessibility checks', async ({ page }) => {
    // button-name: the demo box ships icon-only copy buttons around the chart.
    await checkA11y(page, '#overview', ['button-name', 'color-contrast']);
  });
});

test.describe('Chart RTL', () => {
  test('renders the rtl example mirrored', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'chart');
    await demoPage.goto();

    const rtl = demoPage.getDemoByName('rtl');
    await rtl.scrollIntoViewIfNeeded();
    const preview = rtl.locator('[data-slot="preview"]');
    await expect(preview).toHaveAttribute('dir', 'rtl');
    await expect(preview).toHaveAttribute('data-lang', 'ar');

    const chart = preview.locator('z-chart');
    await expect(chart).toBeVisible();
    const legend = preview.locator('z-chart-legend button');
    await expect(legend).toHaveCount(2);
    const first = await legend.nth(0).boundingBox();
    const second = await legend.nth(1).boundingBox();
    // The legend follows the inherited direction: the first entry is the right-most one.
    expect(first!.x).toBeGreaterThan(second!.x);
    // The category axis is NOT mirrored: the tooltip for the first category is on the left half.
    const tooltip = chart.getByRole('tooltip').first();
    await expect(async () => {
      const box = await chart.boundingBox();
      if (!box) throw new Error('the chart has no layout box');
      await page.mouse.move(box.x + box.width * 0.1, box.y + box.height * 0.4, { steps: 4 });
      await page.mouse.move(box.x + box.width * 0.15, box.y + box.height * 0.4, { steps: 4 });
      await expect(tooltip).toBeVisible({ timeout: 1_500 });
    }).toPass({ timeout: 15_000 });
    const style = await tooltip.evaluate(el => {
      const css = getComputedStyle(el);
      return { dir: css.direction, align: css.textAlign };
    });
    expect(style.dir).toBe('rtl');
    expect(['start', 'right']).toContain(style.align);

    await checkA11y(page, '#rtl z-demo-chart-rtl', ['color-contrast', 'button-name']);
  });
});
