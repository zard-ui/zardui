import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Toggle group component', () => {
  test('rtl example orders items right to left and rounds the logical ends', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'toggle-group');
    await demoPage.goto();

    const demo = demoPage.getDemoByName('rtl');
    await demo.scrollIntoViewIfNeeded();
    await expect(demo.locator('[data-slot="preview"]')).toHaveAttribute('dir', 'rtl');

    const items = demo.locator('[data-slot="toggle-group-item"]');
    await expect(items).toHaveCount(3);
    const first = items.nth(0);
    const last = items.nth(2);

    // the first item is the rightmost one
    expect((await first.boundingBox())!.x).toBeGreaterThan((await last.boundingBox())!.x);
    // rounded on the logical start/end (physical right/left), joined borders on the inline-start side
    await expect(first).toHaveCSS('border-top-right-radius', /[1-9]/);
    await expect(first).toHaveCSS('border-top-left-radius', '0px');
    await expect(last).toHaveCSS('border-top-left-radius', /[1-9]/);
    await expect(items.nth(1)).toHaveCSS('border-right-width', '0px');
    await expect(items.nth(1)).toHaveCSS('border-left-width', '1px');

    // keyboard: Tab moves in visual (reading) order, Enter/Space toggles
    await first.focus();
    await page.keyboard.press('Tab');
    await expect(items.nth(1)).toBeFocused();
    await page.keyboard.press('Space');
    await expect(items.nth(1)).toHaveAttribute('aria-pressed', 'true');

    await checkA11y(page, '#rtl', ['color-contrast']);
  });
});
