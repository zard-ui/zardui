import { expect, test } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('InputGroup component (RTL)', () => {
  let rtl: ReturnType<ComponentDemoPage['getDemoByName']>;

  test.beforeEach(async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'input-group');
    await demoPage.goto();
    rtl = demoPage.getDemoByName('rtl');
    await rtl.scrollIntoViewIfNeeded();
    await expect(rtl.locator('[data-slot="preview"]')).toHaveAttribute('dir', 'rtl');
  });

  test('addons follow the reading direction', async () => {
    const group = rtl.locator('z-input-group').first();
    const input = group.locator('input');
    const start = group.locator('z-input-group-addon').first();
    const end = group.locator('z-input-group-addon').last();

    // inline-start addon (icon) is on the right of the input, inline-end addon on the left
    expect((await start.boundingBox())!.x).toBeGreaterThan((await input.boundingBox())!.x);
    expect((await end.boundingBox())!.x).toBeLessThan((await input.boundingBox())!.x);
  });

  test('passes accessibility checks', async ({ page }) => {
    await checkA11y(page, '[id="rtl"]');
  });
});
