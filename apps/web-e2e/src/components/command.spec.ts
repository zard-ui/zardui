import { expect, test } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Command component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'command');
    await demoPage.goto();
  });

  async function openRtlDemo() {
    await demoPage.page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    const demo = demoPage.getDemoByName('rtl');
    await demo.waitFor({ state: 'attached', timeout: 15_000 });
    await demo.scrollIntoViewIfNeeded();
    return demo;
  }

  test('renders the command with its input', async () => {
    await expect(demoPage.firstDemoBox.locator('z-command')).toBeVisible();
    await expect(demoPage.firstDemoBox.locator('z-command-input input')).toBeVisible();
  });

  test('RTL example lays the list out from the right and keeps shortcuts on the inline-end side', async () => {
    const demo = await openRtlDemo();
    const preview = demo.locator('[data-slot="preview"]');
    await expect(preview).toHaveAttribute('dir', 'rtl');

    const option = preview.locator('z-command-option', { hasText: 'الملف الشخصي' });
    await expect(option).toBeVisible();

    const label = option.locator('span.flex-1');
    const shortcut = option.locator('[data-slot="command-shortcut"], kbd, span.ms-auto').last();
    const optionBox = await option.boundingBox();
    const labelBox = await label.boundingBox();
    const shortcutBox = await shortcut.boundingBox();

    // The label starts at the right edge and the shortcut sits on the left (inline-end in RTL).
    expect(labelBox!.x + labelBox!.width).toBeGreaterThan(optionBox!.x + optionBox!.width / 2);
    expect(shortcutBox!.x + shortcutBox!.width / 2).toBeLessThan(optionBox!.x + optionBox!.width / 2);
  });

  test('passes accessibility checks in the RTL example', async ({ page }) => {
    const demo = await openRtlDemo();
    await expect(demo.locator('z-command')).toBeVisible();
    // The listbox/combobox structure of the command is shared with every other demo (aria-required-attr on the root,
    // a separator inside the listbox): it is not specific to the RTL example.
    await checkA11y(page, '[id="rtl"] [data-slot="preview"]', [
      'button-name',
      'color-contrast',
      'aria-required-attr',
      'aria-required-children',
    ]);
  });
});
