import { test, expect, type Frame, type Page } from '@playwright/test';

import { checkA11y } from './utils/axe-helper';

/** The preview document the builder hosts. */
function previewFrame(page: Page): Frame {
  const frame = page.frames().find(candidate => candidate.url().includes('/create/preview/'));
  if (!frame) throw new Error('The preview iframe is not on the page');
  return frame;
}

const bodyClasses = async (page: Page): Promise<string> =>
  (await previewFrame(page).evaluate(() => document.body.className)) ?? '';

const presetOf = (page: Page): string => new URL(page.url()).searchParams.get('preset') ?? '';

/** Waits for the preview app to boot and apply its first design. */
async function ready(page: Page): Promise<void> {
  await expect.poll(async () => await bodyClasses(page).catch(() => ''), { timeout: 30_000 }).toContain('style-');
}

function picker(page: Page, label: string) {
  return page.locator(`z-create-picker[data-picker="${label}"]`);
}

/** Opens a row's menu and returns its items. */
async function open(page: Page, label: string) {
  await picker(page, label).locator('button[zpopover]').click();
  return page.getByRole('menu', { name: label });
}

async function choose(page: Page, label: string, option: string): Promise<void> {
  const menu = await open(page, label);
  await menu.getByRole('menuitemradio', { name: option, exact: true }).click();
  await page.keyboard.press('Escape');
}

test.describe('Create builder', () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    // The welcome dialog is a first-visit thing; it has its own test.
    await page.addInitScript(() => localStorage.setItem('zard-create-welcome', 'true'));
    await page.goto('/create');
    await ready(page);
  });

  test('renders the customizer and the preview, and canonicalizes the URL', async ({ page }) => {
    await expect(page.getByRole('region', { name: 'Customize the design' })).toBeVisible();
    await expect(page.locator('iframe[title="Preview"]')).toBeVisible();
    await expect.poll(() => presetOf(page)).toMatch(/^Z/);
  });

  test('a picker change reaches the iframe without reloading it and lands in the URL', async ({ page }) => {
    await previewFrame(page).evaluate(() => ((window as unknown as { __kept: boolean }).__kept = true));
    const before = presetOf(page);

    await choose(page, 'Style', 'Lyra');

    await expect.poll(async () => await bodyClasses(page)).toContain('style-lyra');
    expect(presetOf(page)).not.toBe(before);
    // Lyra forces square corners, so the radius row is disabled.
    await expect(picker(page, 'Radius').locator('button[zpopover]')).toBeDisabled();
    expect(await previewFrame(page).evaluate(() => (window as unknown as { __kept?: boolean }).__kept)).toBe(true);
  });

  test('hovering previews an option without touching the URL, and leaving reverts it', async ({ page }) => {
    const before = page.url();
    const menu = await open(page, 'Style');

    await menu.getByRole('menuitemradio', { name: 'Maia', exact: true }).hover();
    await expect.poll(async () => await bodyClasses(page), { timeout: 15_000 }).toContain('style-maia');
    expect(page.url()).toBe(before);

    await page.keyboard.press('Escape');
    await expect.poll(async () => await bodyClasses(page)).toContain('style-nova');
    expect(page.url()).toBe(before);
  });

  test('the font reaches the iframe', async ({ page }) => {
    await choose(page, 'Font', 'Lora');

    await expect
      .poll(
        async () =>
          await previewFrame(page).evaluate(() => document.documentElement.style.getPropertyValue('--font-sans')),
      )
      .toContain('Lora');
  });

  test('the constraints grey out what the design cannot hold', async ({ page }) => {
    await choose(page, 'Style', 'Rhea');
    const radius = await open(page, 'Radius');
    await expect(radius.getByRole('menuitemradio', { name: 'Large', exact: true })).toBeDisabled();
    await page.keyboard.press('Escape');

    await choose(page, 'Menu', 'Translucent');
    const accent = await open(page, 'Menu Accent');
    await expect(accent.getByRole('menuitemradio', { name: 'Bold', exact: true })).toBeDisabled();
  });

  test('a heading equal to the body font reads Inherit', async ({ page }) => {
    await choose(page, 'Heading', 'Lora');
    await expect(picker(page, 'Heading')).toContainText('Lora');

    // Picking the body font as the heading normalizes back to "inherit".
    const menu = await open(page, 'Heading');
    await menu.locator('[role="menuitemradio"][data-value="inter"]').click();
    await expect(picker(page, 'Heading')).toContainText('Inter');
    expect(new URL(page.url()).searchParams.get('preset')).toBe('Z0');
  });

  test('R shuffles, with focus on the page and inside the iframe', async ({ page }) => {
    const first = presetOf(page);
    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await page.keyboard.press('r');
    await expect.poll(() => presetOf(page)).not.toBe(first);

    const second = presetOf(page);
    await previewFrame(page)
      .locator('body')
      .click({ position: { x: 5, y: 5 } });
    await page.keyboard.press('r');
    await expect.poll(() => presetOf(page)).not.toBe(second);
  });

  test('undo and redo walk the history, from the iframe too', async ({ page }) => {
    const first = presetOf(page);
    await choose(page, 'Style', 'Maia');
    const second = presetOf(page);

    await previewFrame(page)
      .locator('body')
      .click({ position: { x: 5, y: 5 } });
    await page.keyboard.press('Control+z');
    await expect.poll(() => presetOf(page)).toBe(first);

    await page.keyboard.press('Control+Shift+z');
    await expect.poll(() => presetOf(page)).toBe(second);
  });

  test('D toggles the dark mode of the preview', async ({ page }) => {
    const wasDark = await previewFrame(page).evaluate(() => document.documentElement.classList.contains('dark'));
    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await page.keyboard.press('d');

    await expect
      .poll(async () => await previewFrame(page).evaluate(() => document.documentElement.classList.contains('dark')))
      .toBe(!wasDark);
  });

  test('Reset asks first and restores the curated design of the style', async ({ page }) => {
    await choose(page, 'Font', 'Lora');
    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await page.keyboard.press('Shift+r');

    const dialog = page.getByRole('alertdialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Reset' }).click();

    await expect(picker(page, 'Font')).toContainText('Inter');
  });

  test('Open Preset loads a pasted code, with or without the flag', async ({ page }) => {
    await choose(page, 'Style', 'Sera');
    const target = presetOf(page);
    await choose(page, 'Style', 'Vega');
    expect(presetOf(page)).not.toBe(target);

    await page.getByRole('button', { name: 'Open Preset' }).click();
    const dialog = page.getByRole('dialog', { name: 'Open Preset' });
    await dialog.getByRole('textbox').fill(`--preset ${target}`);
    await dialog.getByRole('button', { name: 'Open', exact: true }).click();

    await expect.poll(() => presetOf(page)).toBe(target);
  });

  test('Navigate previews one component alone and reloads the iframe', async ({ page }) => {
    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await page.keyboard.press('Control+p');

    await page.getByRole('combobox', { name: 'Search commands' }).fill('dropdown');
    await page.getByRole('option', { name: 'Dropdown', exact: true }).click();

    await expect.poll(() => new URL(page.url()).searchParams.get('item')).toBe('component:dropdown');
    await expect.poll(() => previewFrame(page).url()).toContain('/create/preview/component');
  });

  test('switching canvases changes the iframe', async ({ page }) => {
    await page.getByRole('button', { name: '02', exact: true }).click();

    await expect.poll(() => new URL(page.url()).searchParams.get('item')).toBe('preview-02');
    await expect.poll(() => previewFrame(page).url()).toContain('preview-02');
  });

  test('Copy puts --preset <code> on the clipboard and says Copied', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    // The button's name flips between the command and "Copied", so it is found by its place, not its name.
    const button = page.getByTestId('copy-preset');
    const label = (await button.innerText()).trim();

    await button.click();

    await expect(button).toHaveText('Copied', { timeout: 10_000 });
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(label);
    await expect(button).toHaveText(label, { timeout: 10_000 });
  });

  test.describe('URL', () => {
    test('individual params are folded into the preset', async ({ page }) => {
      await page.goto('/create?style=lyra&baseColor=zinc');
      await expect.poll(() => new URL(page.url()).searchParams.has('style')).toBe(false);

      const url = new URL(page.url());
      expect([...url.searchParams.keys()]).toEqual(['preset']);
      await ready(page);
      await expect.poll(async () => await bodyClasses(page)).toContain('style-lyra');
    });

    test('a foreign or malformed preset falls back to the default design', async ({ page }) => {
      for (const preset of ['b2D0wqNxT', 'zzz', '']) {
        await page.goto(`/create?preset=${preset}`);
        await expect.poll(() => presetOf(page)).toMatch(/^Z/);
        await ready(page);
        await expect.poll(async () => await bodyClasses(page)).toContain('style-nova');
      }
    });

    test('a pasted URL reproduces the design and back/forward walk the changes', async ({ page }) => {
      await choose(page, 'Style', 'Luma');
      const luma = page.url();
      await choose(page, 'Font', 'Lora');

      await page.goBack();
      await expect.poll(() => page.url()).toBe(luma);
      await expect(picker(page, 'Font')).toContainText('Inter');

      await page.goto(luma);
      await ready(page);
      await expect.poll(async () => await bodyClasses(page)).toContain('style-luma');
    });
  });

  test.describe('Get Code', () => {
    test('prints the command for each template, switch and package manager, and remembers the manager', async ({
      page,
    }) => {
      await page.getByRole('button', { name: 'Get Code' }).first().click();
      const dialog = page.getByRole('dialog', { name: 'Get Code' });
      const command = dialog.getByTestId('command').first();
      const preset = presetOf(page);

      await expect(command).toHaveText(`npx zard-cli@latest create --preset ${preset} --template angular`);

      await dialog.locator('[data-template="nx"]').click();
      await dialog.getByRole('switch', { name: 'Use pointer on buttons' }).click();
      await dialog.getByRole('switch', { name: 'Enable RTL support' }).click();
      await expect(command).toHaveText(`npx zard-cli@latest create --preset ${preset} --template nx --pointer --rtl`);

      await dialog.locator('[data-manager="pnpm"]').first().click();
      await expect(command).toContainText('pnpm dlx zard-cli@latest create');
      await dialog.locator('[data-manager="yarn"]').first().click();
      await expect(command).toContainText('yarn dlx zard-cli@latest create');
      await dialog.locator('[data-manager="bun"]').first().click();
      await expect(command).toContainText('bunx zard-cli@latest create');

      await page.reload();
      await ready(page);
      await page.getByRole('button', { name: 'Get Code' }).first().click();
      await expect(page.getByRole('dialog', { name: 'Get Code' }).getByTestId('command').first()).toContainText(
        'bunx zard-cli@latest',
      );
    });

    test('existing project: full preset, theme only, fonts only', async ({ page }) => {
      await page.getByRole('button', { name: 'Get Code' }).first().click();
      const dialog = page.getByRole('dialog', { name: 'Get Code' });
      await dialog.getByRole('tab', { name: 'Existing Project' }).click();
      const preset = presetOf(page);
      const command = dialog.locator('[data-tab="existing-project"] [data-testid="command"]');

      await expect(command).toHaveText(`npx zard-cli@latest init --preset ${preset}`);
      await dialog.locator('[data-scope="theme"]').click();
      await expect(command).toHaveText(`npx zard-cli@latest apply --preset ${preset} --only theme`);
      await dialog.locator('[data-scope="font"]').click();
      await expect(command).toHaveText(`npx zard-cli@latest apply --preset ${preset} --only font`);
    });

    test('theme tab shows the :root and .dark blocks', async ({ page }) => {
      await page.getByRole('button', { name: 'Get Code' }).first().click();
      const dialog = page.getByRole('dialog', { name: 'Get Code' });
      await dialog.getByRole('tab', { name: 'Theme' }).click();

      const css = dialog.getByTestId('theme-css');
      await expect(css).toContainText(':root {');
      await expect(css).toContainText('.dark {');
      await expect(css).toContainText('--primary:');
    });
  });

  test('has no accessibility violations in the customizer', async ({ page }) => {
    // `scrollable-region-focusable` is the horizontally scrolling row of cards on small screens.
    await checkA11y(page, 'z-create-customizer', ['scrollable-region-focusable']);
  });

  test('an open picker has no accessibility violations', async ({ page }) => {
    await open(page, 'Font');
    await checkA11y(page, '.cdk-overlay-container');
  });
});

test.describe('Create builder, first visit', () => {
  test('shows the welcome dialog once', async ({ page }) => {
    await page.goto('/create');

    const welcome = page.getByRole('dialog');
    await expect(welcome.getByRole('button', { name: 'Get Started' })).toBeVisible();
    await welcome.getByRole('button', { name: 'Get Started' }).click();

    await page.reload();
    await ready(page);
    await expect(page.getByRole('button', { name: 'Get Started' })).toHaveCount(0);
  });
});

test.describe('Create builder, phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('stacks the preview over a horizontal row of cards, with no Get Code and no overflow', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('zard-create-welcome', 'true'));
    await page.goto('/create');
    await ready(page);

    await expect(page.getByRole('button', { name: 'Get Code' })).toBeHidden();

    const preview = await page.locator('z-create-preview').boundingBox();
    const row = await picker(page, 'Style').boundingBox();
    expect(preview && row && preview.y < row.y).toBe(true);
    expect(row?.width).toBeCloseTo(144, -1);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('menus open above and Open Preset is a drawer', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('zard-create-welcome', 'true'));
    await page.goto('/create');
    await ready(page);

    const menu = await open(page, 'Style');
    const trigger = await picker(page, 'Style').boundingBox();
    const box = await menu.boundingBox();
    expect(trigger && box && box.y + box.height <= trigger.y + 1).toBe(true);
    await page.keyboard.press('Escape');

    await page.getByRole('button', { name: 'Open', exact: true }).click();
    await expect(page.locator('z-drawer-panel, [data-slot="drawer-content"]').first()).toBeVisible();
  });
});
