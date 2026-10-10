import { expect, test } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Alert RTL', () => {
  test('renders the rtl example mirrored', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'alert');
    await demoPage.goto();

    const rtl = demoPage.getDemoByName('rtl');
    await rtl.scrollIntoViewIfNeeded();
    const preview = rtl.locator('[data-slot="preview"]');
    await expect(preview).toHaveAttribute('dir', 'rtl');
    await expect(preview).toHaveAttribute('data-lang', 'ar');

    const alerts = preview.locator('z-alert');
    await expect(alerts).toHaveCount(2);
    const alert = await alerts.nth(1).boundingBox();
    const icon = await alerts.nth(1).locator('[data-slot="alert-icon"]').first().boundingBox();
    const action = await alerts.nth(1).locator('button').boundingBox();
    // Icon on the inline start (right), action pinned to the inline end (left).
    expect(icon!.x + icon!.width / 2).toBeGreaterThan(alert!.x + alert!.width / 2);
    expect(action!.x + action!.width / 2).toBeLessThan(alert!.x + alert!.width / 2);

    await checkA11y(page, '#rtl z-demo-alert-rtl', ['color-contrast', 'button-name']);
  });
});
