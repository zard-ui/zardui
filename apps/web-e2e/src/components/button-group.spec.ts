import { expect, test } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('ButtonGroup component (RTL)', () => {
  let rtl: ReturnType<ComponentDemoPage['getDemoByName']>;

  test.beforeEach(async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'button-group');
    await demoPage.goto();
    rtl = demoPage.getDemoByName('rtl');
    await rtl.scrollIntoViewIfNeeded();
    await expect(rtl.locator('[data-slot="preview"]')).toHaveAttribute('dir', 'rtl');
  });

  test('groups join with logical borders and the back arrow flips', async () => {
    const buttons = rtl.locator('z-button-group button[z-button]');
    const archive = buttons.nth(1);
    const report = buttons.nth(2);

    // The first button of a pair is on the right in RTL
    expect((await archive.boundingBox())!.x).toBeGreaterThan((await report.boundingBox())!.x);

    // The first button keeps its outer (right) corners and loses the inner (left) ones
    const radii = await archive.evaluate(el => {
      const style = getComputedStyle(el);
      return { right: style.borderTopRightRadius, left: style.borderTopLeftRadius };
    });
    expect(radii.left).toBe('0px');
    expect(radii.right).not.toBe('0px');

    await expect(rtl.locator('[data-slot="preview"] ng-icon').first()).toHaveClass(/rtl:rotate-180/);
  });

  test('passes accessibility checks', async ({ page }) => {
    // aria-allowed-attr: the group sets aria-orientation on role="group" (same in every button-group demo)
    await checkA11y(page, '[id="rtl"]', ['aria-allowed-attr']);
  });
});
