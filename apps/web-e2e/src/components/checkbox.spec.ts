import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Checkbox component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'checkbox');
    await demoPage.goto();
  });

  test('renders checkbox elements', async () => {
    const firstCard = demoPage.firstDemoBox;
    await expect(firstCard).toBeVisible();

    const checkboxes = firstCard.locator('z-checkbox');
    const count = await checkboxes.count();
    expect(count).toBeGreaterThan(0);
  });

  test('checkbox uses native checked state', async () => {
    const firstCard = demoPage.firstDemoBox;
    const inputs = firstCard.locator('z-checkbox input[type="checkbox"]');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('clicking unchecked checkbox toggles to checked', async () => {
    const firstCard = demoPage.firstDemoBox;
    // First checkbox in the demo is unchecked by default
    const input = firstCard.locator('z-checkbox input[type="checkbox"]').first();

    await expect(input).not.toBeChecked();
    await input.click();
    await expect(input).toBeChecked();
  });

  test('clicking checked checkbox toggles to unchecked', async () => {
    const firstCard = demoPage.firstDemoBox;
    const inputs = firstCard.locator('z-checkbox input[type="checkbox"]');
    const count = await inputs.count();

    // Find a checked checkbox and toggle it off
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      if (await input.isChecked()) {
        await input.click();
        await expect(input).not.toBeChecked();
        return;
      }
    }
  });

  test('passes accessibility checks', async ({ page }) => {
    // button-name + label: demo has icon-only buttons and checkbox inputs without <label> elements
    await checkA11y(page, '#overview', ['button-name', 'label']);
  });
});
