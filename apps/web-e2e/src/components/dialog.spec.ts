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
    const trigger = demoPage.firstDemoBox.locator('button[z-button]');
    await expect(trigger.first()).toBeVisible();
  });

  test('opens dialog on trigger click', async ({ page }) => {
    const trigger = demoPage.firstDemoBox.locator('button[z-button]').first();
    await trigger.click();

    const dialog = page.locator('.cdk-overlay-container z-dialog-panel');
    await expect(dialog).toBeVisible({ timeout: 5000 });
  });

  test('dialog contains form inputs', async ({ page }) => {
    const trigger = demoPage.firstDemoBox.locator('button[z-button]').first();
    await trigger.click();

    const dialog = page.locator('.cdk-overlay-container z-dialog-panel');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    const inputs = dialog.locator('input[z-input]');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('dialog closes on Escape', async ({ page }) => {
    const trigger = demoPage.firstDemoBox.locator('button[z-button]').first();
    await trigger.click();

    const dialog = page.locator('.cdk-overlay-container z-dialog-panel');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible({ timeout: 5000 });
  });

  test('dialog cancel button closes dialog', async ({ page }) => {
    const trigger = demoPage.firstDemoBox.locator('button[z-button]').first();
    await trigger.click();

    const dialog = page.locator('.cdk-overlay-container z-dialog-panel');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // The preview's first tab is the declarative form, whose Cancel is a [z-dialog-close] button.
    const cancelButton = dialog.getByRole('button', { name: 'Cancel' });
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();
    await expect(dialog).not.toBeVisible({ timeout: 5000 });
  });

  test('passes accessibility checks when open', async ({ page }) => {
    const trigger = demoPage.firstDemoBox.locator('button[z-button]').first();
    await trigger.click();
    await page.locator('.cdk-overlay-container z-dialog-panel').waitFor({ state: 'visible', timeout: 5000 });
    await checkA11y(page, undefined, ['button-name', 'color-contrast', 'label', 'scrollable-region-focusable']);
  });
});

test.describe('Dialog component RTL', () => {
  test('mirrors the close button and footer, and keeps the panel centered', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'dialog');
    await demoPage.goto();

    const demo = demoPage.getDemoByName('rtl');
    await demo.scrollIntoViewIfNeeded();
    await expect(demo.locator('[data-slot="preview"]')).toHaveAttribute('dir', 'rtl');

    await demo.locator('[data-slot="preview"] button[z-button]').first().click();

    const panel = page.locator('.cdk-overlay-container z-dialog-panel');
    await expect(panel).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.cdk-overlay-container [dir="rtl"]').first()).toBeAttached();

    const panelBox = (await panel.boundingBox())!;
    const closeBox = (await panel.locator('[data-testid="z-close-header-button"]').boundingBox())!;
    expect(closeBox.x + closeBox.width / 2).toBeLessThan(panelBox.x + panelBox.width / 2);

    const viewport = page.viewportSize()!;
    expect(Math.abs(panelBox.x + panelBox.width / 2 - viewport.width / 2)).toBeLessThan(2);

    const buttons = panel.locator('z-dialog-footer button[z-button]');
    const first = (await buttons.nth(0).boundingBox())!;
    const second = (await buttons.nth(1).boundingBox())!;
    expect(first.x).toBeGreaterThan(second.x);

    await checkA11y(page, undefined, ['button-name', 'color-contrast', 'label', 'scrollable-region-focusable']);
  });
});
