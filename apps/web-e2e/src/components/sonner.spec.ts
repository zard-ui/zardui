import { test, expect } from '@playwright/test';

import { ComponentDemoPage } from '../utils/component-page';

test.describe('Sonner (Toast) component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'sonner');
    await demoPage.goto();
  });

  test('renders trigger button', async () => {
    const trigger = demoPage.firstDemoBox.locator('button[z-button]');
    await expect(trigger).toBeVisible();
  });

  test('clicking trigger shows a toast notification', async ({ page }) => {
    const trigger = demoPage.firstDemoBox.locator('button[z-button]');
    await trigger.click();

    const toast = page.locator('[data-sonner-toast]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
  });

  test('toast has content', async ({ page }) => {
    const trigger = demoPage.firstDemoBox.locator('button[z-button]');
    await trigger.click();

    const toast = page.locator('[data-sonner-toast]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
    const text = await toast.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('toast auto-dismisses', async ({ page }) => {
    const trigger = demoPage.firstDemoBox.locator('button[z-button]');
    await trigger.click();

    const toast = page.locator('[data-sonner-toast]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
    await expect(toast).not.toBeVisible({ timeout: 10_000 });
  });

  test('renders the toaster in the top layer', async ({ page }) => {
    await expect(page.locator('z-sonner')).toHaveAttribute('popover', 'manual');
  });

  test('keeps toasts above an open dialog', async ({ page }) => {
    const demo = demoPage.getDemoByName('with-dialog');
    await demo.locator('button[z-button]').first().click();

    const dialog = page.locator('z-dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    await dialog.locator('button', { hasText: 'Save' }).click();

    const toast = page.locator('[data-sonner-toast]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
    await expect(dialog).toBeVisible();

    const box = await toast.boundingBox();
    expect(box).not.toBeNull();

    // The toast must be the element actually hit at its own center, otherwise
    // the dialog or its backdrop is painted above it.
    const isTopmost = await page.evaluate(
      ([x, y]) => !!document.elementFromPoint(x, y)?.closest('[data-sonner-toast]'),
      [box!.x + box!.width / 2, box!.y + box!.height / 2],
    );

    expect(isTopmost).toBe(true);
  });
});
