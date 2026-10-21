import { test, expect, type Frame, type Page } from '@playwright/test';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

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

  test('hovering an option changes nothing; only a click applies it', async ({ page }) => {
    const before = page.url();
    const menu = await open(page, 'Style');

    const maia = menu.getByRole('menuitemradio', { name: 'Maia', exact: true });
    await maia.hover();
    await page.waitForTimeout(300);
    expect(await bodyClasses(page)).not.toContain('style-maia');
    expect(page.url()).toBe(before);

    await maia.click();
    await expect.poll(async () => await bodyClasses(page), { timeout: 15_000 }).toContain('style-maia');
    expect(page.url()).not.toBe(before);
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

  test('the heading font reaches the card titles', async ({ page }) => {
    await choose(page, 'Heading', 'Playfair Display');

    await expect
      .poll(
        async () =>
          await previewFrame(page).evaluate(
            () => getComputedStyle(document.querySelector('[data-slot="card-title"]') as Element).fontFamily,
          ),
      )
      .toContain('Playfair Display');
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

  test('Navigate previews one component alone, in the same iframe document', async ({ page }) => {
    await previewFrame(page).evaluate(() => ((window as unknown as { __kept: boolean }).__kept = true));
    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await page.keyboard.press('Control+p');

    await page.getByRole('combobox', { name: 'Search commands' }).fill('dropdown');
    await page.getByRole('option', { name: 'Dropdown Menu', exact: true }).click();

    await expect.poll(() => new URL(page.url()).searchParams.get('item')).toBe('component:dropdown-menu');
    await expect.poll(() => previewFrame(page).url()).toContain('/create/preview/component');
    await expect(
      previewFrame(page).locator('main[data-item="component:dropdown-menu"] [data-slot="example"]').first(),
    ).toBeVisible();
    expect(await previewFrame(page).evaluate(() => (window as unknown as { __kept?: boolean }).__kept)).toBe(true);
  });

  test('Navigate lists the overview once, as Preview, ahead of the components', async ({ page }) => {
    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await page.keyboard.press('Control+p');

    await expect(page.getByRole('option', { name: 'Preview', exact: true })).toHaveCount(1);
    await expect(page.getByRole('option', { name: /Overview/ })).toHaveCount(0);
  });

  test('Navigate lists each item once, flat, and follows the page theme', async ({ page }) => {
    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await page.keyboard.press('Control+p');

    const dialog = page.getByRole('dialog', { name: 'Navigate' });
    await expect(dialog.getByRole('option', { name: 'Sidebar 07', exact: true })).toHaveCount(1);
    await expect(dialog.locator('z-command-option-group')).toHaveCount(0);
    const labels = await dialog.getByRole('option').allTextContents();
    expect(new Set(labels).size).toBe(labels.length);
    expect(await dialog.evaluate(el => (el as HTMLElement).offsetWidth)).toBe(384);
    expect(await dialog.evaluate(el => el.closest('.dark') !== null)).toBe(
      await page.evaluate(() => document.documentElement.classList.contains('dark')),
    );
  });

  test('typing in Navigate right after it opens logs no error and Enter opens the item', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', message => message.type() === 'error' && errors.push(message.text()));
    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await page.keyboard.press('Control+p');
    await page.keyboard.type('dropdown');
    await page.keyboard.press('Enter');

    await expect.poll(() => new URL(page.url()).searchParams.get('item')).toBe('component:dropdown-menu');
    expect(errors.filter(text => text.includes('NG0950'))).toEqual([]);
  });

  test('Reset is a small dialog that follows the page theme', async ({ page }) => {
    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await page.keyboard.press('Shift+r');

    const dialog = page.getByRole('alertdialog');
    await expect(dialog).toBeVisible();
    await expect.poll(async () => (await dialog.boundingBox())?.width).toBeCloseTo(320, 0);
    expect(await dialog.evaluate(el => el.closest('.dark') !== null)).toBe(
      await page.evaluate(() => document.documentElement.classList.contains('dark')),
    );
  });

  test('Ctrl+P does not stack Navigate over another dialog', async ({ page }) => {
    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await page.keyboard.press('o');
    await expect(page.getByRole('dialog', { name: 'Open Preset' })).toBeVisible();
    await page.keyboard.press('Control+p');

    await expect(page.getByRole('dialog', { name: 'Navigate' })).toHaveCount(0);
  });

  test('Open Preset focuses the field and enables Open only for a valid code', async ({ page }) => {
    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await page.keyboard.press('o');
    const dialog = page.getByRole('dialog', { name: 'Open Preset' });
    const field = dialog.getByRole('textbox');
    const open = dialog.getByRole('button', { name: 'Open', exact: true });

    await expect(field).toBeFocused();
    await expect(open).toBeDisabled();
    await field.fill('zzz');
    await expect(open).toBeDisabled();
    await field.fill('--preset Z0');
    await expect(open).toBeEnabled();
  });

  test('switching canvases swaps the content without reloading the iframe', async ({ page }) => {
    await previewFrame(page).evaluate(() => ((window as unknown as { __kept: boolean }).__kept = true));
    await page.getByRole('button', { name: '02', exact: true }).click();

    await expect.poll(() => new URL(page.url()).searchParams.get('item')).toBe('preview-02');
    await expect.poll(() => previewFrame(page).url()).toContain('preview-02');
    await expect(previewFrame(page).locator('[data-canvas="preview-02"]')).toBeVisible();
    expect(await previewFrame(page).evaluate(() => (window as unknown as { __kept?: boolean }).__kept)).toBe(true);
  });

  test('the preview scrolls in one container, on both axes', async ({ page }) => {
    const overflow = await previewFrame(page).evaluate(() => ({
      html: getComputedStyle(document.documentElement).overflow,
      body: getComputedStyle(document.body).overflow,
      main: getComputedStyle(document.querySelector('main[data-item]') as Element).overflow,
    }));
    expect(overflow).toEqual({ html: 'hidden', body: 'hidden', main: 'auto' });
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
    test('sits 64px from the top with pill tabs, separators and one scrolling command line', async ({ page }) => {
      await page.getByRole('button', { name: 'Get Code' }).first().click();
      const dialog = page.getByRole('dialog', { name: 'Get Code' });
      await expect(dialog).toBeVisible();

      // Polled: the panel scales in for a moment when it opens.
      await expect.poll(async () => (await dialog.boundingBox())?.y).toBe(64);
      await expect.poll(async () => (await dialog.boundingBox())?.width).toBe(448);

      // Pill tabs in the header, not a title.
      await expect(dialog.getByRole('tablist', { name: 'Project type' }).getByRole('tab')).toHaveText([
        'New Project',
        'Existing Project',
        'Theme',
      ]);
      await expect(dialog.getByRole('tab', { name: 'New Project' })).toHaveAttribute('aria-selected', 'true');
      expect(await dialog.locator('z-field-separator').count()).toBeGreaterThan(0);
      await expect(dialog.locator('[data-template] svg')).toHaveCount(3);

      // The command is one line that scrolls sideways; it never breaks in the middle of a word.
      const code = dialog.getByTestId('command');
      await dialog.getByRole('switch', { name: 'Use pointer on buttons' }).click();
      await dialog.getByRole('switch', { name: 'Enable RTL support' }).click();
      expect(await code.evaluate(element => getComputedStyle(element).whiteSpace)).toBe('nowrap');
      expect(await code.evaluate(element => element.getBoundingClientRect().height)).toBeLessThan(30);

      // The position does not jump from tab to tab.
      for (const name of ['Existing Project', 'Theme', 'New Project']) {
        await dialog.getByRole('tab', { name }).click();
        await expect.poll(async () => (await dialog.boundingBox())?.y).toBe(64);
      }
    });

    test('prints the command for each template, switch and package manager, and remembers the manager', async ({
      page,
    }) => {
      await page.getByRole('button', { name: 'Get Code' }).first().click();
      const dialog = page.getByRole('dialog', { name: 'Get Code' });
      const command = dialog.getByTestId('command').first();
      const preset = presetOf(page);

      // The name is part of the command, so it runs without a single question.
      await expect(command).toHaveText(`npx zard-cli@latest create my-app --preset ${preset} --template angular`);

      await dialog.locator('[data-template="analog"]').click();
      await expect(command).toHaveText(`npx zard-cli@latest create my-app --preset ${preset} --template analog`);

      await dialog.locator('[data-template="nx"]').click();
      await dialog.getByRole('switch', { name: 'Use pointer on buttons' }).click();
      await dialog.getByRole('switch', { name: 'Enable RTL support' }).click();
      await expect(command).toHaveText(
        `npx zard-cli@latest create my-app --preset ${preset} --template nx --pointer --rtl`,
      );

      await dialog.locator('[data-manager="pnpm"]').first().click();
      await expect(command).toContainText('pnpm dlx zard-cli@latest create my-app');
      await dialog.locator('[data-manager="yarn"]').first().click();
      await expect(command).toContainText('yarn dlx zard-cli@latest create my-app');
      await dialog.locator('[data-manager="bun"]').first().click();
      await expect(command).toContainText('bunx zard-cli@latest create my-app');

      await page.reload();
      await ready(page);
      await page.getByRole('button', { name: 'Get Code' }).first().click();
      await expect(page.getByRole('dialog', { name: 'Get Code' }).getByTestId('command').first()).toContainText(
        'bunx zard-cli@latest',
      );
    });

    test('Copy Command and the icon button copy exactly the text shown', async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      await page.getByRole('button', { name: 'Get Code' }).first().click();
      const dialog = page.getByRole('dialog', { name: 'Get Code' });
      const command = dialog.getByTestId('command').first();
      await dialog.locator('[data-template="nx"]').click();
      await dialog.getByRole('switch', { name: 'Enable RTL support' }).click();
      await expect(command).toContainText('--template nx --rtl');
      const shown = (await command.innerText()).trim();
      expect(shown).toContain('create my-app --preset');

      await dialog.getByRole('button', { name: 'Copy Command', exact: true }).click();
      await expect(dialog.getByRole('button', { name: 'Copied' })).toBeVisible();
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(shown);

      await page.evaluate(() => navigator.clipboard.writeText(''));
      await dialog.getByRole('button', { name: 'Copy command', exact: true }).click();
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(shown);
    });

    test('the copied New Project command parses with no terminal and asks nothing', async ({ page }) => {
      const cli = resolve(process.cwd(), 'packages/cli/dist/index.js');
      test.skip(!existsSync(cli), 'build the CLI first: npm run build:cli');

      await page.getByRole('button', { name: 'Get Code' }).first().click();
      const dialog = page.getByRole('dialog', { name: 'Get Code' });
      await dialog.locator('[data-template="angular"]').click();
      await dialog.getByRole('switch', { name: 'Use pointer on buttons' }).click();
      await dialog.getByRole('switch', { name: 'Enable RTL support' }).click();
      await expect(dialog.getByTestId('command').first()).toContainText('--pointer --rtl');
      const shown = (await dialog.getByTestId('command').first().innerText()).trim();
      const args = shown.split(' ').slice(2); // drop `npx zard-cli@latest`

      // Run the real CLI with stdin ignored (no TTY) in a directory where `my-app` already exists: the CLI validates
      // the name, the preset, the template and the switches first, then refuses the taken name. A missing name would
      // have said so ("Missing project name"); a question would have hung.
      const cwd = mkdtempSync(join(tmpdir(), 'zard-e2e-'));
      mkdirSync(join(cwd, 'my-app'));
      try {
        const result = spawnSync(process.execPath, [cli, ...args], {
          cwd,
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'pipe'],
          timeout: 60_000,
          env: { ...process.env, CI: 'true' },
        });
        const output = `${result.stdout}${result.stderr}`;
        expect(output).toContain('"my-app" already exists');
        expect(output).not.toContain('Missing project name');
        expect(result.status).not.toBe(0);
      } finally {
        rmSync(cwd, { recursive: true, force: true });
      }
    });

    test('existing project: full preset, theme only, fonts only', async ({ page }) => {
      await page.getByRole('button', { name: 'Get Code' }).first().click();
      const dialog = page.getByRole('dialog', { name: 'Get Code' });
      await dialog.getByRole('tab', { name: 'Existing Project' }).click();
      const preset = presetOf(page);
      const command = dialog.locator('[data-tab="existing-project"] [data-testid="command"]');

      await expect(command).toHaveText(`npx zard-cli@latest init --preset ${preset} --yes`);
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

  test.describe('picker popups', () => {
    const focusedText = (page: Page): Promise<string> =>
      page.evaluate(() => document.activeElement?.textContent?.trim() ?? '');

    test('a click inside the preview closes an open popup', async ({ page }) => {
      await open(page, 'Style');
      await expect(page.getByRole('menu', { name: 'Style' })).toBeVisible();

      await previewFrame(page)
        .locator('body')
        .click({ position: { x: 500, y: 450 } });

      await expect(page.getByRole('menu', { name: 'Style' })).toHaveCount(0);
      await expect(picker(page, 'Style').locator('button[zpopover]')).toHaveAttribute('aria-expanded', 'false');
    });

    test('the Menu popup closes on a click inside the preview too', async ({ page }) => {
      await page.getByRole('button', { name: 'Menu', exact: true }).click();
      await expect(page.getByRole('menu', { name: 'Menu' })).toBeVisible();

      await previewFrame(page)
        .locator('body')
        .click({ position: { x: 500, y: 450 } });

      await expect(page.getByRole('menu', { name: 'Menu' })).toHaveCount(0);
    });

    test('opens 8px below the trigger, flat, announced as a menu, with nothing highlighted for a click', async ({
      page,
    }) => {
      const trigger = picker(page, 'Style').locator('button[zpopover]');
      await expect(trigger).toHaveAttribute('aria-haspopup', 'menu');

      const box = await trigger.boundingBox();
      expect(box).not.toBeNull();
      await open(page, 'Style');
      const panel = page.locator('.cdk-overlay-container z-popover');
      await expect(panel).toBeVisible();

      const { top, shadow, animation } = await panel.evaluate(element => {
        const style = getComputedStyle(element);
        return { top: element.getBoundingClientRect().top, shadow: style.boxShadow, animation: style.animationName };
      });
      expect(Math.round(top - (box?.y ?? 0))).toBe(8);
      // Only the ring: shadcn's popup casts no `shadow-md` (0 4px 6px -1px).
      expect(shadow).not.toContain('6px -1px');
      expect(animation).toBe('none');
      // A click leaves the focus on the menu itself, so no option shows as highlighted.
      await expect(page.getByRole('menu', { name: 'Style' })).toBeFocused();
    });

    test('the keyboard opens a popup on the checked option and moves with Home, End and type-ahead', async ({
      page,
    }) => {
      const trigger = picker(page, 'Font').locator('button[zpopover]');
      await trigger.focus();
      await page.keyboard.press('ArrowDown');

      const menu = page.getByRole('menu', { name: 'Font' });
      await expect(menu).toBeVisible();
      await expect(menu.locator('[aria-checked="true"]')).toBeFocused();

      await page.keyboard.press('End');
      const last = await focusedText(page);
      await page.keyboard.press('Home');
      const first = await focusedText(page);
      expect(first).not.toBe(last);
      expect(await menu.getByRole('menuitemradio').first().textContent()).toContain(first);

      await page.keyboard.type('m');
      expect((await focusedText(page)).toLowerCase().startsWith('m')).toBe(true);
    });

    test('Tab closes the popup and keeps the focus on its trigger', async ({ page }) => {
      const trigger = picker(page, 'Style').locator('button[zpopover]');
      await trigger.focus();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('menu', { name: 'Style' }).locator('[aria-checked="true"]')).toBeFocused();

      await page.keyboard.press('Tab');

      await expect(page.getByRole('menu', { name: 'Style' })).toHaveCount(0);
      await expect(trigger).toBeFocused();
    });

    test('R and D do not fire while a popup has focus', async ({ page }) => {
      const before = presetOf(page);
      const dark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
      const trigger = picker(page, 'Font').locator('button[zpopover]');
      await trigger.focus();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('menu', { name: 'Font' }).locator('[aria-checked="true"]')).toBeFocused();

      await page.keyboard.press('r');
      await page.keyboard.press('d');
      await page.waitForTimeout(300);

      expect(presetOf(page)).toBe(before);
      expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(dark);
    });

    test('the Menu popup takes the keyboard too: focus lands on the first item and R does not shuffle', async ({
      page,
    }) => {
      const before = presetOf(page);
      const trigger = page.getByRole('button', { name: 'Menu', exact: true });
      await trigger.focus();
      await page.keyboard.press('Enter');

      await expect(page.getByRole('menuitem', { name: /^Navigate/ })).toBeFocused();
      await page.keyboard.press('r');
      await page.waitForTimeout(300);
      expect(presetOf(page)).toBe(before);
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

  test('the shortcuts do not fire behind the welcome dialog', async ({ page }) => {
    await page.goto('/create');
    await ready(page);
    await expect(page.getByRole('button', { name: 'Get Started' })).toBeVisible();
    const before = presetOf(page);
    const dark = await page.evaluate(() => document.documentElement.classList.contains('dark'));

    await page.keyboard.press('r');
    await page.keyboard.press('d');
    await page.keyboard.press('Control+p');

    expect(presetOf(page)).toBe(before);
    expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(dark);
    await expect(page.getByRole('dialog', { name: 'Navigate' })).toHaveCount(0);
  });
});

test.describe('Create builder, phone', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  const pickers = [
    'Style',
    'Base Color',
    'Theme',
    'Chart Color',
    'Heading',
    'Font',
    'Icon Library',
    'Radius',
    'Menu',
    'Menu Accent',
  ];

  test('a tap opens only that picker and an option can be chosen, in every picker', async ({ page }) => {
    test.setTimeout(90_000);
    await page.addInitScript(() => localStorage.setItem('zard-create-welcome', 'true'));
    await page.goto('/create');
    await ready(page);

    for (const label of pickers) {
      await picker(page, label).locator('button[zpopover]').tap();
      await expect(page.getByRole('menu')).toHaveCount(1);
      const menu = page.getByRole('menu', { name: label });
      await expect(menu).toBeVisible();

      const next = menu.locator('[role="menuitemradio"][aria-checked="false"]:not(:disabled)').first();
      const value = await next.getAttribute('data-value');
      await next.tap();
      await expect(page.getByRole('menu')).toHaveCount(0);
      expect(value).toBeTruthy();
    }
  });

  test('the footer buttons are 40px tall', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('zard-create-welcome', 'true'));
    await page.goto('/create');
    await ready(page);

    const box = await page.getByTestId('copy-preset').boundingBox();
    expect(box?.height).toBeCloseTo(40, 0);
  });

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
