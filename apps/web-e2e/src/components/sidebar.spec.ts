import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Sidebar component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    // Wide enough for the `md` breakpoint: the desktop sidebar is `hidden md:block`, and below
    // 768px the service switches to the mobile drawer instead.
    await page.setViewportSize({ width: 1280, height: 800 });

    // Start from a known state — the component persists `open` in the sidebar_state cookie.
    await page.context().clearCookies();

    demoPage = new ComponentDemoPage(page, 'sidebar');
    await demoPage.goto();
  });

  test('renders the sidebar expanded, with the wrapper variables inline', async () => {
    const sidebar = demoPage.firstDemoBox.locator('[data-slot="sidebar"]');
    await expect(sidebar).toHaveAttribute('data-state', 'expanded');

    const wrapper = demoPage.firstDemoBox.locator('[data-slot="sidebar-wrapper"]');
    await expect(wrapper).toHaveAttribute('style', /--sidebar-width:\s*16rem/);
  });

  test('the trigger toggles the sidebar', async () => {
    const sidebar = demoPage.firstDemoBox.locator('[data-slot="sidebar"]');
    const trigger = demoPage.firstDemoBox.locator('[data-slot="sidebar-trigger"]');

    await trigger.click();
    await expect(sidebar).toHaveAttribute('data-state', 'collapsed');
    await expect(sidebar).toHaveAttribute('data-collapsible', 'icon');

    await trigger.click();
    await expect(sidebar).toHaveAttribute('data-state', 'expanded');
  });

  test('the keyboard shortcut toggles the sidebar', async ({ page }) => {
    const sidebar = demoPage.firstDemoBox.locator('[data-slot="sidebar"]');
    const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';

    await page.keyboard.press(`${modifier}+b`);
    await expect(sidebar).toHaveAttribute('data-state', 'collapsed');

    await page.keyboard.press(`${modifier}+b`);
    await expect(sidebar).toHaveAttribute('data-state', 'expanded');
  });

  test('the open state survives a reload through the cookie', async ({ page }) => {
    const sidebar = demoPage.firstDemoBox.locator('[data-slot="sidebar"]');

    await demoPage.firstDemoBox.locator('[data-slot="sidebar-trigger"]').click();
    await expect(sidebar).toHaveAttribute('data-state', 'collapsed');

    await page.reload();
    await page.waitForSelector('#overview', { state: 'visible' });

    // Already collapsed in the server-rendered markup, so there is no layout flash.
    await expect(demoPage.firstDemoBox.locator('[data-slot="sidebar"]')).toHaveAttribute('data-state', 'collapsed');
  });

  test('the rail toggles the sidebar too', async () => {
    const sidebar = demoPage.firstDemoBox.locator('[data-slot="sidebar"]');

    await demoPage.firstDemoBox.locator('[data-slot="sidebar-rail"]').click();

    await expect(sidebar).toHaveAttribute('data-state', 'collapsed');
  });

  test('the mobile drawer opens with a backdrop and closes on Escape', async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 800 });

    const demo = demoPage.firstDemoBox;
    await expect(demo.locator('[data-mobile="true"]')).toHaveCount(0);

    await demo.locator('[data-slot="sidebar-trigger"]').click();

    const drawer = demo.locator('[data-mobile="true"]');
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute('role', 'dialog');
    await expect(demo.locator('[data-slot="sidebar-backdrop"]')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(drawer).toHaveCount(0);
  });

  test('passes accessibility checks', async ({ page }) => {
    // `button-name` is the docs page's own z-assist popover trigger, not the sidebar — every other
    // component spec disables it for the same reason.
    await checkA11y(page, '#overview', ['button-name', 'color-contrast']);
  });
});
