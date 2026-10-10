import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

const PANEL = '.cdk-overlay-container [data-slot="drawer-popup"]';

test.describe('Drawer component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'drawer');
    await demoPage.goto();
  });

  test('renders trigger button', async () => {
    await expect(demoPage.firstDemoBox.locator('button[z-button]').first()).toBeVisible();
  });

  test('opens the drawer on trigger click', async ({ page }) => {
    // The first demo picks its side from the viewport, so pin one before asserting.
    await page.setViewportSize({ width: 1280, height: 900 });
    await demoPage.firstDemoBox.locator('button[z-button]').first().click();

    const panel = page.locator(PANEL);
    await expect(panel).toBeVisible({ timeout: 5000 });
    await expect(panel).toHaveAttribute('role', 'dialog');
    await expect(panel).toHaveAttribute('data-placement', 'right');
    await expect(panel).toHaveAttribute('data-axis', 'x');
  });

  test('names the drawer with its title', async ({ page }) => {
    await demoPage.firstDemoBox.locator('button[z-button]').first().click();

    const panel = page.locator(PANEL);
    await expect(panel).toBeVisible({ timeout: 5000 });

    const labelledBy = await panel.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    await expect(page.locator(`[id="${labelledBy}"]`)).toBeVisible();
  });

  test('closes on Escape', async ({ page }) => {
    await demoPage.firstDemoBox.locator('button[z-button]').first().click();

    const panel = page.locator(PANEL);
    await expect(panel).toBeVisible({ timeout: 5000 });

    await page.keyboard.press('Escape');
    await expect(panel).toHaveCount(0, { timeout: 5000 });
  });

  test('closes from a [z-drawer-close] control', async ({ page }) => {
    await demoPage.firstDemoBox.locator('button[z-button]').first().click();

    const panel = page.locator(PANEL);
    await expect(panel).toBeVisible({ timeout: 5000 });

    await panel.locator('[data-slot="drawer-close"]').first().click();
    await expect(panel).toHaveCount(0, { timeout: 5000 });
  });

  test('passes accessibility checks when open', async ({ page }) => {
    await demoPage.firstDemoBox.locator('button[z-button]').first().click();
    await page.locator(PANEL).waitFor({ state: 'visible', timeout: 5000 });
    await checkA11y(page, undefined, ['button-name', 'color-contrast', 'label', 'scrollable-region-focusable']);
  });
});

test.describe('Drawer component RTL', () => {
  test('opens with rtl, mirrors the content and keeps the placement physical', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'drawer');
    await demoPage.goto();

    const demo = demoPage.getDemoByName('rtl');
    await demo.scrollIntoViewIfNeeded();
    await expect(demo.locator('[data-slot="preview"]')).toHaveAttribute('dir', 'rtl');

    await demo.locator('[data-slot="preview"] button[z-button]').first().click();

    const panel = page.locator('.cdk-overlay-container z-drawer-panel');
    await expect(panel).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.cdk-overlay-container [dir="rtl"]').first()).toBeAttached();
    await expect(panel).toHaveAttribute('data-placement', 'right');

    // The panel sits on the physical right edge, whatever the direction.
    const viewport = page.viewportSize()!;
    await expect
      .poll(async () => {
        const box = await panel.boundingBox();
        return box ? Math.abs(box.x + box.width - viewport.width) : 999;
      })
      .toBeLessThan(16); // the panel floats 8px off the edge

    // Radio rows mirror: the control sits on the inline-start (right) side of its label.
    const row = panel.locator('label').first();
    const radio = (await row.locator('button[role="radio"], [role="radio"]').first().boundingBox())!;
    const text = (await row.locator('span.grid').boundingBox())!;
    expect(radio.x).toBeGreaterThan(text.x);

    await checkA11y(page, undefined, ['button-name', 'color-contrast', 'label', 'scrollable-region-focusable']);
  });
});
