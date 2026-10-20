import { expect, test } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Empty RTL', () => {
  test('renders the rtl example mirrored', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'empty');
    await demoPage.goto();

    const rtl = demoPage.getDemoByName('rtl');
    await rtl.scrollIntoViewIfNeeded();
    const preview = rtl.locator('[data-slot="preview"]');
    await expect(preview).toHaveAttribute('dir', 'rtl');
    await expect(preview).toHaveAttribute('data-lang', 'ar');

    await expect(preview.locator('z-empty')).toBeVisible();
    const arrow = preview.locator('a[z-button] ng-icon');
    const rotate = await arrow.evaluate(el => getComputedStyle(el).rotate);
    // The up-right arrow is rotated -90deg to point up-left.
    expect(rotate).toBe('-90deg');
    const link = await preview.locator('a[z-button]').boundingBox();
    const icon = await arrow.boundingBox();
    expect(icon!.x + icon!.width / 2).toBeLessThan(link!.x + link!.width / 2);

    await checkA11y(page, '#rtl z-demo-empty-rtl', ['color-contrast', 'button-name']);
  });
});
