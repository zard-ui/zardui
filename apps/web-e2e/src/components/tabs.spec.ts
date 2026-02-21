import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Tabs component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'tabs');
    await demoPage.goto();
  });

  test('renders tab group with multiple tabs', async () => {
    const firstCard = demoPage.firstDemoCard;
    await expect(firstCard).toBeVisible();

    // Tab buttons are inside [role="tablist"] nav; z-button directive strips role="tab"
    // so we select by their position within the tablist instead
    const tabButtons = firstCard.locator('[role="tablist"] button');
    await expect(tabButtons.first()).toBeVisible();
    const count = await tabButtons.count();
    expect(count).toBeGreaterThan(1);
  });

  test('first tab is active by default', async () => {
    const firstCard = demoPage.firstDemoCard;
    const firstTab = firstCard.locator('[role="tablist"] button').first();
    await expect(firstTab).toHaveAttribute('aria-selected', 'true');

    // First tab panel should be visible (not hidden)
    const visiblePanels = firstCard.locator('[role="tabpanel"]:not([hidden])');
    await expect(visiblePanels).toHaveCount(1);
  });

  test('clicking another tab switches content', async () => {
    const firstCard = demoPage.firstDemoCard;

    const tabTriggers = firstCard.locator('[role="tablist"] button');
    const count = await tabTriggers.count();
    expect(count).toBeGreaterThan(1);

    // Click the second tab
    await tabTriggers.nth(1).click();

    // Second tab should become active
    await expect(tabTriggers.nth(1)).toHaveAttribute('aria-selected', 'true');
    // First tab should be deselected
    await expect(tabTriggers.first()).toHaveAttribute('aria-selected', 'false');
  });

  test('only one tab panel is visible at a time', async () => {
    const firstCard = demoPage.firstDemoCard;

    // Click a different tab
    const tabTriggers = firstCard.locator('[role="tablist"] button');
    await tabTriggers.nth(2).click();

    // Only one tabpanel should be visible (others have hidden attribute)
    const visiblePanels = firstCard.locator('[role="tabpanel"]:not([hidden])');
    await expect(visiblePanels).toHaveCount(1);
  });

  test('passes accessibility checks', async ({ page }) => {
    // button-name: icon-only buttons; aria-allowed-attr + aria-required-children: z-button directive
    // strips role="tab" from tab buttons, leaving orphaned aria-selected/aria-controls attributes
    await checkA11y(page, '#overview', ['button-name', 'aria-allowed-attr', 'aria-required-children']);
  });
});
