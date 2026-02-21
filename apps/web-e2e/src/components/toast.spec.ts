import { test, expect } from '@playwright/test';

import { ComponentDemoPage } from '../utils/component-page';

test.describe('Toast component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'toast');
    await demoPage.goto();
  });

  test('renders trigger button', async () => {
    const trigger = demoPage.firstDemoCard.locator('button[z-button]');
    await expect(trigger).toBeVisible();
  });

  test('clicking trigger shows a toast notification', async ({ page }) => {
    const trigger = demoPage.firstDemoCard.locator('button[z-button]');
    await trigger.click();

    // ngx-sonner renders toasts with [data-sonner-toast] attribute
    const toast = page.locator('[data-sonner-toast]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
  });

  test('toast has content', async ({ page }) => {
    const trigger = demoPage.firstDemoCard.locator('button[z-button]');
    await trigger.click();

    const toast = page.locator('[data-sonner-toast]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
    // Toast should not be empty
    const text = await toast.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('toast auto-dismisses', async ({ page }) => {
    const trigger = demoPage.firstDemoCard.locator('button[z-button]');
    await trigger.click();

    const toast = page.locator('[data-sonner-toast]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
    // Sonner default auto-dismiss is ~4s
    await expect(toast).not.toBeVisible({ timeout: 10_000 });
  });
});
