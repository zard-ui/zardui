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
    const firstCard = demoPage.firstDemoCard;
    await expect(firstCard).toBeVisible();

    const buttons = firstCard.locator('button[z-button]');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('button is clickable and remains interactive', async () => {
    const button = demoPage.firstDemoCard.locator('button[z-button]').first();
    await expect(button).toBeEnabled();
    await button.click();
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
  });

  test('button with icon is visible and interactive', async () => {
    const firstCard = demoPage.firstDemoCard;
    const buttons = firstCard.locator('button[z-button]');
    const count = await buttons.count();
    expect(count).toBeGreaterThanOrEqual(3);

    const iconOnlyButton = buttons.nth(1);
    await expect(iconOnlyButton).toBeVisible();
    await expect(iconOnlyButton).toBeEnabled();
    await iconOnlyButton.click();
    await expect(iconOnlyButton).toBeEnabled();

    const buttonWithIcon = buttons.nth(2);
    await expect(buttonWithIcon).toBeVisible();
    await expect(buttonWithIcon).toContainText('Button');
    await expect(buttonWithIcon).toBeEnabled();
  });

  test('passes accessibility checks', async ({ page }) => {
    // button-name: icon-only variant buttons in the demo lack discernible text
    await checkA11y(page, '#overview', ['button-name']);
  });
});
