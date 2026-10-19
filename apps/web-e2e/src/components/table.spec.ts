import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Table RTL', () => {
  test('RTL example aligns text to the inline-start edge', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'table');
    await demoPage.goto();

    const rtlDemo = demoPage.getDemoByName('rtl');
    await rtlDemo.scrollIntoViewIfNeeded();
    const preview = rtlDemo.locator('[data-slot="preview"]');
    await expect(preview).toHaveAttribute('dir', 'rtl');
    const head = preview.locator('th[z-table-head]').first();
    await expect.poll(() => head.evaluate(el => getComputedStyle(el).textAlign)).toBe('start');
    const first = await preview.locator('th[z-table-head]').nth(0).boundingBox();
    const last = await preview.locator('th[z-table-head]').nth(2).boundingBox();
    expect(first!.x).toBeGreaterThan(last!.x);

    await checkA11y(page, '[id="rtl"]', []);
  });
});
