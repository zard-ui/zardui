import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Kbd RTL', () => {
  test('RTL example renders the shortcut inside an RTL preview', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'kbd');
    await demoPage.goto();

    const rtlDemo = demoPage.getDemoByName('rtl');
    await rtlDemo.scrollIntoViewIfNeeded();
    const preview = rtlDemo.locator('[data-slot="preview"]');
    await expect(preview).toHaveAttribute('dir', 'rtl');
    await expect(preview.locator('z-kbd').first()).toBeVisible();
    await expect(preview.locator('p')).toContainText('اضغط');

    await checkA11y(page, '[id="rtl"]', ['color-contrast']);
  });
});
