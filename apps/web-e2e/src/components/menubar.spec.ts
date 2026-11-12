import { expect, test, type Locator } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Menubar component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'menubar');
    await demoPage.goto();
  });

  const bar = () => demoPage.firstDemoBox.locator('z-menubar');
  const triggers = () => bar().locator('[z-menubar-trigger]');
  const menu = () => demoPage.page.locator('.cdk-overlay-container [data-slot="dropdown-menu-content"]');
  const subMenu = () => demoPage.page.locator('.cdk-overlay-container [data-slot="dropdown-menu-sub-content"]');

  /** Hydration binds the listeners after the first paint: retry the click until the menu answers. */
  async function openWithClick(trigger: Locator) {
    await expect(async () => {
      await trigger.click();
      await expect(trigger).toHaveAttribute('aria-expanded', 'true', { timeout: 1000 });
    }).toPass({ timeout: 10_000 });
  }

  async function loadExamples() {
    await demoPage.page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    await demoPage.page.locator('#examples').waitFor({ state: 'attached', timeout: 10_000 });
    await demoPage.page.locator('#examples').scrollIntoViewIfNeeded({ timeout: 5000 });
  }

  async function example(name: string) {
    await loadExamples();
    const demo = demoPage.getDemoByName(name);
    await demo.waitFor({ state: 'attached', timeout: 15_000 });
    await demo.scrollIntoViewIfNeeded();
    return demo;
  }

  test.describe('semantics', () => {
    test('renders a menubar of menu triggers', async () => {
      await expect(bar()).toHaveAttribute('role', 'menubar');
      await expect(bar()).toHaveAttribute('aria-orientation', 'horizontal');
      expect(await triggers().count()).toBeGreaterThan(1);

      for (const trigger of await triggers().all()) {
        await expect(trigger).toHaveAttribute('role', 'menuitem');
        await expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      }
    });

    test('is a single tab stop with a roving tabindex', async () => {
      await expect(triggers().first()).toHaveAttribute('tabindex', '0');
      await expect(triggers().nth(1)).toHaveAttribute('tabindex', '-1');

      await triggers().nth(1).focus();
      await expect(triggers().nth(1)).toHaveAttribute('tabindex', '0');
      await expect(triggers().first()).toHaveAttribute('tabindex', '-1');
    });
  });

  test.describe('pointer', () => {
    test('opens a menu on click and closes it on a second click', async () => {
      const trigger = triggers().first();
      await openWithClick(trigger);

      await expect(menu()).toBeVisible();
      await expect(menu()).toHaveAttribute('role', 'menu');
      await expect(trigger).toHaveAttribute('data-state', 'open');

      await trigger.click();
      await expect(menu()).toHaveCount(0);
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    test('does not open a menu by hovering while none is open', async () => {
      await triggers().nth(1).hover();

      await expect(menu()).toHaveCount(0);
      await expect(triggers().nth(1)).toHaveAttribute('aria-expanded', 'false');
    });

    test('switches the open menu instantly when a sibling trigger is hovered', async () => {
      await openWithClick(triggers().first());

      await triggers().nth(1).hover();

      // No hover-intent delay: the switch happens on the pointer event itself.
      await expect(triggers().nth(1)).toHaveAttribute('aria-expanded', 'true', { timeout: 500 });
      await expect(triggers().first()).toHaveAttribute('aria-expanded', 'false');
      await expect(menu()).toHaveCount(1);
    });

    test('closes when clicking outside', async ({ page }) => {
      await openWithClick(triggers().first());

      await page.locator('body').click({ position: { x: 1, y: 300 } });

      await expect(menu()).toHaveCount(0);
      await expect(triggers().first()).toHaveAttribute('aria-expanded', 'false');
    });

    test('closes after a row is selected and hands the focus back to its trigger', async () => {
      const trigger = triggers().first();
      await openWithClick(trigger);

      await menu().locator('[role="menuitem"]').first().click();

      await expect(menu()).toHaveCount(0);
      await expect(trigger).toBeFocused();
    });
  });

  test.describe('keyboard on the bar', () => {
    test('moves between triggers with the arrow keys, wrapping at both ends', async ({ page }) => {
      const all = triggers();
      const count = await all.count();
      await all.first().focus();

      await page.keyboard.press('ArrowRight');
      await expect(all.nth(1)).toBeFocused();

      await page.keyboard.press('ArrowLeft');
      await page.keyboard.press('ArrowLeft');
      await expect(all.nth(count - 1)).toBeFocused();

      await page.keyboard.press('ArrowRight');
      await expect(all.first()).toBeFocused();
      await expect(menu()).toHaveCount(0);
    });

    test('jumps to the first and last trigger with Home and End', async ({ page }) => {
      const all = triggers();
      await all.nth(1).focus();

      await page.keyboard.press('End');
      await expect(all.last()).toBeFocused();
      await page.keyboard.press('Home');
      await expect(all.first()).toBeFocused();
    });

    for (const key of ['ArrowDown', 'Enter', 'Space']) {
      test(`opens the menu with ${key} and focuses its first row`, async ({ page }) => {
        const trigger = triggers().first();
        await expect(async () => {
          await trigger.focus();
          await page.keyboard.press(key);
          await expect(trigger).toHaveAttribute('aria-expanded', 'true', { timeout: 1000 });
        }).toPass({ timeout: 10_000 });

        await expect(menu().locator('[role="menuitem"]').first()).toBeFocused();
      });
    }

    test('opens the menu with ArrowUp on its last row', async ({ page }) => {
      const trigger = triggers().first();
      await expect(async () => {
        await trigger.focus();
        await page.keyboard.press('ArrowUp');
        await expect(trigger).toHaveAttribute('aria-expanded', 'true', { timeout: 1000 });
      }).toPass({ timeout: 10_000 });

      await expect(menu().locator('[role="menuitem"]').last()).toBeFocused();
    });
  });

  test.describe('keyboard inside a menu', () => {
    async function openFirstMenuWithKeyboard(page: ComponentDemoPage['page']) {
      const trigger = triggers().first();
      await expect(async () => {
        await trigger.focus();
        await page.keyboard.press('ArrowDown');
        await expect(trigger).toHaveAttribute('aria-expanded', 'true', { timeout: 1000 });
      }).toPass({ timeout: 10_000 });
      await expect(menu().locator('[role="menuitem"]').first()).toBeFocused();
      return trigger;
    }

    test('walks the rows with the vertical arrows', async ({ page }) => {
      await openFirstMenuWithKeyboard(page);
      const rows = menu().locator('[role="menuitem"]');

      await page.keyboard.press('ArrowDown');
      await expect(rows.nth(1)).toBeFocused();
      await page.keyboard.press('ArrowUp');
      await expect(rows.first()).toBeFocused();
    });

    test('jumps to a row by typing its first letter', async ({ page }) => {
      await openFirstMenuWithKeyboard(page);

      // The first menu of the fixture ends on the row that starts with "P".
      const target = menu().locator('[role="menuitem"]', { hasText: /^\s*P/ }).first();
      await page.keyboard.press('p');

      await expect(target).toBeFocused();
    });

    test('switches to the next menu with ArrowRight and focuses its first row', async ({ page }) => {
      const trigger = await openFirstMenuWithKeyboard(page);

      await page.keyboard.press('ArrowRight');

      await expect(triggers().nth(1)).toHaveAttribute('aria-expanded', 'true');
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await expect(menu()).toHaveCount(1);
      await expect(menu().locator('[role="menuitem"]').first()).toBeFocused();
    });

    test('switches to the previous menu with ArrowLeft, wrapping around', async ({ page }) => {
      await openFirstMenuWithKeyboard(page);

      await page.keyboard.press('ArrowLeft');

      await expect(triggers().last()).toHaveAttribute('aria-expanded', 'true');
      await expect(menu()).toHaveCount(1);
    });

    test('closes on Escape and returns the focus to the trigger', async ({ page }) => {
      const trigger = await openFirstMenuWithKeyboard(page);

      await page.keyboard.press('Escape');

      await expect(menu()).toHaveCount(0);
      await expect(trigger).toBeFocused();
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    test('closes on Tab and leaves the bar', async ({ page }) => {
      await openFirstMenuWithKeyboard(page);

      await page.keyboard.press('Tab');

      await expect(menu()).toHaveCount(0);
      const insideBar = await page.evaluate(() => document.activeElement?.closest('z-menubar') !== null);
      expect(insideBar).toBe(false);
    });

    test('selects a row with Enter, closing the menu and focusing the trigger', async ({ page }) => {
      const trigger = await openFirstMenuWithKeyboard(page);

      await page.keyboard.press('Enter');

      await expect(menu()).toHaveCount(0);
      await expect(trigger).toBeFocused();
    });
  });

  test.describe('examples', () => {
    test('opens a submenu with ArrowRight on its row and closes it with ArrowLeft', async ({ page }) => {
      const demo = await example('submenu');
      const trigger = demo.locator('[z-menubar-trigger]').first();
      await expect(async () => {
        await trigger.focus();
        await page.keyboard.press('ArrowDown');
        await expect(trigger).toHaveAttribute('aria-expanded', 'true', { timeout: 1000 });
      }).toPass({ timeout: 10_000 });

      const subTrigger = menu().locator('[data-slot="dropdown-menu-sub-trigger"]');
      await subTrigger.focus();
      await page.keyboard.press('ArrowRight');

      await expect(subMenu()).toBeVisible();
      // The arrow belongs to the submenu row: the bar stays on the same menu.
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');

      await page.keyboard.press('ArrowLeft');
      await expect(subMenu()).toHaveCount(0);
      await expect(subTrigger).toBeFocused();
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    test('toggles checkbox items and picks radio items', async ({ page }) => {
      const demo = await example('checkbox-radio');
      const [viewTrigger, profilesTrigger] = await demo.locator('[z-menubar-trigger]').all();

      await expect(async () => {
        await viewTrigger.click();
        await expect(viewTrigger).toHaveAttribute('aria-expanded', 'true', { timeout: 1000 });
      }).toPass({ timeout: 10_000 });
      const checkbox = menu().getByRole('menuitemcheckbox').nth(1);
      await expect(checkbox).toHaveAttribute('aria-checked', 'false');
      await checkbox.click();
      await expect(menu()).toHaveCount(0);

      await viewTrigger.click();
      await expect(menu().getByRole('menuitemcheckbox').nth(1)).toHaveAttribute('aria-checked', 'true');

      // Hover moves to the next menu while one is open.
      await profilesTrigger.hover();
      await expect(profilesTrigger).toHaveAttribute('aria-expanded', 'true', { timeout: 500 });
      const radios = menu().getByRole('menuitemradio');
      await expect(radios.nth(1)).toHaveAttribute('aria-checked', 'true');
      await radios.first().click();
      await profilesTrigger.click();
      await expect(menu().getByRole('menuitemradio').first()).toHaveAttribute('aria-checked', 'true');
      await page.keyboard.press('Escape');
    });

    test('skips a disabled trigger with the arrow keys and ignores its hover', async ({ page }) => {
      const demo = await example('disabled');
      const all = demo.locator('[z-menubar-trigger]');
      const disabled = all.nth(1);

      await expect(disabled).toHaveAttribute('aria-disabled', 'true');
      await expect(disabled).toHaveAttribute('data-disabled');

      await all.first().focus();
      await page.keyboard.press('ArrowRight');
      await expect(all.last()).toBeFocused();

      await expect(async () => {
        await all.first().click();
        await expect(all.first()).toHaveAttribute('aria-expanded', 'true', { timeout: 1000 });
      }).toPass({ timeout: 10_000 });
      await disabled.hover({ force: true });
      await expect(all.first()).toHaveAttribute('aria-expanded', 'true');
      await expect(disabled).toHaveAttribute('aria-expanded', 'false');
    });

    test('reverses the arrow keys in RTL', async ({ page }) => {
      const demo = await example('rtl');
      const all = demo.locator('[z-menubar-trigger]');

      await all.first().focus();
      await page.keyboard.press('ArrowLeft');
      await expect(all.nth(1)).toBeFocused();
      await page.keyboard.press('ArrowRight');
      await expect(all.first()).toBeFocused();
    });
  });

  test.describe('accessibility', () => {
    // button-name / color-contrast are not disabled: the demos label every trigger with text.
    test('passes accessibility checks', async ({ page }) => {
      await checkA11y(page, '#overview');
    });

    test('passes accessibility checks with a menu open', async ({ page }) => {
      await openWithClick(triggers().first());

      await checkA11y(page, '#overview');
      // `scrollable-region-focusable`: the menu surface is itself focusable and scrolls when it overflows.
      await checkA11y(page, '.cdk-overlay-container', ['scrollable-region-focusable']);
    });
  });
});
