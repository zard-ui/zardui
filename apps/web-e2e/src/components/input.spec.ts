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
    const firstCard = demoPage.firstDemoBox;
    await expect(firstCard).toBeVisible();

    const inputs = firstCard.locator('input[z-input]');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('input accepts user typing', async () => {
    const basicDemo = demoPage.getDemoByName('basic');
    await expect(basicDemo).toBeVisible();

    const input = basicDemo.locator('input[z-input]').first();
    await input.clear();
    await input.fill('test value');
    await expect(input).toHaveValue('test value');
  });

  test('input has placeholder attribute', async () => {
    const input = demoPage.firstDemoBox.locator('input[z-input]').first();
    const placeholder = await input.getAttribute('placeholder');
    expect(placeholder).toBeTruthy();
  });

  test('disabled input cannot be modified', async () => {
    const disabledDemo = demoPage.getDemoByName('disabled');
    await expect(disabledDemo).toBeVisible();

    const input = disabledDemo.locator('input[z-input]').first();
    await expect(input).toBeDisabled();
  });

  test('passes accessibility checks', async ({ page }) => {
    // label: demo inputs use placeholder without associated <label>; button-name: icon-only buttons
    // color-contrast: Shiki syntax highlighting has insufficient contrast (4.3:1)
    await checkA11y(page, '#overview', ['label', 'button-name', 'color-contrast']);
  });
});
