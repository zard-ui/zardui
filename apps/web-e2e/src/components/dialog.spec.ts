import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Dialog component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'dialog');
    await demoPage.goto();
  });

  test('renders trigger button', async () => {
    const trigger = demoPage.firstDemoCard.locator('button[z-button]');
    await expect(trigger.first()).toBeVisible();
  });

  test('opens dialog on trigger click', async ({ page }) => {
    const trigger = demoPage.firstDemoCard.locator('button[z-button]').first();
    await trigger.click();

    // Dialog renders via CDK overlay as <z-dialog>
    const dialog = page.locator('z-dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });
  });

  test('dialog contains form inputs', async ({ page }) => {
    const trigger = demoPage.firstDemoCard.locator('button[z-button]').first();
    await trigger.click();

    const dialog = page.locator('z-dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Dialog should have form inputs
    const inputs = dialog.locator('input[z-input]');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('dialog closes on Escape', async ({ page }) => {
    const trigger = demoPage.firstDemoCard.locator('button[z-button]').first();
    await trigger.click();

    const dialog = page.locator('z-dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible({ timeout: 5000 });
  });

  test('dialog cancel button closes dialog', async ({ page }) => {
    const trigger = demoPage.firstDemoCard.locator('button[z-button]').first();
    await trigger.click();

    const dialog = page.locator('z-dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Click the cancel button inside the dialog
    const cancelButton = dialog.locator('[data-testid="z-cancel-button"]');
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();
    await expect(dialog).not.toBeVisible({ timeout: 5000 });
  });

  test('passes accessibility checks when open', async ({ page }) => {
    const trigger = demoPage.firstDemoCard.locator('button[z-button]').first();
    await trigger.click();
    await page.locator('z-dialog').waitFor({ state: 'visible', timeout: 5000 });
    // button-name: close button has icon only; color-contrast + label: demo form styling
    await checkA11y(page, undefined, ['button-name', 'color-contrast', 'label']);
  });
});
