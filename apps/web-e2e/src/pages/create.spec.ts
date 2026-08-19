import { expect, test } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';

const DEFAULT_CODE = 'a000301e';

test.describe('the create page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/create');
  });

  test('opens on the default preset', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Menu' })).toBeVisible();
    await expect(page.getByLabel('Copy the preset code')).toContainText(DEFAULT_CODE);
  });

  /**
   * As medidas da referência. Elas não são decoração: o painel dimensiona a
   * página inteira, e o canvas ocupa o que sobra dele.
   */
  test('keeps the panel at 224px and the control cards at 200 × 52', async ({ page }) => {
    const panel = page.locator('z-create-menu > div');
    await expect(panel).toHaveCSS('width', '224px');
    await expect(panel).toHaveCSS('border-radius', '18px');

    const card = page.locator('z-create-control-card button').first();
    await expect(card).toHaveCSS('width', '200px');
    await expect(card).toHaveCSS('height', '52px');
    await expect(card).toHaveCSS('border-radius', '10px');
  });

  test('lists every control, in panel order', async ({ page }) => {
    const labels = await page.locator('z-create-control-card').allInnerTexts();

    expect(labels.join(' ')).toContain('Base Color');
    expect(labels.join(' ')).toContain('Theme');
    expect(labels.join(' ')).toContain('Chart Color');
    expect(labels.join(' ')).toContain('Icon Library');
    expect(labels.join(' ')).toContain('Radius');
    expect(labels.join(' ')).toContain('Dark Mode');
    expect(labels.join(' ')).toContain('RTL');
  });

  test('changes the preview and the code when a control changes', async ({ page }) => {
    const canvas = page.locator('z-create-canvas > div').first();
    const before = await canvas.getAttribute('style');

    await page.locator('z-create-control-card button').first().click();
    await page.getByRole('option', { name: 'Slate' }).click();

    await expect(canvas).not.toHaveAttribute('style', before ?? '');
    await expect(page.getByLabel('Copy the preset code')).not.toContainText(DEFAULT_CODE);
    await expect(page).toHaveURL(/\?preset=/);
  });

  test('closes the dropdown on Escape and on a click outside', async ({ page }) => {
    await page.locator('z-create-control-card button').first().click();
    await expect(page.getByRole('listbox')).toBeVisible();

    await page.keyboard.press('Escape');
    await page.locator('z-create-canvas').click({ position: { x: 400, y: 300 } });
    await expect(page.getByRole('listbox')).toBeHidden();
  });

  test('pages the canvas between two compositions', async ({ page }) => {
    await expect(page.getByLabel('Canvas page 1')).toHaveAttribute('aria-current', 'true');

    await page.getByLabel('Canvas page 2').click();
    await expect(page.getByLabel('Canvas page 2')).toHaveAttribute('aria-current', 'true');
  });

  test('gives the command the CLI actually accepts', async ({ page }) => {
    await page.getByRole('button', { name: 'Get Code' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('pre')).toContainText(`create my-app --template angular --preset ${DEFAULT_CODE}`);

    await dialog.getByRole('button', { name: 'Existing Project' }).click();
    await expect(dialog.locator('pre')).toContainText(`apply ${DEFAULT_CODE}`);

    await dialog.getByRole('button', { name: 'Theme only' }).click();
    await expect(dialog.locator('pre')).toContainText('--only theme');
  });

  /** Typeset está fora do escopo, e a aba não deve existir. */
  test('offers no fonts tab', async ({ page }) => {
    await page.getByRole('button', { name: 'Get Code' }).click();

    await expect(page.getByRole('button', { name: /fonts/i })).toHaveCount(0);
  });

  test('shows the CSS the CLI would write', async ({ page }) => {
    await page.getByRole('button', { name: 'Get Code' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Theme', exact: true }).click();

    await expect(page.getByRole('dialog').locator('code')).toContainText(':root {');
    await expect(page.getByRole('dialog').locator('code')).toContainText('--sidebar-ring:');
  });

  test('opens a shared link on the preset it names', async ({ page }) => {
    await page.goto('/create?preset=a4B0301t');

    await expect(page.locator('z-create-control-card').first()).toContainText('Slate');
  });

  /** Um código truncado numa mensagem não pode deixar a página em branco. */
  test('falls back to the default on a broken link, with a warning', async ({ page }) => {
    await page.goto('/create?preset=zzzz');

    await expect(page.getByLabel('Preset link notice')).toContainText('default');
    await expect(page.getByLabel('Copy the preset code')).toContainText(DEFAULT_CODE);
  });

  test('turns the panel into a sheet on a narrow screen', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    await expect(page.locator('z-create-menu')).toBeHidden();

    await page.getByRole('button', { name: 'Customise' }).click();
    await expect(page.locator('z-create-menu')).toBeVisible();
  });

  /**
   * O escopo é o que esta página acrescenta: o painel e o dialog.
   *
   * O canvas fica de fora de propósito. Ele mostra os blocos da biblioteca, e as
   * violações que aparecem ali — `aria-orientation` num `z-button-group`, um
   * botão de ícone sem nome, o par muted/muted-foreground — são exatamente as
   * mesmas que a home já tem, porque são os mesmos componentes. Cobri-las aqui
   * transformaria este teste num alarme para um problema que não é desta página
   * e que se conserta em `libs/zard`.
   */
  test('has no accessibility violations in the panel', async ({ page }) => {
    await checkA11y(page, 'z-create-menu');
  });

  test('has no accessibility violations in the dialog', async ({ page }) => {
    await page.getByRole('button', { name: 'Get Code' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await checkA11y(page, 'z-create-code-dialog');
  });
});
