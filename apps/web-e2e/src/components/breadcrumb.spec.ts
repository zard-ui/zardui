import { expect, test } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Breadcrumb RTL', () => {
  test('renders the rtl example mirrored', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'breadcrumb');
    await demoPage.goto();

    const rtl = demoPage.getDemoByName('rtl');
    await rtl.scrollIntoViewIfNeeded();
    const preview = rtl.locator('[data-slot="preview"]');
    await expect(preview).toHaveAttribute('dir', 'rtl');
    await expect(preview).toHaveAttribute('data-lang', 'ar');

    const items = preview.locator('z-breadcrumb-item');
    await expect(items.first()).toBeVisible();
    const home = await items.first().boundingBox();
    const current = await items.last().boundingBox();
    // The path reads right to left: Home is the right-most item.
    expect(home!.x).toBeGreaterThan(current!.x);
    const separator = preview.locator('[data-slot="breadcrumb-separator"] ng-icon').first();
    const rotate = await separator.evaluate(el => getComputedStyle(el).rotate);
    // The chevron is mirrored (rotate 180deg): a negative x scale.
    expect(rotate).toBe('180deg');
    await preview.locator('[z-dropdown]').click();
    await expect(page.locator('.cdk-overlay-pane [role="menu"]').first()).toBeVisible();
    await expect(page.locator('.cdk-overlay-container [dir="rtl"]').first()).toBeAttached();

    await checkA11y(page, '#rtl z-demo-breadcrumb-rtl', ['color-contrast', 'button-name']);
  });
});
