import { expect, test } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('DatePicker component (RTL)', () => {
  let rtl: ReturnType<ComponentDemoPage['getDemoByName']>;

  test.beforeEach(async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'date-picker');
    await demoPage.goto();
    rtl = demoPage.getDemoByName('rtl');
    await rtl.scrollIntoViewIfNeeded();
    await expect(rtl.locator('[data-slot="preview"]')).toHaveAttribute('dir', 'rtl');
  });

  test('opens a mirrored calendar popover', async ({ page }) => {
    await rtl.locator('z-date-picker button').click();

    const calendar = page.locator('.cdk-overlay-container z-calendar');
    await expect(calendar).toBeVisible();
    await expect(page.locator('.cdk-overlay-container [dir="rtl"]').first()).toBeAttached();

    const headers = calendar.locator('[role="columnheader"]');
    expect((await headers.first().boundingBox())!.x).toBeGreaterThan((await headers.last().boundingBox())!.x);
  });

  test('passes accessibility checks', async ({ page }) => {
    await checkA11y(page, '[id="rtl"]');
  });
});
