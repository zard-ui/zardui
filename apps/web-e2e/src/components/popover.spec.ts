import { expect, test } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Popover component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'popover');
    await demoPage.goto();
  });

  async function openRtlDemo() {
    await demoPage.page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    const demo = demoPage.getDemoByName('rtl');
    await demo.waitFor({ state: 'attached', timeout: 15_000 });
    await demo.scrollIntoViewIfNeeded();
    return demo;
  }

  test('opens the first demo popover', async ({ page }) => {
    await demoPage.firstDemoBox.locator('[zpopover], [z-button]').first().click();
    await expect(page.locator('[data-slot="popover-content"]')).toBeVisible({ timeout: 5000 });
  });

  test('RTL example opens panels in the direction of the trigger', async ({ page }) => {
    const demo = await openRtlDemo();
    await expect(demo.locator('[data-slot="preview"]')).toHaveAttribute('dir', 'rtl');

    const inlineStart = demo.locator('[data-slot="preview"] button', { hasText: 'بداية السطر' });
    const inlineEnd = demo.locator('[data-slot="preview"] button', { hasText: 'نهاية السطر' });
    const panel = page.locator('[data-slot="popover-content"]');

    // The panel is portalled out of the preview: it must still carry the trigger's direction.
    await inlineStart.click();
    await expect(panel).toBeVisible({ timeout: 5000 });
    await expect(panel.locator('xpath=ancestor::*[@dir][1]')).toHaveAttribute('dir', 'rtl');
    await expect(panel).toHaveAttribute('data-side', 'inline-start');

    // inline-start is the physical right in RTL.
    // Measured after the enter animation, which slides the panel a few pixels.
    const triggerBox = await inlineStart.boundingBox();
    await expect
      .poll(async () => (await panel.boundingBox())!.x)
      .toBeGreaterThanOrEqual(triggerBox!.x + triggerBox!.width - 1);

    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden({ timeout: 5000 });

    // inline-end is the physical left in RTL.
    await inlineEnd.click();
    await expect(panel).toBeVisible({ timeout: 5000 });
    const endTrigger = await inlineEnd.boundingBox();
    await expect
      .poll(async () => {
        const endPanel = (await panel.boundingBox())!;
        return endPanel.x + endPanel.width;
      })
      .toBeLessThanOrEqual(endTrigger!.x + 1);
  });

  test('an ordinary example next to the RTL one keeps its own direction', async ({ page }) => {
    const demo = await openRtlDemo();
    await demo.locator('[data-slot="preview"] button').first().click();
    const rtlPanel = page.locator('[data-slot="popover-content"]');
    await expect(rtlPanel).toBeVisible({ timeout: 5000 });
    await expect(rtlPanel.locator('xpath=ancestor::*[@dir][1]')).toHaveAttribute('dir', 'rtl');
    await page.keyboard.press('Escape');
    await expect(rtlPanel).toBeHidden({ timeout: 5000 });

    const basic = demoPage.getDemoByName('basic');
    await basic.scrollIntoViewIfNeeded();
    await expect(basic.locator('[data-slot="preview"]')).toHaveAttribute('dir', 'ltr');
    await basic.locator('[data-slot="preview"] button').first().click();
    const panel = page.locator('[data-slot="popover-content"]');
    await expect(panel).toBeVisible({ timeout: 5000 });
    await expect(panel.locator('xpath=ancestor::*[@dir][1]')).toHaveAttribute('dir', 'ltr');
  });

  test('passes accessibility checks when open', async ({ page }) => {
    const demo = await openRtlDemo();
    await demo.locator('[data-slot="preview"] button').first().click();
    await expect(page.locator('[data-slot="popover-content"]')).toBeVisible({ timeout: 5000 });
    await checkA11y(page, '[data-slot="popover-content"]', ['button-name', 'color-contrast']);
  });
});
