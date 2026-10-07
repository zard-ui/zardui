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

  test('an explicit zDefaultOpen wins over the persisted cookie', async ({ page }) => {
    const sidebar = demoPage.firstDemoBox.locator('[data-slot="sidebar"]');

    await demoPage.firstDemoBox.locator('[data-slot="sidebar-trigger"]').click();
    await expect(sidebar).toHaveAttribute('data-state', 'collapsed');

    await page.reload();
    await page.waitForSelector('#overview', { state: 'visible' });

    // The demos pass zDefaultOpen so each example is deterministic; otherwise collapsing any one of
    // them would decide the initial state for all 24 providers on the page.
    await expect(demoPage.firstDemoBox.locator('[data-slot="sidebar"]')).toHaveAttribute('data-state', 'expanded');
  });

  test('a block with an explicit zDefaultOpen neither reads nor writes the cookie', async ({ page, context }) => {
    // The blocks pin zDefaultOpen so their previews are deterministic. Reading and writing the
    // cookie when the input is unset is covered by the sidebar service unit tests.
    await page.goto('/blocks/preview/sidebar-07');
    await context.addCookies([{ name: 'sidebar_state', value: 'false', url: page.url() }]);
    await page.reload();

    const sidebar = page.locator('[data-slot="sidebar"]').first();
    // A persisted collapsed state does not override the explicit default.
    await expect(sidebar).toHaveAttribute('data-state', 'expanded');

    await context.clearCookies();
    await page.locator('[data-slot="sidebar-trigger"]').first().click();
    await expect(sidebar).toHaveAttribute('data-state', 'collapsed');

    // Collapsing it does not persist a state the provider would never read back.
    const cookies = await context.cookies();
    expect(cookies.find(cookie => cookie.name === 'sidebar_state')).toBeUndefined();

    await page.reload();
    await expect(page.locator('[data-slot="sidebar"]').first()).toHaveAttribute('data-state', 'expanded');
  });

  test('the rail toggles the sidebar too', async () => {
    const sidebar = demoPage.firstDemoBox.locator('[data-slot="sidebar"]');

    await demoPage.firstDemoBox.locator('[data-slot="sidebar-rail"]').click();

    await expect(sidebar).toHaveAttribute('data-state', 'collapsed');
  });

  test('the mobile drawer opens with a backdrop and closes on Escape', async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 800 });

    const demo = demoPage.firstDemoBox;
    const drawer = demo.locator('[data-mobile="true"]');
    const backdrop = demo.locator('[data-slot="sidebar-backdrop"]');

    // The drawer stays mounted so it can animate out; `data-state` and `inert` carry the open state.
    await expect(drawer).toHaveAttribute('data-state', 'closed');
    await expect(drawer).toHaveAttribute('inert', '');

    await demo.locator('[data-slot="sidebar-trigger"]').click();

    await expect(drawer).toHaveAttribute('data-state', 'open');
    await expect(drawer).not.toHaveAttribute('inert', '');
    await expect(drawer).toHaveAttribute('role', 'dialog');
    await expect(backdrop).toHaveAttribute('data-state', 'open');

    await page.keyboard.press('Escape');

    await expect(drawer).toHaveAttribute('data-state', 'closed');
    await expect(drawer).toHaveAttribute('inert', '');
  });

  test('passes accessibility checks', async ({ page }) => {
    // `button-name` is the docs page's own z-assist popover trigger, not the sidebar — every other
    // component spec disables it for the same reason.
    await checkA11y(page, '#overview', ['button-name', 'color-contrast']);
  });
});
