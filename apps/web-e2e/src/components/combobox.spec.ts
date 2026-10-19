import { expect, test } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Combobox component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'combobox');
    await demoPage.goto();
  });

  async function openRtlDemo() {
    await demoPage.page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    const demo = demoPage.getDemoByName('rtl');
    await demo.waitFor({ state: 'attached', timeout: 15_000 });
    await demo.scrollIntoViewIfNeeded();
    return demo;
  }

  test('renders the combobox input', async () => {
    await expect(demoPage.firstDemoBox.locator('input[role="combobox"]').first()).toBeVisible();
  });

  test('RTL example opens a panel aligned to the inline-start edge of the anchor', async ({ page }) => {
    const demo = await openRtlDemo();
    await expect(demo.locator('[data-slot="preview"]')).toHaveAttribute('dir', 'rtl');

    const anchor = demo.locator('[data-slot="preview"] z-combobox-chips');
    await demo.locator('[data-slot="preview"] input[z-combobox-chips-input]').click();

    const panel = page.locator('[data-slot="combobox-content"]');
    await expect(panel).toBeVisible({ timeout: 5000 });
    await expect(panel.locator('xpath=ancestor::*[@dir][1]')).toHaveAttribute('dir', 'rtl');
    await expect(panel).toHaveAttribute('data-side', 'bottom');

    // The panel grows from the anchor's right edge (inline-start in RTL), and its animation starts there.
    const anchorBox = await anchor.boundingBox();
    const panelBox = await panel.boundingBox();
    expect(panelBox!.x + panelBox!.width).toBeCloseTo(anchorBox!.x + anchorBox!.width, -1);
    const origin = await panel.evaluate(el =>
      (el as HTMLElement).style.getPropertyValue('--z-combobox-transform-origin'),
    );
    expect(origin).toBe('top right');
  });

  test('passes accessibility checks when open', async ({ page }) => {
    const demo = await openRtlDemo();
    await demo.locator('[data-slot="preview"] input[z-combobox-chips-input]').click();
    await expect(page.locator('[data-slot="combobox-content"]')).toBeVisible({ timeout: 5000 });
    await checkA11y(page, '[data-slot="combobox-content"]', ['button-name', 'color-contrast']);
  });
});
