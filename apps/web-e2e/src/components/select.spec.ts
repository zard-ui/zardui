import { test, expect, type Locator, type Page } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

function getSelectTrigger(demoPage: ComponentDemoPage): Locator {
  return demoPage.firstDemoBox.locator('z-select [role="combobox"]').first();
}

async function openSelect(page: Page, demoPage: ComponentDemoPage): Promise<{ trigger: Locator; listbox: Locator }> {
  const trigger = getSelectTrigger(demoPage);
  await trigger.scrollIntoViewIfNeeded();
  await expect(trigger).toBeEnabled();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');

  await trigger.click();

  const listbox = page.locator('[data-slot="select-content"][role="listbox"]').last();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(listbox).toBeVisible();

  return { trigger, listbox };
}

test.describe('Select component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'select');
    await demoPage.goto();
  });

  test('renders a combobox trigger in the first demo', async () => {
    const trigger = getSelectTrigger(demoPage);

    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAccessibleName('Select a fruit');
    await expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('opens a listbox tied to the trigger aria-controls', async ({ page }) => {
    const { trigger, listbox } = await openSelect(page, demoPage);
    const controlledId = await trigger.getAttribute('aria-controls');
    expect(controlledId).toBeTruthy();
    await expect(listbox).toHaveAttribute('id', controlledId as string);
    await expect(listbox.locator('[role="option"]').first()).toBeVisible();
  });

  test('selects an option and restores the selected state when reopened', async ({ page }) => {
    const { trigger, listbox } = await openSelect(page, demoPage);

    await listbox.locator('z-select-item[value="banana"]').dispatchEvent('click');
    await expect(page.locator('[data-slot="select-content"]')).not.toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    const reopened = await openSelect(page, demoPage);

    const selectedOption = reopened.listbox.locator('z-select-item[value="banana"]');
    await expect(selectedOption).toHaveAttribute('data-selected', '');
    await expect(selectedOption).toHaveAttribute('aria-selected', 'true');
  });

  test('navigates options with keyboard arrows', async ({ page }) => {
    const { listbox } = await openSelect(page, demoPage);

    await listbox.press('ArrowDown');

    const firstOption = listbox.locator('z-select-item[value="apple"]');
    const secondOption = listbox.locator('z-select-item[value="banana"]');
    await expect(secondOption).toHaveAttribute('data-highlighted', '');

    await listbox.press('ArrowUp');

    await expect(firstOption).toHaveAttribute('data-highlighted', '');
    await expect(secondOption).not.toHaveAttribute('data-highlighted');
  });

  test('passes accessibility checks when open', async ({ page }) => {
    await openSelect(page, demoPage);
    await checkA11y(page, undefined, ['button-name', 'color-contrast', 'scrollable-region-focusable']);
  });
});
