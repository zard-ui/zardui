import { expect, test } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Attachment', () => {
  let demos: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demos = new ComponentDemoPage(page, 'attachment');
    await demos.goto();
  });

  test('hydrates all six demos and operates independent file/image removal', async () => {
    await expect(demos.firstDemoBox.locator('[data-slot="attachment"]').first()).toBeVisible();
    for (const name of ['image', 'states', 'sizes', 'group', 'trigger']) {
      await expect(
        demos.getDemoByName(name).locator('[data-slot="attachment"], [data-slot="attachment-group"]').first(),
      ).toBeVisible();
    }
    const file = demos.firstDemoBox;
    await file.getByRole('button', { name: 'Remove Project notes.pdf' }).click();
    await expect(file.locator('[data-slot="attachment"]')).toHaveCount(0);
    await file.getByRole('button', { name: 'Restore file' }).click();
    await expect(file.locator('[data-slot="attachment"]')).toBeVisible();
    const image = demos.getDemoByName('image');
    await expect(image.getByRole('img')).toHaveAttribute('alt', /mountain/i);
    await image.getByRole('button', { name: 'Remove Mountains.svg' }).click();
    await expect(image.locator('[data-slot="attachment"]')).toHaveCount(0);
    await expect(file.locator('[data-slot="attachment"]')).toBeVisible();
  });

  test('updates busy, retry and removal state without affecting another card', async () => {
    const states = demos.getDemoByName('states');
    const card = states.locator('[data-slot="attachment"]').first();
    for (const state of ['idle', 'uploading', 'processing', 'error', 'done']) {
      await states.getByRole('button', { name: state, exact: true }).click();
      await expect(card).toHaveAttribute('data-state', state);
      if (state === 'uploading' || state === 'processing') {
        await expect(card).toHaveAttribute('aria-busy', 'true');
        await expect(card.locator('[data-slot="attachment-title"]')).toHaveClass(/animate-pulse/);
      } else {
        await expect(card).not.toHaveAttribute('aria-busy');
        await expect(card.locator('[data-slot="attachment-title"]')).not.toHaveClass(/animate-pulse/);
      }
      await expect(states.locator('[data-slot="attachment"]').last()).toHaveAttribute('data-state', 'done');
    }
    await states.getByRole('button', { name: 'error', exact: true }).click();
    await expect(card.locator('[data-slot="attachment-description"]')).toContainText('Upload failed');
    await states.getByRole('button', { name: 'Retry Report.pdf' }).click();
    await expect(card).toHaveAttribute('data-state', 'uploading');
    await states.getByRole('button', { name: 'Remove Report.pdf' }).click();
    await expect(states.locator('[data-slot="attachment"]')).toHaveCount(1);
    await expect(states.locator('[data-slot="attachment-title"]')).toContainText('Independent.txt');
    await states.getByRole('button', { name: 'Restore Report.pdf' }).click();
    await expect(states.locator('[data-slot="attachment"]')).toHaveCount(2);
  });

  test('renders densities, both orientations and both media modes', async () => {
    const sizes = demos.getDemoByName('sizes');
    for (const size of ['default', 'sm', 'xs']) {
      await expect(sizes.locator(`[data-slot="attachment"][data-size="${size}"]`)).toBeVisible();
    }
    await sizes.getByRole('button', { name: 'Toggle orientation' }).click();
    for (const card of await sizes.locator('[data-slot="attachment"]').all()) {
      await expect(card).toHaveAttribute('data-orientation', 'vertical');
      expect(await card.evaluate(el => getComputedStyle(el).flexDirection)).toBe('column');
    }
    await sizes.getByRole('button', { name: 'Toggle media' }).click();
    for (const media of await sizes.locator('[data-slot="attachment-media"]').all()) {
      await expect(media).toHaveAttribute('data-variant', 'image');
      await expect(media.getByRole('img')).toBeVisible();
    }
    await sizes.getByRole('button', { name: 'Inspect xs attachment' }).click();
    await expect(sizes.getByRole('status')).toHaveText('Selected: xs');
  });

  test('scrolls the named group with host keys and leaves descendant keys alone', async ({ page }) => {
    const groupDemo = demos.getDemoByName('group');
    const group = groupDemo.getByRole('group', { name: 'Attached files' });
    expect(await group.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true);
    expect(await group.evaluate(el => getComputedStyle(el).scrollSnapType)).toContain('x');
    expect(
      await group
        .locator('[data-slot="attachment"]')
        .first()
        .evaluate(el => getComputedStyle(el).scrollSnapAlign),
    ).toBe('start');
    await group.focus();
    await page.keyboard.press('ArrowRight');
    await expect.poll(() => group.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
    const scrolled = await group.evaluate(el => el.scrollLeft);
    const action = group.getByRole('button').first();
    await action.focus();
    const beforeNested = await group.evaluate(el => el.scrollLeft);
    await action.dispatchEvent('keydown', { key: 'ArrowRight', bubbles: true });
    expect(await group.evaluate(el => el.scrollLeft)).toBe(beforeNested);
    await group.focus();
    await page.keyboard.press('Shift+ArrowRight');
    expect(await group.evaluate(el => el.scrollLeft)).toBe(beforeNested);
    await page.keyboard.press('ArrowRight');
    await group.evaluate(el => {
      (el as HTMLElement).style.width = '280px';
    });
    await group.focus();
    await page.keyboard.press('ArrowLeft');
    await expect.poll(() => group.evaluate(el => el.scrollLeft)).toBeLessThan(scrolled + 300);
    for (const file of ['Notes.pdf', 'Photo.png', 'Budget.csv', 'Archive.zip']) {
      await group.getByRole('button', { name: `Remove ${file}` }).click();
    }
    await group.focus();
    await page.keyboard.press('ArrowRight');
    expect(await group.evaluate(el => el.scrollLeft)).toBe(0);
    await groupDemo.getByRole('button', { name: 'Restore files' }).click();
    await expect(group.locator('[data-slot="attachment"]')).toHaveCount(4);
  });

  test('hit-tests separate overlay/actions, native focus and click events', async ({ page }) => {
    const trigger = demos.getDemoByName('trigger');
    const overlay = trigger.getByRole('button', { name: 'Preview Preview.pdf' });
    await overlay.click({ position: { x: 20, y: 20 } });
    await expect(trigger.getByRole('status')).toHaveText('Preview opened 1 times');
    await overlay.focus();
    await page.keyboard.press('Enter');
    await expect(trigger.getByRole('status')).toHaveText('Preview opened 2 times');
    await page.keyboard.press('Tab');
    await expect(trigger.getByRole('button', { name: 'Remove Preview.pdf' })).toBeFocused();
    const download = trigger.getByRole('link', { name: 'Download Preview.pdf' });
    await expect(download).toHaveAttribute('download', 'Preview.pdf');
    await trigger.getByRole('button', { name: 'Remove Preview.pdf' }).click();
    await expect(trigger.locator('[data-slot="attachment"]')).toHaveCount(0);
    await expect(trigger.getByRole('status')).toHaveText('Preview opened 2 times');
    await trigger.getByRole('button', { name: 'Restore Preview.pdf' }).click();
    await expect(trigger.locator('[data-slot="attachment"]')).toHaveCount(1);
  });

  for (const dark of [false, true]) {
    for (const reducedMotion of ['no-preference', 'reduce'] as const) {
      test(`keeps busy text readable and demos accessible: dark=${dark}, motion=${reducedMotion}`, async ({ page }) => {
        test.setTimeout(60_000);
        await page.emulateMedia({ reducedMotion, colorScheme: dark ? 'dark' : 'light' });
        await page.evaluate(dark => document.documentElement.classList.toggle('dark', dark), dark);
        const states = demos.getDemoByName('states');
        await states.getByRole('button', { name: 'uploading', exact: true }).click();
        const title = states.locator('[data-slot="attachment-title"]').first();
        const paint = await title.evaluate(el => {
          const css = getComputedStyle(el);
          return { fill: css.webkitTextFillColor, color: css.color, animation: css.animationName };
        });
        expect(paint.color).not.toBe('rgba(0, 0, 0, 0)');
        expect(paint.fill).toBe(paint.color);
        expect(paint.animation).toBe(reducedMotion === 'reduce' ? 'none' : 'pulse');
        await checkA11y(page, '#overview z-demo-attachment-preview');
        for (const name of ['image', 'states', 'sizes', 'group', 'trigger']) {
          await checkA11y(page, `#${name} z-demo-attachment-${name}`);
        }
      });
    }
  }
});
