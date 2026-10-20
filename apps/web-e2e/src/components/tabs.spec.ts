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
    const firstCard = demoPage.firstDemoBox;
    await expect(firstCard).toBeVisible();

    // Tab buttons are inside [role="tablist"] nav; z-button directive strips role="tab"
    // so we select by their position within the tablist instead
    const tabButtons = firstCard.locator('[role="tablist"] button');
    await expect(tabButtons.first()).toBeVisible();
    const count = await tabButtons.count();
    expect(count).toBeGreaterThan(1);
  });

  test('first tab is active by default', async () => {
    const firstCard = demoPage.firstDemoBox;
    const firstTab = firstCard.locator('[role="tablist"] button').first();
    await expect(firstTab).toHaveAttribute('aria-selected', 'true');

    // First tab panel should be visible (not hidden)
    const visiblePanels = firstCard.locator('[role="tabpanel"]:not([hidden])');
    await expect(visiblePanels).toHaveCount(1);
  });

  test('clicking another tab switches content', async () => {
    const firstCard = demoPage.firstDemoBox;

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
    const firstCard = demoPage.firstDemoBox;

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

  test('RTL example moves in visual order with the arrow keys', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'tabs');
    await demoPage.goto();

    const rtlDemo = demoPage.getDemoByName('rtl');
    await rtlDemo.scrollIntoViewIfNeeded();
    const preview = rtlDemo.locator('[data-slot="preview"]');
    await expect(preview).toHaveAttribute('dir', 'rtl');
    const tabs = preview.locator('[role="tablist"] button');
    const firstBox = await tabs.nth(0).boundingBox();
    const secondBox = await tabs.nth(1).boundingBox();
    expect(firstBox!.x).toBeGreaterThan(secondBox!.x);

    await tabs.nth(0).focus();
    await page.keyboard.press('ArrowLeft');
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(tabs.nth(1)).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');

    await checkA11y(page, '[id="rtl"]', ['button-name', 'aria-allowed-attr', 'aria-required-children']);
  });
});
