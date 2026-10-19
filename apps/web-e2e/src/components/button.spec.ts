import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Button component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'button');
    await demoPage.goto();
  });

  test('renders default demo with buttons', async () => {
    const firstCard = demoPage.firstDemoBox;
    await expect(firstCard).toBeVisible();

    const buttons = firstCard.locator('button[z-button]');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('button is clickable and remains interactive', async () => {
    const button = demoPage.firstDemoBox.locator('button[z-button]').first();
    await expect(button).toBeEnabled();
    await button.click();
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
  });

  test('button with icon is visible and interactive', async () => {
    const firstCard = demoPage.firstDemoBox;
    const buttons = firstCard.locator('button[z-button]');
    const count = await buttons.count();
    expect(count).toBeGreaterThanOrEqual(2);

    const textButton = buttons.nth(0);
    await expect(textButton).toBeVisible();
    await expect(textButton).toContainText('Button');
    await expect(textButton).toBeEnabled();

    const iconOnlyButton = buttons.nth(1);
    await expect(iconOnlyButton).toBeVisible();
    await expect(iconOnlyButton).toBeEnabled();
    await iconOnlyButton.click();
    await expect(iconOnlyButton).toBeEnabled();
  });

  test('rtl example mirrors the directional arrow and keeps icons on the logical sides', async ({ page }) => {
    const demo = demoPage.getDemoByName('rtl');
    await demo.scrollIntoViewIfNeeded();
    await expect(demo.locator('[data-slot="preview"]')).toHaveAttribute('dir', 'rtl');

    const buttons = demo.locator('[data-slot="preview"] button[z-button]');
    const learnMore = buttons.nth(1);
    const arrow = learnMore.locator('ng-icon[data-icon="inline-end"]');
    await expect(arrow).toHaveCSS('rotate', '180deg');

    // the inline-end icon sits on the physical left of the label, the inline-start icon on the right
    const learnBox = (await learnMore.boundingBox())!;
    const arrowBox = (await arrow.boundingBox())!;
    expect(arrowBox.x + arrowBox.width / 2).toBeLessThan(learnBox.x + learnBox.width / 2);

    const branch = buttons.nth(2);
    const branchBox = (await branch.boundingBox())!;
    const branchIconBox = (await branch.locator('ng-icon[data-icon="inline-start"]').boundingBox())!;
    expect(branchIconBox.x + branchIconBox.width / 2).toBeGreaterThan(branchBox.x + branchBox.width / 2);

    await checkA11y(page, '#rtl', ['color-contrast']);
  });

  test('passes accessibility checks', async ({ page }) => {
    // button-name: icon-only variant buttons in the demo lack discernible text
    // color-contrast: Shiki syntax highlighting has insufficient contrast (4.3:1)
    await checkA11y(page, '#overview', ['button-name', 'color-contrast']);
  });
});
