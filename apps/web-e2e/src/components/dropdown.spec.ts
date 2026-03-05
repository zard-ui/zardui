import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Dropdown component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'dropdown');
    await demoPage.goto();
  });

  test('renders trigger button', async () => {
    const trigger = demoPage.firstDemoCard.locator('[z-dropdown]');
    await expect(trigger).toBeVisible();
  });

  test('opens dropdown menu on click', async ({ page }) => {
    const trigger = demoPage.firstDemoCard.locator('[z-dropdown]');
    await trigger.click();

    const menu = page.locator('[role="menu"]');
    await expect(menu).toBeVisible({ timeout: 5000 });
  });

  test('shows menu items when open', async ({ page }) => {
    const trigger = demoPage.firstDemoCard.locator('[z-dropdown]');
    await trigger.click();

    const menu = page.locator('[role="menu"]');
    await expect(menu).toBeVisible({ timeout: 5000 });

    const items = page.locator('[role="menuitem"]');
    await expect(items.first()).toBeVisible({ timeout: 3000 });
    await expect(items.first()).toHaveAttribute('data-highlighted', '', { timeout: 3000 });
  });

  test('has a disabled menu item', async ({ page }) => {
    const trigger = demoPage.firstDemoCard.locator('[z-dropdown]');
    await trigger.click();

    const menu = page.locator('[role="menu"]');
    await expect(menu).toBeVisible({ timeout: 5000 });

    const disabledItem = page.locator('[role="menuitem"][data-disabled]');
    await expect(disabledItem).toBeVisible({ timeout: 3000 });
  });

  test('closes dropdown when clicking outside', async ({ page }) => {
    const trigger = demoPage.firstDemoCard.locator('[z-dropdown]');
    await trigger.click();

    const menu = page.locator('[role="menu"]');
    await expect(menu).toBeVisible({ timeout: 5000 });

    await page.locator('body').click({ position: { x: 0, y: 0 } });
    await expect(menu).not.toBeVisible({ timeout: 5000 });
  });

  test('navigates items with arrow keys', async ({ page }) => {
    const trigger = demoPage.firstDemoCard.locator('[z-dropdown]');
    await trigger.click();

    const menu = page.locator('[role="menu"]');
    await expect(menu).toBeVisible({ timeout: 5000 });

    const items = page.locator('[role="menuitem"]:not([data-disabled])');
    const firstItem = items.first();
    const secondItem = items.nth(1);

    await expect(firstItem).toHaveAttribute('data-highlighted', '', { timeout: 3000 });

    await page.keyboard.press('ArrowDown');
    await expect(secondItem).toHaveAttribute('data-highlighted', '', { timeout: 3000 });
    await expect(firstItem).not.toHaveAttribute('data-highlighted');

    await page.keyboard.press('ArrowUp');
    await expect(firstItem).toHaveAttribute('data-highlighted', '', { timeout: 3000 });
    await expect(secondItem).not.toHaveAttribute('data-highlighted');
  });

  test('trigger aria-expanded is isolated between dropdowns', async ({ page }) => {
    const firstTrigger = demoPage.firstDemoCard.locator('[z-dropdown]');
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
    const trigger = demoPage.firstDemoCard.locator('[z-dropdown]');
    await trigger.click();
    await page.locator('[role="menu"]').waitFor({ state: 'visible', timeout: 5000 });
    await checkA11y(page, undefined, ['button-name', 'color-contrast', 'scrollable-region-focusable']);
  });
});
