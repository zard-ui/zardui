import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Textarea component', () => {
  test('rtl example follows the writing direction', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'textarea');
    await demoPage.goto();

    const demo = demoPage.getDemoByName('rtl');
    await demo.scrollIntoViewIfNeeded();
    await expect(demo.locator('[data-slot="preview"]')).toHaveAttribute('dir', 'rtl');

    const textarea = demo.locator('textarea[z-textarea]');
    await expect(textarea).toHaveCSS('direction', 'rtl');
    await expect(textarea).toHaveCSS('text-align', 'start');
    await textarea.fill('مرحبا بالعالم');
    await expect(textarea).toHaveValue('مرحبا بالعالم');

    await checkA11y(page, '#rtl', ['color-contrast']);
  });
});
