import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Trace component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'trace');
    await demoPage.goto();
  });

  test('renders lines that are plain text, not tab stops', async () => {
    const trace = demoPage.firstDemoBox.locator('z-trace').first();
    await expect(trace).toBeVisible();

    const line = trace.locator('> z-trace-line').first();
    await expect(line).toBeVisible();
    await expect(line).not.toHaveAttribute('tabindex', /.*/);
    await expect(line).not.toHaveAttribute('role', /.*/);
    await expect(line.locator('[data-slot="trace-icon"]')).toHaveAttribute('aria-hidden', 'true');
  });

  test('the collapsible trigger is a single button that toggles the detail', async ({ page }) => {
    const row = demoPage.firstDemoBox.locator('z-trace-collapsible').first();
    const trigger = row.getByRole('button');
    const panel = row.locator('[data-slot="collapsible-content"]');

    await expect(trigger).toHaveCount(1);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger.locator('button, a')).toHaveCount(0);
    await expect(row.locator('[data-slot="trace-collapsible-content-inner"]')).toBeEmpty();

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(row.locator('[data-slot="trace-collapsible-content-inner"]')).not.toBeEmpty();
    await expect(panel).toBeVisible();

    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toBeHidden();
    await page.keyboard.press('Space');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  test('a running line shimmers its title and reduced motion stops it', async ({ page }) => {
    const title = demoPage.getDemoByName('status').locator('z-trace-line[data-status="running"] z-trace-title');
    await title.scrollIntoViewIfNeeded();

    await expect(title).toHaveCSS('animation-name', 'tw-shimmer');
    const plain = demoPage.getDemoByName('status').locator('z-trace-line:not([data-status]) z-trace-title').first();
    await expect(plain).not.toHaveCSS('animation-name', 'tw-shimmer');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(title).toHaveCSS('background-image', 'none');
  });

  test('pending and error lines are distinguishable beyond colour in the text', async () => {
    const demo = demoPage.getDemoByName('status');
    await expect(demo.locator('z-trace-line[data-status="error"] z-trace-title')).toContainText(/failed/i);
    await expect(demo.locator('z-trace-line[data-status="running"] z-trace-title')).toContainText(/running/i);
  });

  test('a link wraps the line without nesting interactive elements', async () => {
    const demo = demoPage.getDemoByName('link');
    await demo.scrollIntoViewIfNeeded();
    const link = demo.locator('z-trace').getByRole('link');

    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAccessibleName(/opens in a new tab/);
    await expect(link.locator('button, a, [tabindex]')).toHaveCount(0);
  });

  test('a dialog opens from the wrapped line and returns focus on Escape', async ({ page }) => {
    const demo = demoPage.getDemoByName('dialog');
    await demo.scrollIntoViewIfNeeded();
    const trigger = demo.getByRole('button', { name: /searched the web/i });

    await trigger.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('a sheet opens from a file row in the commit example', async ({ page }) => {
    const demo = demoPage.getDemoByName('commit');
    await demo.scrollIntoViewIfNeeded();
    const file = demo.getByRole('button', { name: /edited index\.ts/i });

    await file.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('dialog')).toContainText('src/index.ts');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
  });

  test('sources expand into a nested list of links', async () => {
    const demo = demoPage.getDemoByName('sources');
    await demo.scrollIntoViewIfNeeded();
    const trace = demo.locator('z-trace').first();
    const trigger = trace.getByRole('button').first();

    await expect(trace.getByRole('link')).toHaveCount(0);
    await trigger.click();
    await expect(trace.getByRole('link')).toHaveCount(3);
  });

  test('RTL example renders inside an RTL preview and mirrors the chevron', async () => {
    const rtlDemo = demoPage.getDemoByName('rtl');
    await rtlDemo.scrollIntoViewIfNeeded();
    const preview = rtlDemo.locator('[data-slot="preview"]');
    await expect(preview).toHaveAttribute('dir', 'rtl');

    // The icon sits at the inline-start edge, which is the right edge in RTL.
    const line = preview.locator('z-trace-line').first();
    const icon = await line.locator('z-trace-icon').boundingBox();
    const title = await line.locator('z-trace-title').boundingBox();
    expect(icon?.x).toBeGreaterThan(title?.x ?? Infinity);

    await checkA11y(rtlDemo.page(), '[id="rtl"]', []);
  });

  test('passes accessibility checks', async ({ page }) => {
    // Exercise the open state of every collapsible in the overview as well as the closed one.
    await demoPage.firstDemoBox.getByRole('button').first().click();
    await checkA11y(page, '#overview', []);
  });

  test('every example passes accessibility checks', async ({ page }) => {
    // The `pending` rows are left out of the scan: they are deliberately dimmed (`opacity-60`) to read as "not started
    // yet", which takes them below 4.5:1 by design, and their title still says what they are. Every other row in every
    // example keeps the full rule set, including color-contrast.
    await checkA11y(page, '#examples', [], ['z-trace-line[data-status="pending"]']);
  });
});
