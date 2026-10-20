import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Item RTL', () => {
  test('RTL example mirrors the chevron', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'item');
    await demoPage.goto();

    const rtlDemo = demoPage.getDemoByName('rtl');
    await rtlDemo.scrollIntoViewIfNeeded();
    const preview = rtlDemo.locator('[data-slot="preview"]');
    await expect(preview).toHaveAttribute('dir', 'rtl');
    const chevron = preview.locator('a[z-item] ng-icon').last();
    await expect(chevron).toBeVisible();
    await expect.poll(() => chevron.evaluate(el => getComputedStyle(el).rotate)).toBe('180deg');

    await checkA11y(page, '[id="rtl"]', []);
  });
});
