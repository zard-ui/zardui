import { test, expect, type Locator, type Page } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

function getSelectTrigger(demoPage: ComponentDemoPage): Locator {
  return demoPage.firstDemoBox.locator('z-select [role="combobox"]').first();
}

/** Pins a select against the bottom edge of the viewport, away from the docs chrome. */
async function pinToBottomEdge(select: Locator): Promise<void> {
  await select.evaluate(element => {
    const host = element as HTMLElement;
    host.style.position = 'fixed';
    host.style.left = '500px';
    host.style.bottom = '8px';
    host.style.width = '192px';
    host.style.zIndex = '10';
  });
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

  /**
   * The pointer rests wherever it clicked the trigger, so an option sits under it the
   * whole time the arrows are being used. Nothing it does — the list settling into
   * position, an option scrolling beneath it — may take the highlight back.
   */
  test('keeps the keyboard highlight while the pointer rests on an option', async ({ page }) => {
    const { listbox } = await openSelect(page, demoPage);

    await listbox.locator('z-select-item[value="apple"]').hover();
    await listbox.press('ArrowDown');
    await listbox.press('ArrowDown');

    await expect(listbox.locator('z-select-item[value="blueberry"]')).toHaveAttribute('data-highlighted', '');
    await expect(listbox.locator('z-select-item[value="apple"]')).not.toHaveAttribute('data-highlighted');
  });

  test('hands the highlight back once the pointer moves again', async ({ page }) => {
    const { listbox } = await openSelect(page, demoPage);

    await listbox.press('ArrowDown');
    await listbox.locator('z-select-item[value="grapes"]').hover();

    await expect(listbox.locator('z-select-item[value="grapes"]')).toHaveAttribute('data-highlighted', '');
  });

  test('passes accessibility checks when open', async ({ page }) => {
    await openSelect(page, demoPage);
    await checkA11y(page, undefined, ['button-name', 'color-contrast', 'scrollable-region-focusable']);
  });

  test('opens an item-aligned listbox above a trigger at the bottom edge', async ({ page }) => {
    await pinToBottomEdge(demoPage.firstDemoBox.locator('z-select').first());

    const { trigger, listbox } = await openSelect(page, demoPage);

    const listboxBox = await listbox.boundingBox();
    const triggerBox = await trigger.boundingBox();
    expect(listboxBox).not.toBeNull();
    expect(listboxBox!.height).toBeGreaterThan(100);
    expect(listboxBox!.y).toBeGreaterThanOrEqual(0);
    // It must clear the trigger instead of covering it against the viewport edge.
    expect(listboxBox!.y + listboxBox!.height).toBeLessThanOrEqual(triggerBox!.y + 1);
    await expect(listbox.locator('[role="option"]').first()).toBeVisible();
  });

  test('flips a popper listbox above a trigger at the bottom edge', async ({ page }) => {
    const select = page.locator('#scrollable z-select').first();
    await pinToBottomEdge(select);

    await select.locator('[role="combobox"]').click();

    const listbox = page.locator('[data-slot="select-content"][role="listbox"]').last();
    await expect(listbox).toBeVisible();
    await expect(listbox).toHaveAttribute('data-side', 'top');

    const listboxBox = await listbox.boundingBox();
    const triggerBox = await select.locator('[role="combobox"]').boundingBox();
    expect(listboxBox!.y + listboxBox!.height).toBeLessThanOrEqual(triggerBox!.y + 1);
  });

  test('RTL example opens a panel with the direction of its trigger and the check on the inline-end side', async ({
    page,
  }) => {
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    const demo = demoPage.getDemoByName('rtl');
    await demo.waitFor({ state: 'attached', timeout: 15_000 });
    await demo.scrollIntoViewIfNeeded();
    await expect(demo.locator('[data-slot="preview"]')).toHaveAttribute('dir', 'rtl');

    const trigger = demo.locator('[data-slot="preview"] z-select [role="combobox"]');
    await trigger.click();

    const listbox = page.locator('[data-slot="select-content"][role="listbox"]').last();
    await expect(listbox).toBeVisible({ timeout: 5000 });
    await expect(listbox.locator('xpath=ancestor::*[@dir][1]')).toHaveAttribute('dir', 'rtl');

    // Aligned to the trigger's inline-start (right) edge, with the item padding on logical edges.
    const triggerBox = await trigger.boundingBox();
    const listboxBox = await listbox.boundingBox();
    expect(listboxBox!.x + listboxBox!.width).toBeCloseTo(triggerBox!.x + triggerBox!.width, -1);

    await listbox.locator('z-select-item').nth(1).click();
    await trigger.click();
    const selected = listbox
      .locator('z-select-item[aria-selected="true"], z-select-item[data-selected="true"]')
      .first();
    await expect(selected).toBeVisible({ timeout: 5000 });
    const itemBox = await selected.boundingBox();
    const checkBox = await selected.locator('[data-testid="check-icon"]').boundingBox();
    // The selection check sits on the inline-end (left) side in RTL.
    expect(checkBox!.x + checkBox!.width / 2).toBeLessThan(itemBox!.x + itemBox!.width / 2);
  });

  test('RTL example passes accessibility checks when open', async ({ page }) => {
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    const demo = demoPage.getDemoByName('rtl');
    await demo.waitFor({ state: 'attached', timeout: 15_000 });
    await demo.scrollIntoViewIfNeeded();
    await demo.locator('[data-slot="preview"] z-select [role="combobox"]').click();
    await expect(page.locator('[data-slot="select-content"][role="listbox"]').last()).toBeVisible({ timeout: 5000 });
    // `aria-required-children` is the grouped-listbox structure (a `role=separator` inside the listbox) shared with the
    // groups demo: it is not specific to the RTL example.
    await checkA11y(page, undefined, [
      'button-name',
      'color-contrast',
      'scrollable-region-focusable',
      'aria-required-children',
    ]);
  });
});
