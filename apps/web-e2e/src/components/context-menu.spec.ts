import { expect, test } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Context menu component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'context-menu');
    await demoPage.goto();
  });

  /** The pointer lands near the corner so the menu it opens never covers the point itself. */
  async function rightClickTrigger() {
    const trigger = demoPage.firstDemoBox.locator('[z-context-menu]').first();
    const box = await trigger.boundingBox();
    if (!box) throw new Error('context menu trigger has no layout box');

    await demoPage.page.mouse.click(Math.round(box.x + 20), Math.round(box.y + 20), { button: 'right' });
    return trigger;
  }

  test('renders a focusable trigger that starts closed', async () => {
    const trigger = demoPage.firstDemoBox.locator('[z-context-menu]').first();

    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute('data-state', 'closed');
    await expect(trigger).toHaveAttribute('tabindex', '0');
  });

  test('opens the menu at the pointer on right click', async ({ page }) => {
    const trigger = await rightClickTrigger();

    const menu = page.locator('[data-slot="dropdown-menu-content"]');
    await expect(menu).toBeVisible({ timeout: 5000 });
    await expect(menu).toHaveAttribute('role', 'menu');
    await expect(trigger).toHaveAttribute('data-state', 'open');
    await expect(menu.locator('[role="menuitem"]').first()).toBeVisible();
  });

  test('opens the menu from the keyboard', async ({ page }) => {
    const trigger = demoPage.firstDemoBox.locator('[z-context-menu]').first();
    await trigger.focus();
    await page.keyboard.press('Shift+F10');

    await expect(page.locator('[data-slot="dropdown-menu-content"]')).toBeVisible({ timeout: 5000 });
  });

  test('closes on Escape and hands the focus back to the trigger', async ({ page }) => {
    const trigger = await rightClickTrigger();
    const menu = page.locator('[data-slot="dropdown-menu-content"]');
    await expect(menu).toBeVisible({ timeout: 5000 });

    await page.keyboard.press('Escape');

    await expect(menu).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test('closes when clicking outside the menu', async ({ page }) => {
    await rightClickTrigger();
    const menu = page.locator('[data-slot="dropdown-menu-content"]');
    await expect(menu).toBeVisible({ timeout: 5000 });

    await page.mouse.click(20, 400);

    await expect(menu).toHaveCount(0);
  });

  test('opens a submenu on hover and closes the whole stack on selection', async ({ page }) => {
    await rightClickTrigger();
    await expect(page.locator('[data-slot="dropdown-menu-content"]')).toBeVisible({ timeout: 5000 });

    await page.locator('[data-slot="dropdown-menu-sub-trigger"]').hover();
    const submenu = page.locator('[data-slot="dropdown-menu-sub-content"]');
    await expect(submenu).toBeVisible({ timeout: 5000 });

    await submenu.locator('[role="menuitem"]').first().click();

    await expect(submenu).toHaveCount(0);
    await expect(page.locator('[data-slot="dropdown-menu-content"]')).toHaveCount(0);
  });

  test('leaves the native menu to the browser when disabled', async ({ page }) => {
    const disabled = demoPage.getDemoByName('disabled').locator('[z-context-menu]').first();
    await disabled.scrollIntoViewIfNeeded();
    await disabled.click({ button: 'right' });

    await expect(page.locator('[data-slot="dropdown-menu-content"]')).toHaveCount(0);
  });

  test('passes accessibility checks', async ({ page }) => {
    // `button-name` covers the unlabelled copy-page control in the page header, not this component.
    await checkA11y(page, '#overview', ['color-contrast', 'button-name']);
  });
});
