import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Carousel component RTL', () => {
  test('ArrowLeft goes to the next slide and the arrows swap sides', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'carousel');
    await demoPage.goto();

    const demo = demoPage.getDemoByName('rtl');
    await demo.scrollIntoViewIfNeeded();
    await expect(demo.locator('[data-slot="preview"]')).toHaveAttribute('dir', 'rtl');

    const carousel = demo.locator('z-carousel [role="region"]');
    const previous = demo.getByRole('button', { name: 'Previous slide' });
    const next = demo.getByRole('button', { name: 'Next slide' });

    const previousBox = (await previous.boundingBox())!;
    const nextBox = (await next.boundingBox())!;
    expect(previousBox.x).toBeGreaterThan(nextBox.x);

    await expect(next).toBeEnabled();
    await expect(previous).toBeDisabled();

    const firstItem = demo.locator('z-carousel-item').first();
    const regionX = (await carousel.boundingBox())!.x;
    const firstItemX = async () => (await firstItem.boundingBox())!.x;

    // The next slide is on the left in RTL, so the first slide moves to the right once it scrolls past.
    await carousel.focus();
    await page.keyboard.press('ArrowLeft');
    await expect.poll(firstItemX).toBeGreaterThan(regionX + 100);
    await expect(previous).toBeEnabled();

    await page.keyboard.press('ArrowRight');
    await expect.poll(async () => Math.abs((await firstItemX()) - regionX)).toBeLessThan(2);
    await expect(previous).toBeDisabled();

    await checkA11y(page, '#rtl', ['button-name', 'color-contrast']);
  });
});
