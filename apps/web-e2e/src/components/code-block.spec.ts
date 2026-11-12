import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Code Block component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'code-block');
    await demoPage.goto();
  });

  test('renders the block with a header, content and copy button', async () => {
    // `z-code-block` is also the selector of the docs site's own code viewer, so the component is picked by its slot
    const block = demoPage.firstDemoBox.locator('[data-slot="code-block"]').first();
    await expect(block).toBeVisible();
    await expect(block.locator('z-code-block-header')).toBeVisible();
    await expect(block.locator('z-code-block-title')).toBeVisible();
    await expect(block.locator('z-code-block-content')).toBeVisible();
    await expect(block.locator('z-code-block-copy-button button')).toBeVisible();
  });

  test('content is focusable, left to right and scrollable by keyboard', async ({ page }) => {
    const content = demoPage.firstDemoBox.locator('z-code-block-content');
    await expect(content).toHaveAttribute('tabindex', '0');
    await expect(content).toHaveAttribute('dir', 'ltr');
    await expect(content).toHaveCSS('overflow-x', 'auto');

    await page.keyboard.press('Tab');
    await content.focus();
    await expect(content).toBeFocused();
  });

  test('copy button copies the value and announces "Copied"', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const block = demoPage.firstDemoBox.locator('[data-slot="code-block"]').first();
    const button = block.locator('[data-slot="code-block-copy-button"]');
    const liveRegion = block.locator('[aria-live="polite"]');

    await expect(liveRegion).toHaveText('');
    await button.click();

    await expect(liveRegion).toHaveText('Copied');
    await expect(button).toHaveAttribute('data-copied', '');
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain('GreetingComponent');
    // the copied text is the code only
    expect(copied).not.toContain('Copied');

    await expect(liveRegion).toHaveText('', { timeout: 5_000 });
    await expect(button).not.toHaveAttribute('data-copied');
  });

  test('copy button works with the keyboard', async ({ context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const button = demoPage.firstDemoBox.locator('[data-slot="code-block-copy-button"]');

    await button.focus();
    await expect(button).toBeFocused();
    const liveRegion = demoPage.firstDemoBox.locator('[aria-live="polite"]');

    // retried: a key pressed while the page is still hydrating is lost
    await expect(async () => {
      await button.press('Enter');
      await expect(liveRegion).toHaveText('Copied', { timeout: 1_000 });
    }).toPass({ timeout: 10_000 });
  });

  test('floating actions are hidden until the block is hovered or focused', async () => {
    const demo = demoPage.getDemoByName('basic');
    const actions = demo.locator('[data-slot="code-block"] > z-code-block-actions');
    await expect(actions).toHaveCSS('opacity', '0');

    await actions.locator('button').focus();
    await expect(actions).toHaveCSS('opacity', '1');
  });

  test('line numbers are generated content, so they are not text', async () => {
    const demo = demoPage.getDemoByName('line-numbers');
    const content = demo.locator('z-code-block-content').first();
    await expect(content).toHaveAttribute('data-numbered', '');

    const lines = content.locator('[data-slot="code-block-line"]');
    expect(await lines.count()).toBe(4);
    // the gutter is a CSS counter on ::before: it is neither in the DOM text nor selectable
    expect(await lines.evaluateAll(els => els.map(el => el.textContent?.trim() ?? ''))).toEqual([
      'npm install zard-cli',
      'npx zard-cli@latest init',
      '',
      'npx zard-cli@latest add button',
    ]);
    // generated content is not part of a selection, so it is not copied either
    const selected = await content.evaluate(el => {
      const selection = window.getSelection() as Selection;
      const range = document.createRange();
      range.selectNodeContents(el);
      selection.removeAllRanges();
      selection.addRange(range);
      return selection.toString();
    });
    expect(selected).not.toMatch(/^\s*\d+\s*$/m);
    expect(selected).toContain('npx zard-cli@latest init');
    expect(await lines.first().evaluate(el => getComputedStyle(el, '::before').userSelect)).toBe('none');
  });

  test('a start line offsets the numbers and a highlighted line is tinted', async () => {
    const demo = demoPage.getDemoByName('line-numbers');
    const content = demo.locator('z-code-block-content').nth(1);
    const first = content.locator('[data-slot="code-block-line"]').first();

    expect(await content.evaluate(el => (el as HTMLElement).style.counterReset)).toBe('line 11');
    expect(await first.evaluate(el => getComputedStyle(el).counterIncrement)).toBe('line 1');
    await expect(first).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    const highlighted = content.locator('[data-variant="highlighted"]');
    await expect(highlighted).toHaveCount(1);
    await expect(highlighted).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  });

  test('wrap toggle changes how long lines are laid out', async () => {
    const demo = demoPage.getDemoByName('wrap');
    const toggle = demo.locator('button[aria-pressed]');
    const content = demo.locator('z-code-block-content').nth(1);

    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await expect(content).toHaveCSS('white-space', 'pre');
    const scrollable = await content.evaluate(el => el.scrollWidth > el.clientWidth);
    expect(scrollable).toBe(true);

    await toggle.click();

    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(content).toHaveAttribute('data-wrap', '');
    await expect(content).toHaveCSS('white-space', 'pre-wrap');
    expect(await content.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  });

  test('diff lines carry a marker and a tint, and the marker is not selectable text', async () => {
    const demo = demoPage.getDemoByName('diff');
    const added = demo.locator('z-code-block-line[data-variant="added"]');
    const removed = demo.locator('z-code-block-line[data-variant="removed"]');

    await expect(added).toHaveCount(1);
    await expect(removed).toHaveCount(1);
    expect(await added.evaluate(el => getComputedStyle(el, '::after').content)).toContain('+');
    expect(await removed.evaluate(el => getComputedStyle(el, '::after').content)).toContain('−');
    expect(await added.evaluate(el => getComputedStyle(el, '::after').userSelect)).toBe('none');
    expect(await added.evaluate(el => el.textContent)).not.toMatch(/^\+/);
    const addedBackground = await added.evaluate(el => getComputedStyle(el).backgroundColor);
    const removedBackground = await removed.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(addedBackground).not.toBe(removedBackground);
  });

  test('height example caps the content and keeps it scrollable and focusable', async () => {
    const content = demoPage.getDemoByName('height').locator('z-code-block-content');
    await expect(content).toHaveAttribute('tabindex', '0');
    expect(await content.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true);

    await content.focus();
    await content.press('End');
    expect(await content.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
  });

  test('show more expands the content and keeps aria-expanded in sync', async () => {
    const demo = demoPage.getDemoByName('show-more');
    const content = demo.locator('z-code-block-content');
    const button = demo.locator('z-code-block-footer button');

    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(button).toHaveAttribute('aria-controls', (await content.getAttribute('id')) ?? '');
    const collapsed = (await content.boundingBox())?.height ?? 0;

    await button.click();

    await expect(button).toHaveAttribute('aria-expanded', 'true');
    expect((await content.boundingBox())?.height ?? 0).toBeGreaterThan(collapsed);
  });

  test('highlighting loads Shiki on demand and colors tokens for light and dark', async ({ page }) => {
    const demo = demoPage.getDemoByName('highlighting');
    const token = demo.locator('[data-slot="code-block-line-content"] span[style*="--shiki-light"]').first();
    await expect(token).toBeAttached({ timeout: 15_000 });

    const light = await token.evaluate(el => getComputedStyle(el).color);
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    const dark = await token.evaluate(el => getComputedStyle(el).color);
    await page.evaluate(() => document.documentElement.classList.remove('dark'));

    expect(light).not.toBe(dark);
  });

  test('terminal renders ANSI colors instead of escape codes', async () => {
    const demo = demoPage.getDemoByName('terminal');
    const content = demo.locator('z-code-block-content');
    await expect(content.locator('span[style*="--shiki-light"]').first()).toBeAttached({ timeout: 15_000 });

    await expect(content).not.toContainText('[32m');
    await expect(content).not.toContainText('[0m');
    await expect(content).toContainText('PASS');
    await expect(content).toContainText('FAIL');
  });

  test('destructive and small variants are exposed as data attributes', async () => {
    const demo = demoPage.getDemoByName('variants');
    await expect(demo.locator('[data-slot="code-block"]').first()).toHaveAttribute('data-variant', 'destructive');
    await expect(demo.locator('[data-slot="code-block"]').nth(1)).toHaveAttribute('data-size', 'sm');
  });

  test('rtl example keeps the code left to right while the header follows the page', async ({ page }) => {
    const demo = demoPage.getDemoByName('rtl');
    await demo.scrollIntoViewIfNeeded();
    await expect(demo.locator('[data-slot="preview"]')).toHaveAttribute('dir', 'rtl');

    await expect(demo.locator('z-code-block-content')).toHaveCSS('direction', 'ltr');
    await expect(demo.locator('z-code-block-header')).toHaveCSS('direction', 'rtl');

    await checkA11y(page, '#rtl');
  });

  test('every example but the Shiki ones passes accessibility checks, contrast included', async ({ page }) => {
    await expect(page.locator('[id="highlighting"] span[style*="--shiki-light"]').first()).toBeAttached({
      timeout: 15_000,
    });
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .include('#examples')
      .exclude('#highlighting')
      .exclude('#terminal')
      .analyze();

    expect(results.violations.map(violation => `${violation.id} (${violation.nodes.length})`)).toEqual([]);
  });

  test('the Shiki examples pass accessibility checks but contrast', async ({ page }) => {
    // color-contrast: both examples print the palette of the Shiki github themes as is (a few syntax tokens and the
    // ANSI green / red are below 4.5:1 on white, the same palette as the docs site's own viewer); the words PASS and
    // FAIL carry the meaning in the terminal, so color is not the only cue
    for (const id of ['highlighting', 'terminal']) {
      await expect(page.locator(`[id="${id}"] span[style*="--shiki-light"]`).first()).toBeAttached({
        timeout: 15_000,
      });
      await checkA11y(page, `#${id}`, ['color-contrast']);
    }
  });

  test('passes accessibility checks', async ({ page }) => {
    await checkA11y(page, '#overview');
  });
});
