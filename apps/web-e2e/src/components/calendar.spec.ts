import { expect, test } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Calendar component (RTL)', () => {
  let rtl: ReturnType<ComponentDemoPage['getDemoByName']>;

  test.beforeEach(async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'calendar');
    await demoPage.goto();
    rtl = demoPage.getDemoByName('rtl');
    await rtl.scrollIntoViewIfNeeded();
    await expect(rtl.locator('[data-slot="preview"]')).toHaveAttribute('dir', 'rtl');
  });

  test('mirrors weeks, navigation and arrow keys', async ({ page }) => {
    const calendar = rtl.locator('z-calendar');
    await expect(calendar).toBeVisible();

    // Weekday headers run right to left: the first column is the right-most one
    const headers = calendar.locator('[role="columnheader"]');
    await expect(headers).toHaveCount(7);
    expect((await headers.first().boundingBox())!.x).toBeGreaterThan((await headers.last().boundingBox())!.x);

    // Previous month sits on the right, next month on the left
    const previous = calendar.locator('z-calendar-navigation button').first();
    const next = calendar.locator('z-calendar-navigation button').nth(1);
    expect((await previous.boundingBox())!.x).toBeGreaterThan((await next.boundingBox())!.x);

    // ArrowLeft moves to the next day
    const selected = calendar.locator('[role="gridcell"][aria-selected="true"] button').first();
    await selected.focus();
    const before = await page.evaluate(() => document.activeElement?.textContent?.trim());
    await page.keyboard.press('ArrowLeft');
    // Focus moves after the grid re-renders, so poll instead of reading it right away.
    await expect
      .poll(async () => Number(await page.evaluate(() => document.activeElement?.textContent?.trim())))
      .toBe(Number(before) + 1);
  });

  test('passes accessibility checks', async ({ page }) => {
    await checkA11y(page, '[id="rtl"]');
  });
});
