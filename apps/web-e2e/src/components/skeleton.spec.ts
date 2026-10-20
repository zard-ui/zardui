import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Skeleton RTL', () => {
  test('RTL example puts the avatar at the inline-start edge', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'skeleton');
    await demoPage.goto();

    const rtlDemo = demoPage.getDemoByName('rtl');
    await rtlDemo.scrollIntoViewIfNeeded();
    const preview = rtlDemo.locator('[data-slot="preview"]');
    await expect(preview).toHaveAttribute('dir', 'rtl');
    const circle = await preview.locator('z-skeleton').first().boundingBox();
    const line = await preview.locator('z-skeleton').nth(1).boundingBox();
    expect(circle!.x).toBeGreaterThan(line!.x);

    await checkA11y(page, '[id="rtl"]', []);
  });
});
