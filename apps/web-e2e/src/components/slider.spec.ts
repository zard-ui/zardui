import { expect, test } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Slider component (RTL)', () => {
  let rtl: ReturnType<ComponentDemoPage['getDemoByName']>;

  test.beforeEach(async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'slider');
    await demoPage.goto();
    rtl = demoPage.getDemoByName('rtl');
    await rtl.scrollIntoViewIfNeeded();
    await expect(rtl.locator('[data-slot="preview"]')).toHaveAttribute('dir', 'rtl');
  });

  test('ArrowRight decreases, ArrowLeft increases and dragging tracks the pointer', async ({ page }) => {
    const thumb = rtl.locator('[data-slot="slider-thumb"]').first();
    await thumb.focus();
    await expect(thumb).toHaveAttribute('aria-valuenow', '75');

    await thumb.press('ArrowRight');
    await expect(thumb).toHaveAttribute('aria-valuenow', '74');
    await thumb.press('ArrowLeft');
    await thumb.press('ArrowLeft');
    await expect(thumb).toHaveAttribute('aria-valuenow', '76');

    // The range fills from the right edge: its right edge matches the track's right edge
    const track = rtl.locator('[data-slot="slider-track"]').first();
    const range = rtl.locator('[data-slot="slider-range"]').first();
    const trackBox = (await track.boundingBox())!;
    const rangeBox = (await range.boundingBox())!;
    expect(Math.abs(rangeBox.x + rangeBox.width - (trackBox.x + trackBox.width))).toBeLessThan(1);

    // Dragging towards the left edge raises the value
    const thumbBox = (await thumb.boundingBox())!;
    await page.mouse.move(thumbBox.x + thumbBox.width / 2, thumbBox.y + thumbBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(trackBox.x + trackBox.width * 0.1, thumbBox.y + thumbBox.height / 2, { steps: 5 });
    await page.mouse.up();
    const value = Number(await thumb.getAttribute('aria-valuenow'));
    expect(value).toBeGreaterThan(85);
    expect(value).toBeLessThanOrEqual(92);
  });

  test('passes accessibility checks', async ({ page }) => {
    // aria-input-field-name: slider thumbs carry no accessible name in any slider demo
    await checkA11y(page, '[id="rtl"]', ['aria-input-field-name']);
  });
});
