import { test, expect, type Page } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';

/** The `style` the preview container carries, which is the builder's output. */
async function previewStyle(page: Page): Promise<string> {
  return (await page.locator('z-typeset-preview .typeset').getAttribute('style')) ?? '';
}

/** One row of the panel by its label, so `Body` cannot match another row. */
function control(page: Page, label: string) {
  return page.locator(`z-typeset-control[data-control="${label}"]`);
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
            .locator('z-typeset-preview .typeset p')
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

    const panel = page.locator('z-typeset-code-panel');
    await expect(panel).toContainText('--typeset-size: 18px;');
    await expect(panel).toContainText('npx zard-cli@latest add typeset');
  });

  test('the package manager select rewrites the install command', async ({ page }) => {
    const panel = page.locator('z-typeset-code-panel');
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

    await expect(page.locator('z-typeset-preview .typeset table').first()).toBeVisible();
    await expect.poll(() => page.url()).toContain('item=elements');
  });

  test('the standalone preview carries the same preset', async ({ page }) => {
    await page.goto('/typeset/preview?body=lora&scale=18');
    await page.waitForLoadState('networkidle');

    const style = (await page.locator('z-typeset-surface .typeset').getAttribute('style')) ?? '';
    expect(style).toContain('--typeset-size: 18px');
    expect(style).toContain('Lora Variable');

    // The route exists to read the prose alone: no header, no footer.
    await expect(page.locator('z-header')).toHaveCount(0);
  });

  test('has no accessibility violations', async ({ page }) => {
    await checkA11y(page);
  });
});

/**
 * Task #57: the builder's three-panel row has 27 `md:` rules against 3 `xl:`
 * and 2 `2xl:`, so 768–1280px laptops used to inherit the desktop column
 * unchanged, and the code panel's arrival at `xl` (1280px) squeezed the
 * preview at exactly the width most laptops sit at. The single Playwright
 * project here never called `setViewportSize`, so the whole band went
 * unverified — this suite is the regression net for that gap.
 *
 * Widest measure (90ch) and widest scale (18px) are used throughout: they
 * are the combination the arithmetic in the task card showed was tightest,
 * and the one a narrower fix (correct at the default preset only) could
 * still miss.
 */
test.describe('Typeset builder responsive layout', () => {
  const WIDTHS = [375, 768, 1024, 1280, 1366, 1920] as const;

  for (const width of WIDTHS) {
    test(`no horizontal overflow or clipped prose at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/typeset?measure=90&scale=18');
      await page.waitForLoadState('networkidle');

      // No horizontal page scroll: the section around the row clips instead of
      // scrolling, so a layout that overflows it hides content rather than
      // announcing itself here — the bounding-box checks below catch that case.
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);

      // The regression itself: without `min-w-0` on the preview, the row overflows
      // and the fixed-width customizer — first in DOM order, so flex-row-reverse
      // places it left, on the outside of the reversed flow — gets pushed off the
      // left edge and clipped by the section's `overflow-hidden`. A clipped
      // Shuffle button is the cheapest visible proof: its box must stay fully
      // inside the viewport, not just its right edge.
      const shuffle = page.getByRole('button', { name: 'Shuffle' });
      await expect(shuffle).toBeVisible();
      const shuffleBox = await shuffle.boundingBox();
      if (shuffleBox === null) throw new Error('Shuffle button has no layout box');
      expect(shuffleBox.x).toBeGreaterThanOrEqual(-0.5);
      expect(shuffleBox.x + shuffleBox.width).toBeLessThanOrEqual(width + 0.5);

      // The preview's own prose: never silently clipped. Either it fits its
      // scroll container, or that container is a real `overflow-x-auto` scroller
      // (never `overflow-hidden`) — so the reader can always reach the rest of it.
      const prose = await page.evaluate(() => {
        const card = document.querySelector('z-typeset-preview .bg-background');
        const scroller = card?.querySelector(':scope > div');
        if (!scroller) return null;
        const style = getComputedStyle(scroller);
        return {
          scrollWidth: scroller.scrollWidth,
          clientWidth: scroller.clientWidth,
          overflowX: style.overflowX,
        };
      });
      if (prose === null) throw new Error('Preview scroll container not found');
      const fitsOrScrolls = prose.scrollWidth <= prose.clientWidth + 1 || prose.overflowX !== 'hidden';
      expect(fitsOrScrolls).toBe(true);
    });
  }

  test('the customizer becomes a strip, not a column, between md and lg', async ({ page }) => {
    // 900px: past the old `md` (768px) two-column threshold, short of the new
    // `lg` (1024px) one. The 768–1023px band this task added deliberate
    // treatment for — it must still be the phone's full-width strip.
    await page.setViewportSize({ width: 900, height: 800 });
    await page.goto('/typeset');
    await page.waitForLoadState('networkidle');

    const row = page.locator('z-typeset-customizer').locator('xpath=..');
    await expect(row).toHaveCSS('flex-direction', 'column');

    const customizerWidth = await page
      .locator('z-typeset-customizer')
      .evaluate(el => Math.round(el.getBoundingClientRect().width));
    // A 192px column (the old `md:w-48`) would fail this; the strip spans the row.
    expect(customizerWidth).toBeGreaterThan(700);
  });

  test('the customizer is a column, not a strip, at 1024px and up', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto('/typeset');
    await page.waitForLoadState('networkidle');

    const row = page.locator('z-typeset-customizer').locator('xpath=..');
    await expect(row).toHaveCSS('flex-direction', 'row-reverse');

    const customizerWidth = await page
      .locator('z-typeset-customizer')
      .evaluate(el => Math.round(el.getBoundingClientRect().width));
    expect(customizerWidth).toBeLessThan(250);
  });

  test('the standalone preview route has no horizontal overflow at the widest preset', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/typeset/preview?measure=90&scale=18');
    await page.waitForLoadState('networkidle');

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
  });

  test('the docs page has no horizontal overflow at a mid-size width', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 800 });
    await page.goto('/docs/typeset');
    await page.waitForLoadState('networkidle');

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
  });
});
