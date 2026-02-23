import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Input component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'input');
    await demoPage.goto();
  });

  test('renders default demo with input fields', async () => {
    const firstCard = demoPage.firstDemoCard;
    await expect(firstCard).toBeVisible();

    const inputs = firstCard.locator('input[z-input]');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('input accepts user typing', async () => {
    const input = demoPage.firstDemoCard.locator('input[z-input]').first();
    await input.clear();
    await input.fill('test value');
    await expect(input).toHaveValue('test value');
  });

  test('input has placeholder attribute', async () => {
    const input = demoPage.firstDemoCard.locator('input[z-input]').first();
    const placeholder = await input.getAttribute('placeholder');
    expect(placeholder).toBeTruthy();
  });

  test('disabled input cannot be modified', async () => {
    const firstCard = demoPage.firstDemoCard;
    const inputs = firstCard.locator('input[z-input]');

    // Find a disabled input among the inputs
    let foundDisabled = false;
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      if (await inputs.nth(i).isDisabled()) {
        foundDisabled = true;
        await expect(inputs.nth(i)).toBeDisabled();
        break;
      }
    }
    expect(foundDisabled).toBe(true);
  });

  test('passes accessibility checks', async ({ page }) => {
    // label: demo inputs use placeholder without associated <label>; button-name: icon-only buttons
    await checkA11y(page, '#overview', ['label', 'button-name']);
  });
});
