import { test, expect } from '@playwright/test';

/** As in shadcn/ui, Typography is the components-list entry for Typeset: it opens the Typeset docs. */
test.describe('Typography', () => {
  test('opens the Typeset docs from the components list', async ({ page }) => {
    await page.goto('/docs/components');
    await page.waitForLoadState('networkidle');

    const link = page.locator('z-content').getByRole('link', { name: 'Typography', exact: true });
    await expect(link).toHaveAttribute('href', '/docs/typeset');

    await link.click();
    await expect(page).toHaveURL(/\/docs\/typeset$/);
  });

  test('redirects the component URL to the Typeset docs', async ({ page }) => {
    await page.goto('/docs/components/typography');

    await expect(page).toHaveURL(/\/docs\/typeset$/);
  });
});
