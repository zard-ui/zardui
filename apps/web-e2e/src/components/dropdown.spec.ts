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
    const trigger = demoPage.firstDemoCard.locator('button[z-dropdown]');
    await expect(trigger).toBeVisible();
  });

  test('opens dropdown menu on click', async ({ page }) => {
    const trigger = demoPage.firstDemoCard.locator('button[z-dropdown]');
    await trigger.click();

    // Menu renders in CDK overlay with role="menu"
    const menu = page.locator('[role="menu"]');
    await expect(menu).toBeVisible({ timeout: 5000 });
  });

  test('shows menu items when open', async ({ page }) => {
    const trigger = demoPage.firstDemoCard.locator('button[z-dropdown]');
    await trigger.click();

    const menu = page.locator('[role="menu"]');
    await expect(menu).toBeVisible({ timeout: 5000 });

    const items = page.locator('[role="menuitem"]');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
  });

  test('has a disabled menu item', async ({ page }) => {
    const trigger = demoPage.firstDemoCard.locator('button[z-dropdown]');
    await trigger.click();

    const menu = page.locator('[role="menu"]');
    await expect(menu).toBeVisible({ timeout: 5000 });

    const disabledItem = page.locator('[role="menuitem"][data-disabled]');
    await expect(disabledItem).toBeVisible({ timeout: 3000 });
  });

  test('closes dropdown when clicking outside', async ({ page }) => {
    const trigger = demoPage.firstDemoCard.locator('button[z-dropdown]');
    await trigger.click();

    const menu = page.locator('[role="menu"]');
    await expect(menu).toBeVisible({ timeout: 5000 });

    // Click outside the dropdown
    await page.locator('body').click({ position: { x: 0, y: 0 } });
    await expect(menu).not.toBeVisible({ timeout: 5000 });
  });

  test('passes accessibility checks when open', async ({ page }) => {
    const trigger = demoPage.firstDemoCard.locator('button[z-dropdown]');
    await trigger.click();
    await page.locator('[role="menu"]').waitFor({ state: 'visible', timeout: 5000 });
    // button-name: icon-only buttons; color-contrast: theme-dependent; scrollable-region-focusable: CDK overlay
    await checkA11y(page, undefined, ['button-name', 'color-contrast', 'scrollable-region-focusable']);
  });
});
