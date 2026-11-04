import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Toast', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'toast');
    await demoPage.goto();
  });

  test('renders the page with the deprecation notice', async () => {
    await expect(demoPage.page.getByRole('heading', { level: 1, name: 'Toast' })).toBeVisible();

    const notice = demoPage.firstDemoBox.locator('z-alert');
    await expect(notice).toBeVisible();
    await expect(notice).toContainText('The toast component has been deprecated.');
    await expect(notice).toContainText('Use the sonner component instead.');
    await expect(demoPage.installationSection).toBeVisible();
  });

  test('links to the Sonner page from the notice and from the related pages', async ({ page }) => {
    const related = demoPage.overviewSection.getByRole('navigation', { name: 'Related pages' });
    await expect(related.getByRole('link', { name: 'Sonner' })).toHaveAttribute('href', '/docs/components/sonner');

    await demoPage.firstDemoBox.locator('z-alert').getByRole('link', { name: 'sonner' }).click();
    await expect(page).toHaveURL(/\/docs\/components\/sonner$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Sonner' })).toBeVisible();
  });

  test('installs sonner', async () => {
    await expect(demoPage.installationSection.locator('#cli-panel')).toContainText('zard-cli@latest add sonner');
  });

  test('is listed in the components sidebar and the components list', async ({ page }) => {
    await expect(page.locator('a[href="/docs/components/toast"]').first()).toBeAttached();

    await page.goto('/docs/components');
    await expect(page.locator('z-content').getByRole('link', { name: 'Toast', exact: true })).toBeVisible();
  });

  test('its demo opens a toast', async ({ page }) => {
    const trigger = demoPage.getDemoByName('show').locator('button[z-button]');
    await trigger.click();

    await expect(page.locator('[data-sonner-toast]').first()).toBeVisible({ timeout: 5000 });
  });

  for (const dark of [false, true]) {
    test(`has no accessibility violations, dark=${dark}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: dark ? 'dark' : 'light' });
      await page.evaluate(isDark => document.documentElement.classList.toggle('dark', isDark), dark);

      await checkA11y(page, '[data-slot="preview"]');
      await checkA11y(page, '#overview, #examples', ['color-contrast']);
    });
  }
});
