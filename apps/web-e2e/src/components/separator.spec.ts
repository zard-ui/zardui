import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Separator RTL', () => {
  test('RTL example lays out inline content right to left', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'separator');
    await demoPage.goto();

    const rtlDemo = demoPage.getDemoByName('rtl');
    await rtlDemo.scrollIntoViewIfNeeded();
    const preview = rtlDemo.locator('[data-slot="preview"]');
    await expect(preview).toHaveAttribute('dir', 'rtl');
    const items = preview.locator('div.flex.h-5 > span');
    const docs = await items.nth(0).boundingBox();
    const source = await items.nth(1).boundingBox();
    expect(docs!.x).toBeGreaterThan(source!.x);

    await checkA11y(page, '[id="rtl"]', []);
  });
});
