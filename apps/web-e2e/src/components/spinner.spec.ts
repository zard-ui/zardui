import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Spinner RTL', () => {
  test('RTL example puts the spinner at the inline-start edge of the button', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'spinner');
    await demoPage.goto();

    const rtlDemo = demoPage.getDemoByName('rtl');
    await rtlDemo.scrollIntoViewIfNeeded();
    const preview = rtlDemo.locator('[data-slot="preview"]');
    await expect(preview).toHaveAttribute('dir', 'rtl');
    const button = preview.locator('button[z-button]').first();
    const spinner = await button.locator('z-spinner').boundingBox();
    const box = await button.boundingBox();
    // inline-start is the right side in RTL
    expect(spinner!.x - box!.x).toBeGreaterThan(box!.width / 2);

    await checkA11y(page, '[id="rtl"]', []);
  });
});
