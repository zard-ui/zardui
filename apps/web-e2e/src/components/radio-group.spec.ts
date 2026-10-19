import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Radio group component', () => {
  test('rtl example puts radios on the inline-start side and arrow keys move the selection', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'radio-group');
    await demoPage.goto();

    const demo = demoPage.getDemoByName('rtl');
    await demo.scrollIntoViewIfNeeded();
    await expect(demo.locator('[data-slot="preview"]')).toHaveAttribute('dir', 'rtl');

    const radios = demo.locator('input[type="radio"], [role="radio"]');
    await expect(radios).toHaveCount(2);
    const radioBox = (await radios.first().boundingBox())!;
    const labelBox = (await demo.locator('[z-field-label]').first().boundingBox())!;
    expect(radioBox.x).toBeGreaterThan(labelBox.x);

    // arrow keys follow the reading direction: ArrowLeft moves to the next radio, ArrowRight back
    await radios.first().focus();
    await page.keyboard.press('ArrowLeft');
    await expect(radios.nth(1)).toBeFocused();
    await expect(radios.nth(1)).toHaveAttribute('aria-checked', 'true');
    await page.keyboard.press('ArrowRight');
    await expect(radios.first()).toHaveAttribute('aria-checked', 'true');

    await checkA11y(page, '#rtl', ['color-contrast']);
  });
});
