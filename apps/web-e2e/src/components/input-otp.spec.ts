import { expect, test } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('InputOtp component (RTL)', () => {
  let rtl: ReturnType<ComponentDemoPage['getDemoByName']>;

  test.beforeEach(async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'input-otp');
    await demoPage.goto();
    rtl = demoPage.getDemoByName('rtl');
    await rtl.scrollIntoViewIfNeeded();
    await expect(rtl.locator('[data-slot="preview"]')).toHaveAttribute('dir', 'rtl');
  });

  test('typing advances to the left and ArrowLeft moves forward', async ({ page }) => {
    const slots = rtl.locator('z-input-otp-slot input');
    await expect(slots).toHaveCount(6);

    const box = async (index: number) => (await slots.nth(index).boundingBox())!;
    // The first slot sits on the right, the last one on the left
    expect((await box(0)).x).toBeGreaterThan((await box(5)).x);

    await slots.nth(0).focus();
    await page.keyboard.type('12');
    await expect(slots.nth(2)).toBeFocused();

    await page.keyboard.press('ArrowLeft');
    await expect(slots.nth(3)).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(slots.nth(2)).toBeFocused();
  });

  test('passes accessibility checks', async ({ page }) => {
    await checkA11y(page, '[id="rtl"]');
  });
});
