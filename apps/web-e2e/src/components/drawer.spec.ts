import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

const PANEL = '.cdk-overlay-container z-drawer-panel';

test.describe('Drawer component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'drawer');
    await demoPage.goto();
  });

  test('renders trigger button', async () => {
    await expect(demoPage.firstDemoBox.locator('button[z-button]').first()).toBeVisible();
  });

  test('opens the drawer on trigger click', async ({ page }) => {
    await demoPage.firstDemoBox.locator('button[z-button]').first().click();

    const panel = page.locator(PANEL);
    await expect(panel).toBeVisible({ timeout: 5000 });
    await expect(panel).toHaveAttribute('role', 'dialog');
    // The first demo is a side panel where there is room and a bottom sheet where there is not.
    await expect(panel).toHaveAttribute('data-placement', 'right');
    await expect(panel).toHaveAttribute('data-axis', 'x');
  });

  test('names the drawer with its title', async ({ page }) => {
    await demoPage.firstDemoBox.locator('button[z-button]').first().click();

    const panel = page.locator(PANEL);
    await expect(panel).toBeVisible({ timeout: 5000 });

    const labelledBy = await panel.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    await expect(page.locator(`#${labelledBy}`)).toBeVisible();
  });

  test('closes on Escape', async ({ page }) => {
    await demoPage.firstDemoBox.locator('button[z-button]').first().click();

    const panel = page.locator(PANEL);
    await expect(panel).toBeVisible({ timeout: 5000 });

    await page.keyboard.press('Escape');
    await expect(panel).toHaveCount(0, { timeout: 5000 });
  });

  test('closes from a [z-drawer-close] control', async ({ page }) => {
    await demoPage.firstDemoBox.locator('button[z-button]').first().click();

    const panel = page.locator(PANEL);
    await expect(panel).toBeVisible({ timeout: 5000 });

    await panel.locator('[data-slot="drawer-close"]').first().click();
    await expect(panel).toHaveCount(0, { timeout: 5000 });
  });

  test('passes accessibility checks when open', async ({ page }) => {
    await demoPage.firstDemoBox.locator('button[z-button]').first().click();
    await page.locator(PANEL).waitFor({ state: 'visible', timeout: 5000 });
    await checkA11y(page, undefined, ['button-name', 'color-contrast', 'label', 'scrollable-region-focusable']);
  });
});
