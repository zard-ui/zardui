import { expect, test } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Bubble RTL', () => {
  test('renders the rtl example mirrored', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'bubble');
    await demoPage.goto();

    const rtl = demoPage.getDemoByName('rtl');
    await rtl.scrollIntoViewIfNeeded();
    const preview = rtl.locator('[data-slot="preview"]');
    await expect(preview).toHaveAttribute('dir', 'rtl');
    await expect(preview).toHaveAttribute('data-lang', 'ar');

    const bubbles = preview.locator('z-bubble');
    await expect(bubbles).toHaveCount(3);
    const end = await bubbles.nth(0).locator('z-bubble-content').boundingBox();
    const start = await bubbles.nth(1).locator('z-bubble-content').boundingBox();
    // zAlign="end" is the left edge in RTL, zAlign="start" the right edge.
    expect(end!.x + end!.width / 2).toBeLessThan(start!.x + start!.width / 2);
    const reactions = preview.locator('z-bubble-reactions').first();
    await expect(reactions).toHaveClass(/start-3/);

    await checkA11y(page, '#rtl z-demo-bubble-rtl', ['color-contrast', 'button-name']);
  });
});
