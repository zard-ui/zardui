import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Pagination RTL', () => {
  test('RTL example translates the labels and points the chevrons outward', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'pagination');
    await demoPage.goto();

    const rtlDemo = demoPage.getDemoByName('rtl');
    await rtlDemo.scrollIntoViewIfNeeded();
    const preview = rtlDemo.locator('[data-slot="preview"]');
    await expect(preview).toHaveAttribute('dir', 'rtl');
    const previous = preview.locator('z-pagination-previous button');
    const next = preview.locator('z-pagination-next button');
    await expect(previous).toContainText('السابق');
    await expect(next).toContainText('التالي');
    // Previous is on the right in RTL, and its chevron is flipped to point outward.
    const prevBox = await previous.boundingBox();
    const nextBox = await next.boundingBox();
    expect(prevBox!.x).toBeGreaterThan(nextBox!.x);
    await expect.poll(() => previous.locator('ng-icon').evaluate(el => getComputedStyle(el).rotate)).toBe('180deg');

    await checkA11y(page, '[id="rtl"]', []);
  });
});
