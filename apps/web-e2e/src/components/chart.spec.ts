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
