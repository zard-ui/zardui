import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Resizable component RTL', () => {
  test('ArrowLeft on the handle grows the panel on the right', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'resizable');
    await demoPage.goto();

    const demo = demoPage.getDemoByName('rtl');
    await demo.scrollIntoViewIfNeeded();
    await expect(demo.locator('[data-slot="preview"]')).toHaveAttribute('dir', 'rtl');

    const panels = demo.locator('[data-slot="resizable-panel"]');
    const handle = demo.locator('[data-slot="resizable-handle"]').first();

    // The first panel is the one on the right.
    const firstBefore = (await panels.first().boundingBox())!;
    const secondBefore = (await panels.nth(1).boundingBox())!;
    expect(firstBefore.x).toBeGreaterThan(secondBefore.x);

    await handle.focus();
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('ArrowLeft');
    }

    const firstAfter = (await panels.first().boundingBox())!;
    expect(firstAfter.width).toBeGreaterThan(firstBefore.width);

    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('ArrowRight');
    }
    const firstShrunk = (await panels.first().boundingBox())!;
    expect(firstShrunk.width).toBeLessThan(firstBefore.width);

    // aria-required-attr: the separators have no aria-valuenow, which every resizable demo shares (pre-existing).
    await checkA11y(page, '#rtl', ['button-name', 'color-contrast', 'aria-required-attr']);
  });
});
