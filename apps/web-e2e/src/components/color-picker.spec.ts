import { expect, type Page, test } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

/** The panel opens with a zoom-in, and boxes measured during it are about 4% off: wait for it to settle. */
const waitForPanel = async (page: Page) => {
  const overlay = page.locator('.cdk-overlay-container');
  await overlay.locator('[data-slot="color-picker-area"]').waitFor();
  await overlay.evaluate(el => Promise.all(el.getAnimations({ subtree: true }).map(animation => animation.finished)));
};

test.describe('Color Picker', () => {
  let demos: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demos = new ComponentDemoPage(page, 'color-picker');
    await demos.goto();
  });

  test('hydrates every demo', async () => {
    await expect(demos.firstDemoBox.locator('[data-slot="color-picker"]')).toBeVisible();
    for (const name of ['basic', 'formats', 'alpha', 'presets', 'events', 'form', 'sizes', 'rtl']) {
      await expect(demos.getDemoByName(name).locator('[data-slot="color-picker"]').first()).toBeVisible();
    }
  });

  test('opens the panel, drags the area and returns focus on Escape', async ({ page }) => {
    const trigger = demos.firstDemoBox.locator('[data-slot="color-picker"] button').first();
    await expect(trigger).toHaveText('#2563eb');

    await trigger.click();
    await waitForPanel(page);
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

  test('keeps a value typed with Enter while another format tab shows it', async ({ page }) => {
    const trigger = demos.firstDemoBox.locator('[data-slot="color-picker"] button').first();
    await trigger.click();

    await page
      .locator('.cdk-overlay-container [data-slot="color-picker-format"]')
      .getByRole('button', { name: 'HSL' })
      .click();
    const field = page.locator('.cdk-overlay-container input[aria-label="Color value"]');
    await field.fill('#123456');
    await field.press('Enter');
    await expect(field).toHaveValue('hsl(210, 65%, 20%)');

    // Chrome's `change` after Enter, and the blur, must not re-read the rounded HSL as a new color.
    await page.locator('.cdk-overlay-container [data-slot="color-picker-hue"]').focus();
    await expect(trigger).toHaveText('#123456');
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

  test('reads and writes OKLCH', async ({ page }) => {
    const trigger = demos.getDemoByName('formats').getByRole('button', { name: /OKLCH/ });
    await expect(trigger).toHaveText(/oklch\([\d.]+ [\d.]+ [\d.]+\)/);

    await trigger.click();
    const field = page.locator('.cdk-overlay-container input[aria-label="Color value"]');
    await field.fill('#0000ff');
    await field.press('Enter');
    await expect(trigger).toHaveText('oklch(0.452 0.31321 264.05)');

    // The longest value the field can hold must show whole, not scroll.
    await field.fill('oklch(0.8664 0.29483 142.5 / 0.55)');
    const overflows = await field.evaluate(input => input.scrollWidth > input.clientWidth);
    expect(overflows).toBe(false);
  });

  test('commits a drag once on release and switches the text format', async ({ page }) => {
    const demo = demos.getDemoByName('events');
    const trigger = demo.locator('[data-slot="color-picker"] button').first();
    await expect(trigger).toHaveText('No color yet');

    await trigger.click();
    await waitForPanel(page);
    const hue = page.locator('.cdk-overlay-container [data-slot="color-picker-hue"]');
    const box = await hue.boundingBox();
    if (!box) {
      throw new Error('hue track has no bounding box');
    }
    await page.mouse.move(box.x + 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 3, box.y + box.height / 2, { steps: 10 });
    await page.mouse.up();

    // The trigger renders after the release is handled: wait for it instead of reading the stale placeholder.
    await expect(trigger).not.toHaveText('No color yet');
    const value = (await trigger.textContent())?.trim() ?? '';
    await expect(demo).toContainText(`Live: ${value}`);
    await expect(demo).toContainText(`Saved: ${value}`);

    const rgbTab = page.locator('.cdk-overlay-container [data-slot="color-picker-format"]').getByRole('button', {
      name: 'RGB',
    });
    const field = page.locator('.cdk-overlay-container input[aria-label="Color value"]');
    await rgbTab.click();
    await expect(rgbTab).toHaveAttribute('aria-pressed', 'true');
    await expect(field).toHaveValue(/^rgb\(/);
    await expect(trigger).toHaveText(value);
  });

  test('has no accessibility violations', async ({ page }) => {
    await checkA11y(page, '#overview z-demo-color-picker-preview');
    for (const name of ['basic', 'formats', 'alpha', 'presets', 'events', 'form', 'sizes', 'rtl']) {
      await checkA11y(page, `#${name} z-demo-color-picker-${name}`);
    }
  });
});

test.describe('Color Picker (RTL)', () => {
  let rtl: ReturnType<ComponentDemoPage['getDemoByName']>;

  test.beforeEach(async ({ page }) => {
    const demos = new ComponentDemoPage(page, 'color-picker');
    await demos.goto();
    rtl = demos.getDemoByName('rtl');
    await rtl.scrollIntoViewIfNeeded();
    await expect(rtl.locator('[data-slot="preview"]')).toHaveAttribute('dir', 'rtl');
    await rtl.locator('[data-slot="color-picker"] button').first().click();
    await waitForPanel(page);
  });

  test('runs the hue with the reading direction: keys, thumb and drag', async ({ page }) => {
    const hue = page.locator('.cdk-overlay-container [dir="rtl"] [data-slot="color-picker-hue"]');
    await hue.focus();
    const before = Number(await hue.getAttribute('aria-valuenow'));
    await hue.press('ArrowLeft');
    await expect(hue).toHaveAttribute('aria-valuenow', String(before + 1));
    await hue.press('ArrowRight');
    await expect(hue).toHaveAttribute('aria-valuenow', String(before));

    // #2563eb has a hue of 221°, past the middle of the track, so in RTL its thumb sits left of the center.
    const track = (await hue.boundingBox())!;
    const thumb = (await hue.locator('span').boundingBox())!;
    expect(thumb.x + thumb.width / 2).toBeLessThan(track.x + track.width / 2);

    // Dragging to the left edge reaches the end of the hue range.
    await page.mouse.move(thumb.x + thumb.width / 2, track.y + track.height / 2);
    await page.mouse.down();
    await page.mouse.move(track.x + 2, track.y + track.height / 2, { steps: 5 });
    await page.mouse.up();
    await expect.poll(async () => Number(await hue.getAttribute('aria-valuenow'))).toBeGreaterThan(350);
  });

  test('lays the format tabs out from the right and slides the indicator with them', async ({ page }) => {
    const tabs = page.locator('.cdk-overlay-container [data-slot="color-picker-format"]');
    const indicator = tabs.locator('[data-slot="color-picker-format-indicator"]');
    const hex = (await tabs.getByRole('button', { name: 'HEX' }).boundingBox())!;
    const oklch = tabs.getByRole('button', { name: 'OKLCH' });
    expect(hex.x).toBeGreaterThan((await oklch.boundingBox())!.x);
    expect(Math.abs((await indicator.boundingBox())!.x - hex.x)).toBeLessThan(2);

    await oklch.click();
    await expect
      .poll(async () => Math.abs((await indicator.boundingBox())!.x - (await oklch.boundingBox())!.x))
      .toBeLessThan(2);
    await expect(page.locator('.cdk-overlay-container input[aria-label="Color value"]')).toHaveValue(/^oklch\(/);
  });
});
