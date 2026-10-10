import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Progress RTL', () => {
  test('RTL example fills from the inline-start (right) edge', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'progress');
    await demoPage.goto();

    const rtlDemo = demoPage.getDemoByName('rtl');
    await rtlDemo.scrollIntoViewIfNeeded();
    const preview = rtlDemo.locator('[data-slot="preview"]');
    await expect(preview).toHaveAttribute('dir', 'rtl');
    const indicator = preview.locator('[data-slot="progress-indicator"]');
    await expect(indicator).toHaveAttribute('style', /translateX\(34%\)/);
    const track = await preview.locator('z-progress').boundingBox();
    const fill = await indicator.boundingBox();
    // The visible fill stays anchored to the right edge of the track.
    expect(Math.round(fill!.x + fill!.width)).toBeGreaterThanOrEqual(Math.round(track!.x + track!.width));

    await checkA11y(page, '[id="rtl"]', ['aria-progressbar-name']);
  });
});
