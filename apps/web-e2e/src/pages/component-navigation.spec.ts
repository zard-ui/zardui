import { test, expect } from '@playwright/test';

import { ComponentDemoPage } from '../utils/component-page';

/**
 * `/docs/components/:componentName` keeps the same page instance across client-side
 * navigations, so the page must rebuild its content for the new component. Otherwise
 * the demos are reused by index: heading anchors keep the previous component's example
 * names and an expanded code box stays expanded on the next component.
 */
test.describe('Component page navigation', () => {
  test('switching components rebuilds the headings and collapses the code boxes', async ({ page }) => {
    const button = new ComponentDemoPage(page, 'button');
    await button.goto();

    const viewCode = () => page.locator('#overview z-code-box').getByRole('button', { name: 'View Code' });
    await viewCode().click();
    await expect(viewCode()).toBeHidden();

    await page.locator('z-sidebar').getByRole('link', { name: 'Badge', exact: true }).click();
    await expect(page).toHaveURL(/\/docs\/components\/badge$/);

    const badge = new ComponentDemoPage(page, 'badge');
    await expect(page.getByRole('heading', { level: 1 }).first()).toHaveText('badge', { ignoreCase: true });

    const exampleHeadings = badge.examplesSection.getByRole('heading', { level: 3 });
    await expect(exampleHeadings.first()).toHaveAccessibleName(/^variants$/i);
    await expect(badge.examplesSection.getByRole('heading', { level: 3, name: /^size$/i })).toHaveCount(0);

    await expect(viewCode()).toBeVisible();
  });
});
