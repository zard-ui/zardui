import { expect, test } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Badge RTL', () => {
  test('renders the rtl example mirrored', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'badge');
    await demoPage.goto();

    const rtl = demoPage.getDemoByName('rtl');
    await rtl.scrollIntoViewIfNeeded();
    const preview = rtl.locator('[data-slot="preview"]');
    await expect(preview).toHaveAttribute('dir', 'rtl');
    await expect(preview).toHaveAttribute('data-lang', 'ar');

    const badges = preview.locator('z-badge');
    await expect(badges).toHaveCount(6);
    const verified = badges.nth(4);
    const box = await verified.boundingBox();
    const icon = await verified.locator('ng-icon').boundingBox();
    // inline-start icon is on the right of the label.
    expect(icon!.x + icon!.width / 2).toBeGreaterThan(box!.x + box!.width / 2);
    const bookmark = badges.nth(5);
    const bookmarkBox = await bookmark.boundingBox();
    const bookmarkIcon = await bookmark.locator('ng-icon').boundingBox();
    expect(bookmarkIcon!.x + bookmarkIcon!.width / 2).toBeLessThan(bookmarkBox!.x + bookmarkBox!.width / 2);

    await checkA11y(page, '#rtl z-demo-badge-rtl', ['color-contrast', 'button-name']);
  });
});
