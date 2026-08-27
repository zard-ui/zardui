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

    // The proof that the stylesheet is wired up: the container resolves the
    // preset's variables, not the defaults of `.typeset`.
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

    // 16px x 1.6. Had typeset not reached the paragraph, this would come from the theme.
    expect(line).toBe('25.6px');
  });

  test('lets a utility class win with no !important', async ({ page }) => {
    const heading = page.locator('section#principles h2').first();

    // Typeset would derive 20px here; the page's `text-2xl` utility wins, which
    // is the zero-specificity contract the page documents.
    await expect(heading).toHaveCSS('font-size', '24px');
  });

  test('scroll spy follows the reader down the page', async ({ page }) => {
    // The active entry is marked by weight, not by an href: the sidebar anchors
    // scroll through a click handler. The bottom of the page is the only
    // deterministic point — the directive elects the last section above the
    // threshold, so a middle section depends on exactly where the scroll came
    // to rest.
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
