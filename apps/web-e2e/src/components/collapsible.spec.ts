import { expect, test } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Collapsible RTL', () => {
  test('renders the rtl example mirrored', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'collapsible');
    await demoPage.goto();

    const rtl = demoPage.getDemoByName('rtl');
    await rtl.scrollIntoViewIfNeeded();
    const preview = rtl.locator('[data-slot="preview"]');
    await expect(preview).toHaveAttribute('dir', 'rtl');
    await expect(preview).toHaveAttribute('data-lang', 'ar');

    const trigger = preview.locator('[z-collapsible-trigger]');
    const header = await preview.locator('h4').boundingBox();
    const triggerBox = await trigger.boundingBox();
    // The title is on the inline start (right), the toggle on the inline end (left).
    expect(triggerBox!.x).toBeLessThan(header!.x);
    const content = preview.locator('z-collapsible-content');
    await expect(content).toHaveAttribute('data-state', 'closed');
    await trigger.click();
    await expect(content).toHaveAttribute('data-state', 'open');
    // The chevrons icon is vertical and must stay unflipped.
    const rotate = await trigger.locator('ng-icon').evaluate(el => getComputedStyle(el).rotate);
    expect(rotate).toBe('none');

    await checkA11y(page, '#rtl z-demo-collapsible-rtl', ['color-contrast', 'button-name']);
  });
});
