import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';

test.describe('Typeset documentation page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/docs/typeset');
    await page.waitForLoadState('networkidle');
  });

  test('renders the page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Typeset', level: 1 })).toBeVisible();
  });

  test('styles its own prose with typeset', async ({ page }) => {
    const container = page.locator('.typeset.typeset-docs').first();
    await expect(container).toBeVisible();

    // A prova de que a folha de estilo está ligada: o container resolve as
    // variáveis do preset, e não os defaults do `.typeset`.
    const rhythm = await container.evaluate(el => {
      const style = getComputedStyle(el);
      return {
        size: style.getPropertyValue('--typeset-size').trim(),
        leading: style.getPropertyValue('--typeset-leading').trim(),
      };
    });

    expect(rhythm.size).toBe('16px');
    expect(rhythm.leading).toBe('1.6');
  });

  test('derives the paragraph rhythm from the preset', async ({ page }) => {
    const paragraph = page.locator('.typeset.typeset-docs p').first();

    const line = await paragraph.evaluate(el => getComputedStyle(el).lineHeight);

    // 16px × 1.6. Se o typeset não tivesse alcançado o parágrafo, viria do tema.
    expect(line).toBe('25.6px');
  });

  test('lets a utility class win with no !important', async ({ page }) => {
    const heading = page.locator('section#principles h2').first();

    // O typeset derivaria 20px aqui; o utilitário `text-2xl` da página vence,
    // que é o contrato de especificidade zero que a página documenta.
    await expect(heading).toHaveCSS('font-size', '24px');
  });

  test('scroll spy follows the reader down the page', async ({ page }) => {
    // A entrada ativa é marcada pelo peso, não por um href: as âncoras da barra
    // lateral rolam por handler de clique. O fundo da página é o único ponto
    // determinístico — a diretiva elege a última seção acima do limiar, então
    // uma seção do meio depende de onde exatamente o scroll parou.
    const sidebar = page.getByRole('complementary');
    const last = sidebar.getByText('Prior art', { exact: true });

    await expect(last).not.toHaveClass(/font-medium/);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(last).toHaveClass(/font-medium/);
  });

  test('links to the builder', async ({ page }) => {
    const link = page.getByRole('link', { name: 'typeset builder' });
    await expect(link).toHaveAttribute('href', '/typeset');
  });

  test('has no accessibility violations in the overview', async ({ page }) => {
    await checkA11y(page, '#overview');
  });
});
