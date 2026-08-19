import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';

/** O `style` que o container da prévia carrega, que é a saída do builder. */
async function previewStyle(page: import('@playwright/test').Page): Promise<string> {
  return (await page.locator('app-typeset-preview .typeset').getAttribute('style')) ?? '';
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
    await page.getByRole('radio', { name: '18', exact: true }).click();

    await expect.poll(async () => await previewStyle(page)).toContain('--typeset-size: 18px');
  });

  test('changing a control puts it in the URL', async ({ page }) => {
    await page.getByRole('radio', { name: 'Loose', exact: true }).click();

    await expect.poll(() => page.url()).toContain('leading=1.9');
  });

  test('a control back on its default leaves the URL', async ({ page }) => {
    await page.getByRole('radio', { name: '18', exact: true }).click();
    await expect.poll(() => page.url()).toContain('scale=18');

    await page.getByRole('radio', { name: '15', exact: true }).click();
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

  // Query param é entrada não confiável: o valor inválido não pode chegar ao
  // binding de `style`, tem de cair no default.
  test('falls back to the default for an unknown value in the URL', async ({ page }) => {
    await page.goto('/typeset?body=comic-sans&scale=999');
    await page.waitForLoadState('networkidle');

    const style = await previewStyle(page);
    expect(style).toContain('--typeset-size: 15px');
    expect(style).toContain('Geist Variable');
  });

  test('the mono picker offers only mono faces', async ({ page }) => {
    await page.locator('app-font-picker').nth(2).getByRole('combobox').click();

    const options = page.locator('[data-slot="select-content"] [role="option"]');
    await expect(options.first()).toBeVisible();

    for (const label of await options.allTextContents()) {
      expect(label).toMatch(/Mono/);
    }
  });

  test('picking a font changes the family the preview renders', async ({ page }) => {
    await page.locator('app-font-picker').nth(1).getByRole('combobox').click();
    await page.locator('[data-slot="select-content"] [role="option"]', { hasText: 'Lora' }).first().click();

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

  test('randomize keeps the mono slot on a mono face', async ({ page }) => {
    await page.getByRole('button', { name: 'Randomize' }).click();

    await expect.poll(async () => await previewStyle(page)).toMatch(/--typeset-font-mono: '[^']*Mono[^']*', monospace/);
  });

  test('the code panel hands out the preset for the current choices', async ({ page }) => {
    await page.getByRole('radio', { name: '18', exact: true }).click();
    await page.getByRole('button', { name: 'Get code' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('--typeset-size: 18px;');
    await expect(dialog).toContainText('npx zard-cli@latest add typeset');
  });

  test('the prompt tab tells the agent to ask before applying the class', async ({ page }) => {
    await page.getByRole('button', { name: 'Get code' }).click();

    // Sem escopar no diálogo: o overlay do CDK monta o conteúdo num portal que
    // não é descendente do elemento com `role="dialog"`.
    await page.getByRole('tab', { name: 'Prompt' }).click();

    await expect(page.getByRole('tabpanel')).toContainText('Do not apply the class anywhere yet');
  });

  test('switching the fixture changes what the preview renders', async ({ page }) => {
    await page.getByRole('button', { name: 'Elements', exact: true }).click();

    await expect(page.locator('app-typeset-preview .typeset table').first()).toBeVisible();
    await expect.poll(() => page.url()).toContain('item=elements');
  });

  test('has no accessibility violations', async ({ page }) => {
    await checkA11y(page);
  });
});
