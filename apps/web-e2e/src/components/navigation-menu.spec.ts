import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Navigation Menu component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    // Wide enough for the `md` breakpoint: the "Components" item is `hidden md:flex`, and the
    // shared viewport needs room to line up with a trigger instead of being pushed by the clamp.
    await page.setViewportSize({ width: 1280, height: 800 });

    demoPage = new ComponentDemoPage(page, 'navigation-menu');
    await demoPage.goto();
  });

  /**
   * The shared viewport is portalled into a CDK overlay so containers that clip cannot cut it off,
   * which puts it outside the demo box — it has to be located from the page.
   */
  function viewport(page: import('@playwright/test').Page) {
    return page.locator('[data-slot="navigation-menu-viewport"]');
  }

  async function loadExamples() {
    await demoPage.page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
    });
    await demoPage.page.locator('#examples').waitFor({ state: 'attached', timeout: 10_000 });
    await demoPage.page.locator('#examples').scrollIntoViewIfNeeded({ timeout: 5000 });
  }

  test('renders the bar with its triggers', async () => {
    const bar = demoPage.firstDemoBox.locator('[data-slot="navigation-menu"]');
    await expect(bar).toBeVisible();

    const triggers = demoPage.firstDemoBox.locator('[z-navigation-menu-trigger]');
    await expect(triggers.first()).toBeVisible();
    await expect(triggers).toHaveCount(3);
  });

  test('opens the shared viewport on hover', async ({ page }) => {
    const trigger = demoPage.firstDemoBox.locator('[z-navigation-menu-trigger]').first();
    await trigger.hover();

    await expect(viewport(page)).toBeVisible({ timeout: 5000 });
    await expect(trigger).toHaveAttribute('data-state', 'open', { timeout: 5000 });
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  test('lines the viewport up with the trigger that owns it', async ({ page }) => {
    const triggers = demoPage.firstDemoBox.locator('[z-navigation-menu-trigger]');
    const second = triggers.nth(1);

    await second.hover();
    await expect(viewport(page)).toBeVisible({ timeout: 5000 });

    const barBox = await demoPage.firstDemoBox.locator('[data-slot="navigation-menu"]').boundingBox();
    const triggerBox = await second.boundingBox();
    const viewportBox = await viewport(page).boundingBox();

    if (!barBox || !triggerBox || !viewportBox) throw new Error('bar, trigger and viewport must be laid out');

    // Anchored to the active trigger rather than to the start of the bar. Not an exact match: a
    // popup that would overflow the window is pulled back from the trigger's edge to fit.
    expect(Math.abs(viewportBox.x - triggerBox.x)).toBeLessThan(Math.abs(viewportBox.x - barBox.x));
  });

  test('morphs the viewport when moving to the next trigger', async ({ page }) => {
    const triggers = demoPage.firstDemoBox.locator('[z-navigation-menu-trigger]');

    await triggers.first().hover();
    await expect(viewport(page)).toBeVisible({ timeout: 5000 });
    await expect(viewport(page).getByText('Introduction')).toBeVisible({ timeout: 5000 });

    await triggers.nth(1).hover();

    // The same viewport stays mounted — only the content it hosts changes.
    await expect(viewport(page)).toBeVisible();
    await expect(triggers.nth(1)).toHaveAttribute('data-state', 'open', { timeout: 5000 });
    await expect(triggers.first()).toHaveAttribute('data-state', 'closed');
    await expect(viewport(page).getByText('Alert Dialog')).toBeVisible({ timeout: 5000 });
  });

  test('marks the direction of travel with data-motion', async ({ page }) => {
    const triggers = demoPage.firstDemoBox.locator('[z-navigation-menu-trigger]');
    const content = viewport(page).locator('[data-slot="navigation-menu-content"]');

    await triggers.first().hover();
    await expect(content).toBeVisible({ timeout: 5000 });

    await triggers.nth(1).hover();
    await expect(content).toHaveAttribute('data-motion', 'from-end', { timeout: 5000 });

    await triggers.first().hover();
    await expect(content).toHaveAttribute('data-motion', 'from-start', { timeout: 5000 });
  });

  test('opens with the keyboard and closes on Escape', async ({ page }) => {
    const trigger = demoPage.firstDemoBox.locator('[z-navigation-menu-trigger]').first();

    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(viewport(page)).toBeVisible({ timeout: 5000 });

    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('data-state', 'closed', { timeout: 5000 });
    await expect(trigger).toBeFocused();
  });

  test('moves focus into the content with ArrowDown', async ({ page }) => {
    const trigger = demoPage.firstDemoBox.locator('[z-navigation-menu-trigger]').first();

    await trigger.focus();
    await page.keyboard.press('ArrowDown');

    const firstLink = viewport(page).locator('[z-navigation-menu-link]').first();
    await expect(firstLink).toBeFocused({ timeout: 5000 });
  });

  test('closes the viewport when the pointer leaves the bar', async ({ page }) => {
    const trigger = demoPage.firstDemoBox.locator('[z-navigation-menu-trigger]').first();
    await trigger.hover();

    await expect(viewport(page)).toBeVisible({ timeout: 5000 });

    await page.mouse.move(0, 0);
    await expect(trigger).toHaveAttribute('data-state', 'closed', { timeout: 5000 });
  });

  test('keeps the viewport open while the pointer is over it', async ({ page }) => {
    const trigger = demoPage.firstDemoBox.locator('[z-navigation-menu-trigger]').first();
    await trigger.hover();
    await expect(viewport(page)).toBeVisible({ timeout: 5000 });

    await viewport(page).locator('[z-navigation-menu-link]').first().hover();

    // The grace period is 100ms; anything longer proves the pointer cancelled the close.
    await page.waitForTimeout(400);
    await expect(viewport(page)).toBeVisible();
    await expect(trigger).toHaveAttribute('data-state', 'open');
  });

  test('opens one popup per item when the viewport is disabled', async ({ page }) => {
    await loadExamples();

    const noViewportDemo = demoPage.getDemoByName('no-viewport');
    await expect(noViewportDemo).toBeVisible({ timeout: 5000 });
    await expect(noViewportDemo.locator('[data-slot="navigation-menu"]')).toHaveAttribute('data-viewport', 'false');
    await expect(noViewportDemo.locator('[data-slot="navigation-menu-viewport"]')).toHaveCount(0);

    await noViewportDemo.locator('[z-navigation-menu-trigger]').first().hover();

    // Without the shared viewport the content is portalled into a CDK overlay instead.
    const overlayContent = page.locator('.cdk-overlay-pane [data-slot="navigation-menu-content"]');
    await expect(overlayContent).toBeVisible({ timeout: 5000 });
  });

  test('marks the current route on the link example', async () => {
    await loadExamples();

    const linkDemo = demoPage.getDemoByName('link');
    await expect(linkDemo).toBeVisible({ timeout: 5000 });

    const activeLink = linkDemo.locator('[z-navigation-menu-link][data-active]');
    await expect(activeLink).toHaveAttribute('aria-current', 'page', { timeout: 5000 });
    await expect(activeLink).toHaveText(/Navigation Menu/);
  });

  test('passes accessibility checks when open', async ({ page }) => {
    const trigger = demoPage.firstDemoBox.locator('[z-navigation-menu-trigger]').first();
    await trigger.hover();
    await viewport(page).waitFor({ state: 'visible', timeout: 5000 });

    await checkA11y(page, '#overview', ['button-name', 'color-contrast', 'scrollable-region-focusable']);
  });
});
