import { test, expect, type Locator, type Page } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

/** Presses Tab (bounded) until the target is focused; call it with focus already inside the questionnaire. */
async function tabTo(page: Page, target: Locator): Promise<void> {
  for (let attempt = 0; attempt < 8; attempt++) {
    if (await target.evaluate(element => element === document.activeElement)) {
      return;
    }
    await page.keyboard.press('Tab');
  }
  await expect(target).toBeFocused();
}

test.describe('Questionnaire component', () => {
  let demoPage: ComponentDemoPage;
  let questionnaire: Locator;
  let progress: Locator;
  let next: Locator;
  let back: Locator;
  let skip: Locator;
  let submit: Locator;

  const activeItem = (): Locator => questionnaire.locator('z-questionnaire-item:not([hidden])');
  const radios = (): Locator => activeItem().locator('input[type="radio"]');
  const checkboxes = (): Locator => activeItem().locator('input[type="checkbox"]');

  /** Answers the first item and moves to the second one (multiple choice, optional). */
  async function answerFirstAndAdvance(): Promise<void> {
    await radios().first().check();
    await next.click();
    await expect(progress).toHaveAttribute('aria-valuenow', '2');
  }

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'questionnaire');
    await demoPage.goto();
    questionnaire = demoPage.firstDemoBox.locator('z-questionnaire').first();
    progress = questionnaire.locator('[role="progressbar"]');
    next = questionnaire.locator('button[z-questionnaire-next]');
    back = questionnaire.locator('button[z-questionnaire-previous]');
    skip = questionnaire.locator('button[z-questionnaire-skip]');
    submit = questionnaire.locator('button[z-questionnaire-submit]');
    await expect(questionnaire).toBeVisible();
  });

  test('renders the progress indicator and a single visible item', async () => {
    await expect(progress).toHaveAttribute('aria-valuemin', '1');
    await expect(progress).toHaveAttribute('aria-valuemax', '3');
    await expect(progress).toHaveAttribute('aria-valuenow', '1');
    await expect(activeItem()).toHaveCount(1);
    await expect(radios().first()).toBeVisible();
    await expect(back).toBeHidden();
    await expect(submit).toBeHidden();
  });

  test('selecting a choice and pressing next advances the progress', async () => {
    await radios().first().check();
    await expect(radios().first()).toBeChecked();

    await next.click();

    await expect(progress).toHaveAttribute('aria-valuenow', '2');
    await expect(checkboxes().first()).toBeVisible();
  });

  test('back returns to the previous item and keeps the answer', async () => {
    await radios().nth(1).check();
    await next.click();
    await expect(progress).toHaveAttribute('aria-valuenow', '2');

    await back.click();

    await expect(progress).toHaveAttribute('aria-valuenow', '1');
    await expect(radios().nth(1)).toBeChecked();
    await expect(radios().first()).not.toBeChecked();
  });

  test('a required item without an answer shows an error and stays in place', async () => {
    await expect(skip).toBeHidden();

    await next.click();

    await expect(progress).toHaveAttribute('aria-valuenow', '1');
    await expect(activeItem()).toHaveAttribute('aria-invalid', 'true');
    await expect(activeItem().locator('[role="alert"]')).toBeVisible();

    // Answering clears the error
    await radios().first().check();
    await expect(activeItem()).not.toHaveAttribute('aria-invalid', 'true');
    await expect(activeItem().locator('[role="alert"]')).toBeHidden();
  });

  test('an optional item can be skipped', async () => {
    await answerFirstAndAdvance();

    await expect(skip).toBeVisible();
    await skip.click();

    await expect(progress).toHaveAttribute('aria-valuenow', '3');
    await expect(radios().first()).toBeVisible();
  });

  test('a multiple item accepts several answers and keeps them when navigating', async () => {
    await answerFirstAndAdvance();

    await checkboxes().nth(0).check();
    await checkboxes().nth(2).check();
    await expect(checkboxes().nth(0)).toBeChecked();
    await expect(checkboxes().nth(2)).toBeChecked();
    await expect(checkboxes().nth(1)).not.toBeChecked();

    await checkboxes().nth(0).uncheck();
    await expect(checkboxes().nth(0)).not.toBeChecked();

    await next.click();
    await expect(progress).toHaveAttribute('aria-valuenow', '3');
    await back.click();
    await expect(checkboxes().nth(2)).toBeChecked();
    await expect(checkboxes().nth(0)).not.toBeChecked();
  });

  test('a letter shortcut selects the matching choice when focus is inside the questionnaire', async ({ page }) => {
    await expect(radios().nth(1)).toHaveAttribute('aria-keyshortcuts', 'b');

    await radios().first().focus();
    await page.keyboard.press('b');

    await expect(radios().nth(1)).toBeChecked();
    await expect(radios().first()).not.toBeChecked();
  });

  test('a shortcut does not affect other questionnaires on the page', async ({ page }) => {
    const all = page.locator('z-questionnaire');
    const total = await all.count();
    expect(total).toBeGreaterThan(2);

    // Another demo with the same letter shortcuts, further down the page
    const other = demoPage.getDemoByName('multiple-selection').locator('z-questionnaire');
    await other.scrollIntoViewIfNeeded();

    const checkedCounts = async (): Promise<number[]> =>
      Promise.all(
        Array.from({ length: total - 1 }, (_, index) =>
          all
            .nth(index + 1)
            .locator('input:checked')
            .count(),
        ),
      );
    const before = await checkedCounts();

    // Focus inside the fixture: only the fixture reacts
    await radios().first().focus();
    await page.keyboard.press('c');
    await expect(radios().nth(2)).toBeChecked();
    expect(await checkedCounts()).toEqual(before);

    // Focus inside another questionnaire: the fixture keeps its answer
    const foreignCheckbox = other.locator('input[type="checkbox"]').first();
    await foreignCheckbox.focus();
    await page.keyboard.press('b');
    await expect(other.locator('input[type="checkbox"]').nth(1)).toBeChecked();
    await expect(radios().nth(2)).toBeChecked();
    await expect(radios().nth(1)).not.toBeChecked();
  });

  test('submits the answers from the last item', async ({ page }) => {
    await answerFirstAndAdvance();
    await skip.click();
    await expect(progress).toHaveAttribute('aria-valuenow', '3');
    await expect(submit).toBeVisible();
    await expect(next).toBeHidden();

    await radios().first().check();
    await submit.click();

    await expect(page.locator('[data-sonner-toast]').first()).toBeVisible();
  });

  test('a required last item blocks the submit until it is answered', async ({ page }) => {
    await answerFirstAndAdvance();
    await skip.click();

    await submit.click();

    await expect(activeItem()).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('[data-sonner-toast]')).toHaveCount(0);
  });

  test('can be completed using only the keyboard', async ({ page }) => {
    await radios().first().focus();
    await page.keyboard.press('Space');
    await expect(radios().first()).toBeChecked();

    await tabTo(page, next);
    await page.keyboard.press('Enter');
    await expect(progress).toHaveAttribute('aria-valuenow', '2');

    await checkboxes().first().focus();
    await page.keyboard.press('Space');
    await expect(checkboxes().first()).toBeChecked();

    await tabTo(page, next);
    await page.keyboard.press('Enter');
    await expect(progress).toHaveAttribute('aria-valuenow', '3');

    await radios().first().focus();
    await page.keyboard.press('ArrowDown');
    await expect(radios().nth(1)).toBeChecked();

    await tabTo(page, submit);
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-sonner-toast]').first()).toBeVisible();
  });

  test('passes accessibility checks', async ({ page }) => {
    await checkA11y(page, '#overview');
    await answerFirstAndAdvance();
    await checkA11y(page, '#overview');
  });
});
