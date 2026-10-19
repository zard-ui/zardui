import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Marker RTL', () => {
  test('RTL example renders markers inside an RTL preview', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'marker');
    await demoPage.goto();

    const rtlDemo = demoPage.getDemoByName('rtl');
    await rtlDemo.scrollIntoViewIfNeeded();
    const preview = rtlDemo.locator('[data-slot="preview"]');
    await expect(preview).toHaveAttribute('dir', 'rtl');
    const marker = preview.locator('z-marker').first();
    await expect(marker.locator('z-marker-content')).toContainText('فرع');
    // The icon sits at the inline-start edge, which is the right edge in RTL.
    const icon = await marker.locator('z-marker-icon').boundingBox();
    const content = await marker.locator('z-marker-content').boundingBox();
    expect(icon!.x).toBeGreaterThan(content!.x);

    await checkA11y(page, '[id="rtl"]', []);
  });
});
