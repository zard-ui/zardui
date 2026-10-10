import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Sheet component RTL', () => {
  test('opens from the left in RTL with the close button on the inline-end corner', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'sheet');
    await demoPage.goto();

    const demo = demoPage.getDemoByName('rtl');
    await demo.scrollIntoViewIfNeeded();
    await expect(demo.locator('[data-slot="preview"]')).toHaveAttribute('dir', 'rtl');

    await demo.locator('[data-slot="preview"] button[z-button]').first().click();

    const panel = page.locator('.cdk-overlay-container z-sheet-panel');
    await expect(panel).toBeVisible({ timeout: 5000 });
    await expect(panel).toHaveAttribute('data-side', 'left');
    await expect(page.locator('.cdk-overlay-container [dir="rtl"]').first()).toBeAttached();

    // Let the slide-in settle before measuring.
    await expect.poll(async () => (await panel.boundingBox())?.x ?? 999).toBeLessThan(2);
    const panelBox = (await panel.boundingBox())!;

    // End corner of an RTL panel is its physical left.
    const closeBox = (await panel.locator('[data-testid="z-close-header-button"]').boundingBox())!;
    expect(closeBox.x + closeBox.width / 2).toBeLessThan(panelBox.x + panelBox.width / 2);

    await checkA11y(page, undefined, ['button-name', 'color-contrast', 'label', 'scrollable-region-focusable']);
  });
});
