import { expect, test } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Hover card component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'hover-card');
    await demoPage.goto();
  });

  async function openRtlDemo() {
    await demoPage.page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    const demo = demoPage.getDemoByName('rtl');
    await demo.waitFor({ state: 'attached', timeout: 15_000 });
    await demo.scrollIntoViewIfNeeded();
    return demo;
  }

  test('opens the card when hovering the trigger', async ({ page }) => {
    await demoPage.firstDemoBox.locator('[zHoverCard], [z-button]').first().hover();
    await expect(page.locator('[data-slot="hover-card-content"]')).toBeVisible({ timeout: 5000 });
  });

  test('RTL example resolves inline sides against the direction of the trigger', async ({ page }) => {
    const demo = await openRtlDemo();
    await expect(demo.locator('[data-slot="preview"]')).toHaveAttribute('dir', 'rtl');

    const inlineStart = demo.locator('[data-slot="preview"] button', { hasText: 'بداية السطر' });
    const inlineEnd = demo.locator('[data-slot="preview"] button', { hasText: 'نهاية السطر' });
    const card = page.locator('[data-slot="hover-card-content"]');

    await inlineStart.hover();
    await expect(card).toBeVisible({ timeout: 5000 });
    await expect(card.locator('xpath=ancestor::*[@dir][1]')).toHaveAttribute('dir', 'rtl');
    // inline-start is the physical right in RTL.
    await expect(card).toHaveAttribute('data-side', 'right');
    const startTrigger = await inlineStart.boundingBox();
    const startCard = await card.boundingBox();
    expect(startCard!.x).toBeGreaterThanOrEqual(startTrigger!.x + startTrigger!.width - 1);

    await page.mouse.move(5, 5);
    await expect(card).toBeHidden({ timeout: 5000 });

    await inlineEnd.hover();
    await expect(card).toBeVisible({ timeout: 5000 });
    await expect(card).toHaveAttribute('data-side', 'left');
    const endTrigger = await inlineEnd.boundingBox();
    const endCard = await card.boundingBox();
    expect(endCard!.x + endCard!.width).toBeLessThanOrEqual(endTrigger!.x + 1);
  });

  test('passes accessibility checks when open', async ({ page }) => {
    const demo = await openRtlDemo();
    await demo.locator('[data-slot="preview"] button').first().hover();
    await expect(page.locator('[data-slot="hover-card-content"]')).toBeVisible({ timeout: 5000 });
    await checkA11y(page, '[data-slot="hover-card-content"]', ['button-name', 'color-contrast']);
  });
});
