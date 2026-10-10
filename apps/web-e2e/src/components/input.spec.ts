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

  test('rtl example lays out the field right to left', async ({ page }) => {
    const demo = demoPage.getDemoByName('rtl');
    await demo.scrollIntoViewIfNeeded();
    await expect(demo.locator('[data-slot="preview"]')).toHaveAttribute('dir', 'rtl');

    const input = demo.locator('input[z-input]');
    await expect(input).toHaveCSS('direction', 'rtl');
    await expect(input).toHaveCSS('text-align', 'start');
    await input.fill('مرحبا');
    await expect(input).toHaveValue('مرحبا');

    // label and description hug the inline-start (right) edge of the field
    const fieldBox = (await demo.locator('[z-field]').boundingBox())!;
    const labelBox = (await demo.locator('[z-field-label]').boundingBox())!;
    expect(labelBox.x + labelBox.width).toBeGreaterThan(fieldBox.x + fieldBox.width - 8);

    await checkA11y(page, '#rtl', ['color-contrast']);
  });

  test('passes accessibility checks', async ({ page }) => {
    // label: demo inputs use placeholder without associated <label>; button-name: icon-only buttons
    // color-contrast: Shiki syntax highlighting has insufficient contrast (4.3:1)
    await checkA11y(page, '#overview', ['label', 'button-name', 'color-contrast']);
  });
});
