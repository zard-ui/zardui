import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Dropdown component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'dropdown');
    await demoPage.goto();
  });

  async function loadExamples() {
    await demoPage.page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
    });
    await demoPage.page.locator('#examples').waitFor({ state: 'attached', timeout: 10_000 });
    await demoPage.page.locator('#examples').scrollIntoViewIfNeeded({ timeout: 5000 });
  }

  test('renders trigger button', async () => {
    const trigger = demoPage.firstDemoBox.locator('[z-dropdown]');
    await expect(trigger).toBeVisible();
  });

  test('opens dropdown menu on click', async ({ page }) => {
    const trigger = demoPage.firstDemoBox.locator('[z-dropdown]');
    await trigger.click();

    const menu = page.locator('[role="menu"]');
    await expect(menu).toBeVisible({ timeout: 5000 });
  });

  test('shows menu items when open', async ({ page }) => {
    const trigger = demoPage.firstDemoBox.locator('[z-dropdown]');
    await trigger.click();

    const menu = page.locator('[role="menu"]');
    await expect(menu).toBeVisible({ timeout: 5000 });

    const items = page.locator('[role="menuitem"]');
    await expect(items.first()).toBeVisible({ timeout: 3000 });
  });

  test('has a disabled menu item', async ({ page }) => {
    const trigger = demoPage.firstDemoBox.locator('[z-dropdown]');
    await trigger.click();

    const menu = page.locator('[role="menu"]');
    await expect(menu).toBeVisible({ timeout: 5000 });

    const disabledItem = page.locator('[role="menuitem"][data-disabled]');
    await expect(disabledItem).toBeVisible({ timeout: 3000 });
  });

  test('renders separators and shortcuts in the menu surface', async ({ page }) => {
    await loadExamples();

    const shortcutsDemo = demoPage.getDemoByName('shortcuts');
    await expect(shortcutsDemo).toBeVisible({ timeout: 5000 });
    await shortcutsDemo.locator('[z-dropdown]').click();

    const menu = page.locator('[role="menu"]').last();
    await expect(menu).toBeVisible({ timeout: 5000 });

    const separator = menu.locator('[data-slot="dropdown-menu-separator"]').first();
    await expect(separator).toHaveAttribute('role', 'separator', { timeout: 3000 });
    await expect(menu.locator('[data-slot="dropdown-menu-shortcut"]').filter({ hasText: '⌘S' })).toBeVisible({
      timeout: 3000,
    });
  });

  test('renders checkbox demo menu items when exposed in examples', async ({ page }) => {
    await loadExamples();

    const checkboxDemo = demoPage.getDemoByName('checkboxes');
    await expect(checkboxDemo).toBeVisible({ timeout: 5000 });
    await checkboxDemo.locator('[z-dropdown]').click();

    const menu = page.locator('[role="menu"]').last();
    await expect(menu).toBeVisible({ timeout: 5000 });
    await expect(menu.getByRole('menuitemcheckbox', { name: /Status Bar/ })).toBeVisible({ timeout: 3000 });
    await expect(menu.getByRole('menuitemcheckbox', { name: /Activity Bar/ })).toBeVisible({ timeout: 3000 });
  });

  test('renders radio group demo menu items when exposed in examples', async ({ page }) => {
    await loadExamples();

    const radioGroupDemo = demoPage.getDemoByName('radio-group');
    await expect(radioGroupDemo).toBeVisible({ timeout: 5000 });
    await radioGroupDemo.locator('[z-dropdown]').click();

    const menu = page.locator('[role="menu"]').last();
    await expect(menu).toBeVisible({ timeout: 5000 });
    await expect(menu.getByRole('menuitemradio', { name: /Top/ })).toBeVisible({ timeout: 3000 });
    await expect(menu.getByRole('menuitemradio', { name: /Bottom/ })).toBeVisible({ timeout: 3000 });
    await expect(menu.getByRole('menuitemradio', { name: /Right/ })).toBeVisible({ timeout: 3000 });
  });

  test('renders submenu demo trigger when exposed in examples', async ({ page }) => {
    await loadExamples();

    const submenuDemo = demoPage.getDemoByName('submenu');
    await expect(submenuDemo).toBeVisible({ timeout: 5000 });
    await submenuDemo.locator('[z-dropdown]').click();

    const menu = page.locator('[role="menu"]').last();
    await expect(menu).toBeVisible({ timeout: 5000 });
    await expect(menu.getByText('More Tools')).toBeVisible({ timeout: 3000 });
  });

  test('closes dropdown when clicking outside', async ({ page }) => {
    const trigger = demoPage.firstDemoBox.locator('[z-dropdown]');
    await trigger.click();

    const menu = page.locator('[role="menu"]');
    await expect(menu).toBeVisible({ timeout: 5000 });

    await page.locator('body').click({ position: { x: 0, y: 0 } });
    await expect(menu).not.toBeVisible({ timeout: 5000 });
  });

  test('navigates items with arrow keys', async ({ page }) => {
    const trigger = demoPage.firstDemoBox.locator('[z-dropdown]');

    // Open dropdown and wait for menu to be both visible AND focused
    const menu = page.locator('[role="menu"]');
    await trigger.click();
    await expect(menu).toBeVisible({ timeout: 5000 });
    await expect(menu).toBeFocused({ timeout: 5000 });

    const items = page.locator('[role="menuitem"]:not([data-disabled])');
    const firstItem = items.first();
    const secondItem = items.nth(1);

    // Use expect().toHaveAttribute() which auto-waits for the condition
    await page.keyboard.press('ArrowDown');
    await expect(firstItem).toHaveAttribute('data-highlighted', '', { timeout: 5000 });

    await page.keyboard.press('ArrowDown');
    await expect(secondItem).toHaveAttribute('data-highlighted', '', { timeout: 5000 });
    await expect(firstItem).not.toHaveAttribute('data-highlighted');

    await page.keyboard.press('ArrowUp');
    await expect(firstItem).toHaveAttribute('data-highlighted', '', { timeout: 5000 });
    await expect(secondItem).not.toHaveAttribute('data-highlighted');
  });

  test('trigger aria-expanded is isolated between dropdowns', async ({ page }) => {
    // The #examples section is inside a @defer(on viewport) block.
    // Scroll to it programmatically to trigger the defer condition,
    // then wait for the element to appear in the DOM.
    await loadExamples();

    const firstTrigger = demoPage.firstDemoBox.locator('[z-dropdown]');
    const secondTrigger = demoPage.getDemoByName('hover').locator('[z-dropdown]');

    await expect(firstTrigger).toHaveAttribute('aria-haspopup', 'menu');
    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(secondTrigger).toHaveAttribute('aria-expanded', 'false');

    await firstTrigger.click();
    const menu = page.locator('[role="menu"]');
    await expect(menu).toBeVisible({ timeout: 5000 });
    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(secondTrigger).toHaveAttribute('aria-expanded', 'false');

    await page.locator('body').click({ position: { x: 0, y: 0 } });
    await expect(menu).not.toBeVisible({ timeout: 5000 });
    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(secondTrigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('passes accessibility checks when open', async ({ page }) => {
    const trigger = demoPage.firstDemoBox.locator('[z-dropdown]');
    await trigger.click();
    await page.locator('[role="menu"]').waitFor({ state: 'visible', timeout: 5000 });
    await checkA11y(page, undefined, ['button-name', 'color-contrast', 'scrollable-region-focusable']);
  });
});
