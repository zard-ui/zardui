import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Alert Dialog component RTL', () => {
  test('mirrors the footer order and keeps the panel centered', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'alert-dialog');
    await demoPage.goto();

    const demo = demoPage.getDemoByName('rtl');
    await demo.scrollIntoViewIfNeeded();
    await expect(demo.locator('[data-slot="preview"]')).toHaveAttribute('dir', 'rtl');

    await demo.locator('[data-slot="preview"] button[z-button]').first().click();

    const panel = page.locator('.cdk-overlay-container z-alert-dialog-panel');
    await expect(panel).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.cdk-overlay-container [dir="rtl"]').first()).toBeAttached();

    const panelBox = (await panel.boundingBox())!;
    const viewport = page.viewportSize()!;
    expect(Math.abs(panelBox.x + panelBox.width / 2 - viewport.width / 2)).toBeLessThan(2);

    // Cancel comes first in the DOM, so it sits on the right in RTL.
    const buttons = panel.locator('button[z-button]');
    const cancel = (await buttons.nth(0).boundingBox())!;
    const confirm = (await buttons.nth(1).boundingBox())!;
    expect(cancel.x).toBeGreaterThan(confirm.x);

    await checkA11y(page, undefined, ['button-name', 'color-contrast', 'label', 'scrollable-region-focusable']);
  });
});
