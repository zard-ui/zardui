import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Avatar component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'avatar');
    await demoPage.goto();
  });

  test('renders the demo avatars', async () => {
    const firstCard = demoPage.firstDemoBox;
    await expect(firstCard).toBeVisible();

    const avatars = firstCard.locator('z-avatar');
    const count = await avatars.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('an avatar with a valid src loads and fades its image in', async () => {
    const validAvatar = demoPage.firstDemoBox.locator('z-avatar').first();
    const image = validAvatar.locator('img');

    await expect(image).toHaveClass(/opacity-100/);
    await expect(image).toHaveJSProperty('complete', true);
  });

  test('an avatar with a broken src keeps rendering the fallback, not the img', async () => {
    // Second avatar in the basic example points at a deliberately broken URL.
    const brokenAvatar = demoPage.getDemoByName('basic').locator('z-avatar').nth(1);

    await expect(brokenAvatar.locator('img')).toHaveCount(0);
    await expect(brokenAvatar.locator('span')).toBeVisible();
  });

  test('the fallback and image layers never share the box as flex siblings', async () => {
    // Regression guard for the layout bug: both nodes must be taken out of flex flow
    // (absolutely positioned) so neither one can be squeezed by the other while loading.
    const validAvatar = demoPage.firstDemoBox.locator('z-avatar').first();

    await expect(validAvatar.locator('span')).toHaveClass(/absolute/);
    await expect(validAvatar.locator('img')).toHaveClass(/absolute/);
  });

  test('avatar box does not resize once the image has loaded', async () => {
    const validAvatar = demoPage.firstDemoBox.locator('z-avatar').first();
    const box = await validAvatar.boundingBox();

    expect(box).not.toBeNull();
    expect(box?.width).toBeCloseTo(box?.height ?? 0, 0);
  });

  test('passes accessibility checks', async ({ page }) => {
    // color-contrast: Shiki syntax highlighting in the embedded code block has insufficient contrast (4.3:1)
    await checkA11y(page, '#overview', ['color-contrast']);
  });
});

test.describe('Avatar RTL', () => {
  test('renders the rtl example mirrored', async ({ page }) => {
    const demoPage = new ComponentDemoPage(page, 'avatar');
    await demoPage.goto();

    const rtl = demoPage.getDemoByName('rtl');
    await rtl.scrollIntoViewIfNeeded();
    const preview = rtl.locator('[data-slot="preview"]');
    await expect(preview).toHaveAttribute('dir', 'rtl');
    await expect(preview).toHaveAttribute('data-lang', 'ar');

    const avatars = preview.locator('z-avatar-group z-avatar');
    await expect(avatars).toHaveCount(3);
    const first = await avatars.nth(0).boundingBox();
    const second = await avatars.nth(1).boundingBox();
    // The stack overlaps toward the inline end: the first avatar is the right-most one.
    expect(first!.x).toBeGreaterThan(second!.x);
    expect(second!.x + second!.width).toBeGreaterThan(first!.x);
    // Tailwind v4 `space-x` already uses logical margins: every pair overlaps and the stack stays inside the group.
    const third = await avatars.nth(2).boundingBox();
    expect(third!.x + third!.width).toBeGreaterThan(second!.x);
    const group = await preview.locator('z-avatar-group').first().boundingBox();
    expect(first!.x + first!.width).toBeLessThanOrEqual(group!.x + group!.width + 1);
    const badged = preview.locator('z-avatar').nth(1);
    const badge = await badged.locator(':scope > div').boundingBox();
    const host = await badged.boundingBox();
    // The status badge sits on the inline end (left) edge.
    expect(badge!.x + badge!.width / 2).toBeLessThan(host!.x + host!.width / 2);

    await checkA11y(page, '#rtl z-demo-avatar-rtl', ['color-contrast', 'button-name']);
  });
});
