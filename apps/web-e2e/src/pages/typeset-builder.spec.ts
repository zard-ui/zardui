import { test, expect, type Page } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';

/** The `style` the preview container carries, which is the builder's output. */
async function previewStyle(page: Page): Promise<string> {
  return (await page.locator('app-typeset-preview .typeset').getAttribute('style')) ?? '';
}

/** One row of the panel by its label, so `Body` cannot match another row. */
function control(page: Page, label: string) {
  return page.locator(`app-typeset-control[data-control="${label}"]`);
}

/** Opens a row's list and picks a value by its exact label. */
async function choose(page: Page, label: string, option: string): Promise<void> {
  await control(page, label).getByRole('button').first().click();
  await page.getByRole('option', { name: option, exact: true }).click();
}

test.describe('Typeset builder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/typeset');
    await page.waitForLoadState('networkidle');
  });

  test('renders the preview with the default preset', async ({ page }) => {
    const style = await previewStyle(page);

    expect(style).toContain('--typeset-size: 15px');
    expect(style).toContain('--typeset-leading: 1.75');
  });

  test('changing a control restyles the preview', async ({ page }) => {
    await choose(page, 'Size', '18px');

    await expect.poll(async () => await previewStyle(page)).toContain('--typeset-size: 18px');
  });

  test('changing a control puts it in the URL', async ({ page }) => {
    await choose(page, 'Leading', 'Loose (1.9)');

    await expect.poll(() => page.url()).toContain('leading=1.9');
  });

  test('a control back on its default leaves the URL', async ({ page }) => {
    await choose(page, 'Size', '18px');
    await expect.poll(() => page.url()).toContain('scale=18');

    await choose(page, 'Size', '15px');
    await expect.poll(() => page.url()).not.toContain('scale=');
  });

  test('reloading restores the state from the URL', async ({ page }) => {
    await page.goto('/typeset?body=lora&scale=18&leading=1.9');
    await page.waitForLoadState('networkidle');

    const style = await previewStyle(page);
    expect(style).toContain('--typeset-size: 18px');
    expect(style).toContain('--typeset-leading: 1.9');
    expect(style).toContain('Lora Variable');
  });

  // A query param is untrusted input: an invalid value must not reach the `style`
  // binding, it has to fall back to the default.
  test('falls back to the default for an unknown value in the URL', async ({ page }) => {
    await page.goto('/typeset?body=comic-sans&scale=999');
    await page.waitForLoadState('networkidle');

    const style = await previewStyle(page);
    expect(style).toContain('--typeset-size: 15px');
    expect(style).toContain('Geist Variable');
  });

  test('the mono control offers only mono faces', async ({ page }) => {
    await control(page, 'Mono').getByRole('button').first().click();

    const options = page.getByRole('option');
    await expect(options.first()).toBeVisible();

    for (const label of await options.allTextContents()) {
      expect(label).toMatch(/Mono/);
    }
  });

  test('picking a font changes the family the preview renders', async ({ page }) => {
    await choose(page, 'Body', 'Lora');

    await expect
      .poll(
        async () =>
          await page
            .locator('app-typeset-preview .typeset p')
            .first()
            .evaluate(el => getComputedStyle(el).fontFamily),
      )
      .toContain('Lora Variable');
  });

  // The option that hands the heading back to the body does not announce itself:
  // it is first in the list and repeats the body font's name, which therefore
  // appears twice.
  test('the heading row can defer to the body face', async ({ page }) => {
    await choose(page, 'Heading', 'Montserrat');
    await expect.poll(() => page.url()).toContain('heading=montserrat');

    await control(page, 'Heading').getByRole('button').first().click();
    await page.getByRole('option', { name: 'Geist', exact: true }).first().click();

    await expect.poll(async () => await previewStyle(page)).toContain("--typeset-font-heading: 'Geist Variable'");
    await expect.poll(() => page.url()).not.toContain('heading=');
  });

  test('undo walks back the last choice', async ({ page }) => {
    await choose(page, 'Size', '18px');
    await expect.poll(async () => await previewStyle(page)).toContain('--typeset-size: 18px');

    await page.getByRole('button', { name: 'Menu' }).click();
    await page.getByRole('menuitem', { name: /Undo/ }).click();

    await expect.poll(async () => await previewStyle(page)).toContain('--typeset-size: 15px');
  });

  test('shuffle keeps the mono slot on a mono face', async ({ page }) => {
    await page.getByRole('button', { name: 'Shuffle' }).click();

    await expect.poll(async () => await previewStyle(page)).toMatch(/--typeset-font-mono: '[^']*Mono[^']*', monospace/);
  });

  // The list lives in the CDK overlay at the end of the body: without moving focus
  // into it, a keyboard user never reaches the options.
  test('the keyboard reaches the options and can pick one', async ({ page }) => {
    await control(page, 'Size').getByRole('button').first().focus();
    await page.keyboard.press('Enter');

    await expect(page.getByRole('option', { name: '15px', exact: true })).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    await expect.poll(async () => await previewStyle(page)).toContain('--typeset-size: 16px');
  });

  test('the code panel hands out the preset for the current choices', async ({ page }) => {
    await choose(page, 'Size', '18px');

    const panel = page.locator('app-typeset-code-panel');
    await expect(panel).toContainText('--typeset-size: 18px;');
    await expect(panel).toContainText('npx zard-cli@latest add typeset');
  });

  test('the package manager select rewrites the install command', async ({ page }) => {
    const panel = page.locator('app-typeset-code-panel');
    await expect(panel).toContainText('npm install');

    await panel.getByRole('combobox').click();
    await page.locator('[data-slot="select-content"] [role="option"]', { hasText: 'pnpm' }).first().click();

    await expect(panel).toContainText('pnpm add');
  });

  test('the prompt tab tells the agent to ask before applying the class', async ({ page }) => {
    await page.getByRole('tab', { name: 'Prompt' }).click();

    await expect(page.getByRole('tabpanel')).toContainText('Do not apply the class anywhere yet');
  });

  test('switching the sample changes what the preview renders', async ({ page }) => {
    await page.getByRole('button', { name: 'Elements', exact: true }).click();

    await expect(page.locator('app-typeset-preview .typeset table').first()).toBeVisible();
    await expect.poll(() => page.url()).toContain('item=elements');
  });

  test('the standalone preview carries the same preset', async ({ page }) => {
    await page.goto('/typeset/preview?body=lora&scale=18');
    await page.waitForLoadState('networkidle');

    const style = (await page.locator('app-typeset-surface .typeset').getAttribute('style')) ?? '';
    expect(style).toContain('--typeset-size: 18px');
    expect(style).toContain('Lora Variable');

    // The route exists to read the prose alone: no header, no footer.
    await expect(page.locator('z-header')).toHaveCount(0);
  });

  test('has no accessibility violations', async ({ page }) => {
    await checkA11y(page);
  });
});
