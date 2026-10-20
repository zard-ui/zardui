import { expect, test } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Field component (RTL)', () => {
  let rtl: ReturnType<ComponentDemoPage['getDemoByName']>;

  test.beforeEach(async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'field');
    await demoPage.goto();
    rtl = demoPage.getDemoByName('rtl');
    await rtl.scrollIntoViewIfNeeded();
    await expect(rtl.locator('[data-slot="preview"]')).toHaveAttribute('dir', 'rtl');
  });

  test('lays the fields out right to left', async () => {
    const checkbox = rtl.locator('[z-checkbox]').first();
    const label = rtl.locator('label[z-field-label]').last();
    // horizontal field: the checkbox comes first, so it sits on the right of its label
    expect((await checkbox.boundingBox())!.x).toBeGreaterThan((await label.boundingBox())!.x);
  });

  test('passes accessibility checks', async ({ page }) => {
    await checkA11y(page, '[id="rtl"]');
  });
});
