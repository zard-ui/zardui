import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Toggle component', () => {
  test('rtl example places the icon on the inline-start (right) side and toggles', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'toggle');
    await demoPage.goto();

    const demo = demoPage.getDemoByName('rtl');
    await demo.scrollIntoViewIfNeeded();
    await expect(demo.locator('[data-slot="preview"]')).toHaveAttribute('dir', 'rtl');

    const toggle = demo.locator('[data-slot="preview"] button[aria-pressed]').first();
    const box = (await toggle.boundingBox())!;
    const iconBox = (await toggle.locator('ng-icon').boundingBox())!;
    expect(iconBox.x + iconBox.width / 2).toBeGreaterThan(box.x + box.width / 2);

    const pressable = toggle;
    await pressable.click();
    await expect(pressable).toHaveAttribute('aria-pressed', 'true');

    await checkA11y(page, '#rtl', ['color-contrast']);
  });
});
