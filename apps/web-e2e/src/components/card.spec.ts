import { expect, test } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Card RTL', () => {
  test('renders the rtl example mirrored', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'card');
    await demoPage.goto();

    const rtl = demoPage.getDemoByName('rtl');
    await rtl.scrollIntoViewIfNeeded();
    const preview = rtl.locator('[data-slot="preview"]');
    await expect(preview).toHaveAttribute('dir', 'rtl');
    await expect(preview).toHaveAttribute('data-lang', 'ar');

    const card = await preview.locator('z-card').boundingBox();
    const action = await preview.locator('z-card-action').boundingBox();
    const title = await preview.locator('z-card-title').boundingBox();
    // The header action sits on the inline end (left), the title on the inline start (right).
    expect(action!.x + action!.width / 2).toBeLessThan(card!.x + card!.width / 2);
    expect(title!.x + title!.width / 2).toBeGreaterThan(card!.x + card!.width / 2);
    const forgot = await preview.locator('a.ms-auto').boundingBox();
    expect(forgot!.x + forgot!.width / 2).toBeLessThan(card!.x + card!.width / 2);

    await checkA11y(page, '#rtl z-demo-card-rtl', ['color-contrast', 'button-name']);
  });
});
