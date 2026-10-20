import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Message RTL', () => {
  test('RTL example flips the start/end alignment', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'message');
    await demoPage.goto();

    const rtlDemo = demoPage.getDemoByName('rtl');
    await rtlDemo.scrollIntoViewIfNeeded();
    const preview = rtlDemo.locator('[data-slot="preview"]');
    await expect(preview).toHaveAttribute('dir', 'rtl');
    const messages = preview.locator('z-message');
    await expect(messages).toHaveCount(3);
    // zAlign="end" sits at the inline-end edge: the left side in RTL, the opposite of the start-aligned message.
    const endAligned = await messages.nth(0).locator('z-message-avatar').boundingBox();
    const startAligned = await messages.nth(1).locator('z-message-avatar').boundingBox();
    expect(endAligned!.x).toBeLessThan(startAligned!.x);

    await checkA11y(page, '[id="rtl"]', ['image-alt']);
  });
});
