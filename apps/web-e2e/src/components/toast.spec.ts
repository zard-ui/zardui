import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Toast', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'toast');
    await demoPage.goto();
  });

  test('only says the component is deprecated', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Toast' })).toBeVisible();
    await expect(page.locator('[data-slot="deprecation-notice"]')).toHaveText(
      'The toast component has been deprecated. Use the sonner component instead.',
    );

    for (const id of ['installation', 'usage', 'examples', 'api']) {
      await expect(page.locator(`#${id}`)).toHaveCount(0);
    }
    await expect(page.locator('z-code-box')).toHaveCount(0);
  });

  test('links to the Sonner page', async ({ page }) => {
    const link = page.locator('[data-slot="deprecation-notice"]').getByRole('link', { name: 'sonner' });
    await expect(link).toHaveAttribute('href', '/docs/components/sonner');

    await link.click();
    await expect(page).toHaveURL(/\/docs\/components\/sonner$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Sonner' })).toBeVisible();
  });

  test('is listed in the components sidebar and the components list', async ({ page }) => {
    await expect(page.locator('a[href="/docs/components/toast"]').first()).toBeAttached();

    await page.goto('/docs/components');
    await expect(page.locator('z-content').getByRole('link', { name: 'Toast', exact: true })).toBeVisible();
  });

  for (const dark of [false, true]) {
    test(`has no accessibility violations, dark=${dark}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: dark ? 'dark' : 'light' });
      await page.evaluate(isDark => document.documentElement.classList.toggle('dark', isDark), dark);

      await checkA11y(page, '#overview');
    });
  }
});
