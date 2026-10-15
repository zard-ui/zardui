import { expect, test } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Color Picker', () => {
  let demos: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demos = new ComponentDemoPage(page, 'color-picker');
    await demos.goto();
  });

  test('hydrates every demo', async () => {
    await expect(demos.firstDemoBox.locator('[data-slot="color-picker"]')).toBeVisible();
    for (const name of ['basic', 'formats', 'alpha', 'presets', 'form', 'sizes']) {
      await expect(demos.getDemoByName(name).locator('[data-slot="color-picker"]').first()).toBeVisible();
    }
  });

  test('opens the panel, drags the area and returns focus on Escape', async ({ page }) => {
    const trigger = demos.firstDemoBox.locator('[data-slot="color-picker"] button').first();
    await expect(trigger).toHaveText('#2563eb');

    await trigger.click();
    const area = page.locator('.cdk-overlay-container [data-slot="color-picker-area"]');
    await expect(area).toBeVisible();
    await expect(area).toBeFocused();

    const box = await area.boundingBox();
    if (!box) {
      throw new Error('color area has no bounding box');
    }
    // Dragging past the top-right corner keeps the pointer captured and clamps to full saturation and brightness.
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width + 30, box.y - 30, { steps: 5 });
    await page.mouse.up();
    await expect(area).toHaveAttribute('aria-valuetext', 'Saturation 100%, brightness 100%');
    await expect(trigger).not.toHaveText('#2563eb');

    await page.keyboard.press('Escape');
    await expect(area).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('changes the hue with the keyboard and accepts typed values', async ({ page }) => {
    const trigger = demos.firstDemoBox.locator('[data-slot="color-picker"] button').first();
    await trigger.click();

    const hue = page.locator('.cdk-overlay-container [data-slot="color-picker-hue"]');
    const before = Number(await hue.getAttribute('aria-valuenow'));
    await hue.focus();
    await page.keyboard.press('Shift+ArrowRight');
    await expect(hue).toHaveAttribute('aria-valuenow', String(before + 10));

    const field = page.locator('.cdk-overlay-container input[aria-label="Color value"]');
    await field.fill('rgb(22, 163, 74)');
    await field.press('Enter');
    await expect(trigger).toHaveText('#16a34a');

    await field.fill('not a color');
    await field.press('Enter');
    await expect(field).toHaveValue('#16a34a');
  });

  test('picks a preset and feeds the reactive form', async ({ page }) => {
    const form = demos.getDemoByName('form');
    await form.getByRole('button', { name: /Brand color/ }).click();

    const preset = page.locator(
      '.cdk-overlay-container [data-slot="color-picker-presets"] button[aria-label="#dc2626"]',
    );
    await preset.click();
    await expect(preset).toHaveAttribute('aria-pressed', 'true');
    await expect(form).toContainText('"brand": "#dc2626"');

    await expect(form.getByRole('button', { name: /Logo color/ })).toBeDisabled();
  });

  test('has no accessibility violations', async ({ page }) => {
    await checkA11y(page, '#overview z-demo-color-picker-preview');
    for (const name of ['basic', 'formats', 'alpha', 'presets', 'form', 'sizes']) {
      await checkA11y(page, `#${name} z-demo-color-picker-${name}`);
    }
  });
});
