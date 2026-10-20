import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Switch component', () => {
  test('rtl example moves the thumb to the left when checked', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'switch');
    await demoPage.goto();

    const demo = demoPage.getDemoByName('rtl');
    await demo.scrollIntoViewIfNeeded();
    await expect(demo.locator('[data-slot="preview"]')).toHaveAttribute('dir', 'rtl');

    const toggle = demo.locator('[role="switch"]');
    const thumb = toggle.locator('[data-state]').last();
    const trackBox = (await toggle.boundingBox())!;

    // unchecked: thumb rests on the inline-start (right) side
    const offBox = (await thumb.boundingBox())!;
    expect(offBox.x + offBox.width / 2).toBeGreaterThan(trackBox.x + trackBox.width / 2);

    await toggle.click();
    await expect(toggle).toBeChecked();
    // checked: thumb slides to the physical left
    await expect
      .poll(async () => {
        const box = (await thumb.boundingBox())!;
        return box.x + box.width / 2 < trackBox.x + trackBox.width / 2;
      })
      .toBe(true);

    await checkA11y(page, '#rtl', ['color-contrast']);
  });
});
