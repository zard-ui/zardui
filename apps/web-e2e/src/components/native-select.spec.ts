import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Native Select component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'native-select');
    await demoPage.goto();
  });

  test('renders the real select element in the first demo', async () => {
    const select = demoPage.firstDemoBox.locator('select[z-native-select]');
    await expect(select).toBeVisible();
    await expect(select).toHaveAttribute('data-slot', 'native-select');
    await expect(select.locator('option').first()).toBeAttached();
  });

  test('can be changed with the keyboard', async ({ page }) => {
    const select = demoPage.firstDemoBox.locator('select[z-native-select]');
    await select.focus();
    await expect(select).toBeFocused();
    const initial = await select.inputValue();

    await page.keyboard.press('ArrowDown');
    const next = await select.inputValue();
    expect(next).not.toBe(initial);

    await page.keyboard.press('ArrowDown');
    expect(await select.inputValue()).not.toBe(next);

    await page.keyboard.press('ArrowUp');
    expect(await select.inputValue()).toBe(next);
  });

  test('selects an option programmatically like any native select', async () => {
    const select = demoPage.firstDemoBox.locator('select[z-native-select]');
    await select.selectOption('done');
    await expect(select).toHaveValue('done');
  });

  test('groups render as native optgroups', async () => {
    const select = demoPage.getDemoByName('groups').locator('select[z-native-select]');
    await expect(select.locator('optgroup').first()).toBeAttached();
    expect(await select.locator('optgroup').count()).toBeGreaterThan(1);
  });

  test('disabled select cannot be focused or changed', async () => {
    const select = demoPage.getDemoByName('disabled').locator('select[z-native-select]');
    await expect(select).toBeDisabled();
    await expect(select).toHaveCSS('opacity', '0.5');
    await expect(select.selectOption('done', { timeout: 1_000 })).rejects.toThrow();
  });

  test('invalid select exposes aria-invalid and the destructive border', async () => {
    const select = demoPage.getDemoByName('invalid').locator('select[z-native-select]');
    await expect(select).toHaveAttribute('aria-invalid', 'true');
    const borderColor = await select.evaluate(el => getComputedStyle(el).borderTopColor);
    const normalBorder = await demoPage.firstDemoBox
      .locator('select[z-native-select]')
      .evaluate(el => getComputedStyle(el).borderTopColor);
    expect(borderColor).not.toBe(normalBorder);
  });

  test('sizes line up with the design tokens', async () => {
    const demo = demoPage.getDemoByName('sizes');
    const heights = await demo
      .locator('select[z-native-select]')
      .evaluateAll(els => els.map(el => Math.round(el.getBoundingClientRect().height)));
    expect(heights).toEqual([28, 32, 40]);
  });

  test('form example binds the select to a reactive control', async () => {
    const demo = demoPage.getDemoByName('form');
    const select = demo.locator('select[z-native-select]');
    const submit = demo.locator('button[type="submit"]');

    await submit.click();
    await expect(select).toHaveAttribute('aria-invalid', 'true');

    await select.selectOption('in-progress');
    await expect(select).not.toHaveAttribute('aria-invalid');
  });

  test('rtl example follows the writing direction', async ({ page }) => {
    const demo = demoPage.getDemoByName('rtl');
    await demo.scrollIntoViewIfNeeded();
    await expect(demo.locator('[data-slot="preview"]')).toHaveAttribute('dir', 'rtl');

    const select = demo.locator('select[z-native-select]');
    await expect(select).toHaveCSS('direction', 'rtl');
    // the chevron moves to the inline-start (left) edge, with the padding reserved on that side
    await expect(select).toHaveCSS('background-position', '10px 50%');
    await expect(select).toHaveCSS('padding-left', '32px');

    await checkA11y(page, '#rtl', ['color-contrast']);
  });

  test('passes accessibility checks', async ({ page }) => {
    // color-contrast: the demo's muted placeholder text inside the docs preview is not part of the component
    await checkA11y(page, '#overview', ['color-contrast']);
  });
});
