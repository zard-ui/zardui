import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Accordion component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'accordion');
    await demoPage.goto();
  });

  test('renders accordion items', async () => {
    const firstCard = demoPage.firstDemoBox;
    await expect(firstCard).toBeVisible();

    const items = firstCard.locator('z-accordion-item');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
  });

  test('one item is expanded by default', async () => {
    const firstCard = demoPage.firstDemoBox;
    // At least one accordion item should have data-state="open"
    const expandedRegions = firstCard.locator('z-accordion-item [role="region"][data-state="open"]');
    const count = await expandedRegions.count();
    expect(count).toBeGreaterThan(0);
  });

  test('clicking a collapsed item expands it', async () => {
    const firstCard = demoPage.firstDemoBox;
    // Pick whichever item starts collapsed, so the test does not depend on which one the demo opens.
    // Pinned by index: a "closed" filter would re-resolve to another item once this one opens.
    const states = await firstCard
      .locator('z-accordion-item [role="region"]')
      .evaluateAll(regions => regions.map(region => region.getAttribute('data-state')));
    const collapsedIndex = states.indexOf('closed');
    expect(collapsedIndex).toBeGreaterThanOrEqual(0);

    const collapsedItem = firstCard.locator('z-accordion-item').nth(collapsedIndex);
    const trigger = collapsedItem.locator('button').first();
    const region = collapsedItem.locator('[role="region"]');

    // Verify it starts collapsed
    await expect(region).toHaveAttribute('data-state', 'closed');

    await trigger.click();
    await expect(region).toHaveAttribute('data-state', 'open');
  });

  test('clicking an expanded item collapses it', async () => {
    const firstCard = demoPage.firstDemoBox;
    // Find the currently expanded item by data-state
    const items = firstCard.locator('z-accordion-item');
    const count = await items.count();

    for (let i = 0; i < count; i++) {
      const region = items.nth(i).locator('[role="region"]');
      const state = await region.getAttribute('data-state');
      if (state === 'open') {
        const trigger = items.nth(i).locator('button').first();
        await trigger.click();
        await expect(region).toHaveAttribute('data-state', 'closed');
        break;
      }
    }
  });

  test('passes accessibility checks', async ({ page }) => {
    // button-name: icon-only accordion toggle buttons lack discernible text
    await checkA11y(page, '#overview', ['button-name']);
  });
});
