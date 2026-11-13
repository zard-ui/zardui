import { test, expect, type Locator, type Page } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';

/** The patterns with a page. Keep in step with AI_ELEMENT_LOADERS in apps/web. */
const PATTERNS = [
  'checkpoint',
  'confirmation',
  'context',
  'file-tree',
  'inline-citation',
  'message',
  'model-selector',
  'plan',
  'prompt-input',
  'queue',
  'reasoning',
  'sources',
  'suggestion',
  'task',
];

/** Patterns still waiting on a component: they are listed, but have no page yet. */
const COMING_SOON = ['chain-of-thought', 'chat', 'stack-trace', 'subagent', 'terminal', 'test-results', 'tool'];

async function gotoDocs(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await page.waitForSelector('#overview', { state: 'visible', timeout: 15_000 });
  // Wait for hydration, so the demos' event listeners are bound.
  await page.waitForLoadState('networkidle');
}

/**
 * Clicks a button that starts a streamed run and waits until the run hides it. A click that lands before the page
 * has hydrated does nothing, so it retries until one takes.
 */
async function startRun(button: Locator): Promise<void> {
  await expect(async () => {
    await button.click();
    await expect(button).toBeHidden({ timeout: 1_000 });
  }).toPass({ timeout: 15_000 });
}

test.describe('AI Elements overview', () => {
  test.beforeEach(async ({ page }) => gotoDocs(page, '/docs/ai-elements'));

  test('links every pattern with a page and marks the others as coming soon', async ({ page }) => {
    const grid = page.locator('[data-slot="ai-elements-patterns"]');

    for (const slug of PATTERNS) {
      await expect(grid.locator(`a[href="/docs/ai-elements/${slug}"]`)).toHaveCount(1);
    }
    await expect(grid.locator('[data-state="soon"]')).toHaveCount(COMING_SOON.length);
  });

  test('has no accessibility violations', async ({ page }) => {
    await checkA11y(page, 'z-content');
  });
});

test.describe('AI Elements pattern pages', () => {
  for (const slug of PATTERNS) {
    test(`${slug}: renders the preview, the components it is built with and no a11y violations`, async ({ page }) => {
      await gotoDocs(page, `/docs/ai-elements/${slug}`);

      const preview = page.locator('[data-slot="ai-element-preview"]');
      await expect(preview).toBeVisible();
      await expect(page.locator('#installation [data-slot="ai-element-built-with"] a').first()).toHaveAttribute(
        'href',
        /^\/docs\/components\//,
      );
      await expect(page.locator('#api li a').first()).toBeVisible();

      await checkA11y(page, '[data-slot="ai-element-preview"]');
    });
  }

  test('a pattern without a page goes back to the overview', async ({ page }) => {
    await page.goto(`/docs/ai-elements/${COMING_SOON[0]}`);
    await expect(page).toHaveURL(/\/docs\/ai-elements$/);
  });
});

test.describe('AI Elements streamed demos', () => {
  for (const slug of PATTERNS) {
    test(`${slug}: Replay streams the run and resets`, async ({ page }) => {
      await gotoDocs(page, `/docs/ai-elements/${slug}`);

      const replay = page.locator('[data-slot="ai-element-preview"]').getByRole('button', { name: 'Replay' });
      test.skip((await replay.count()) === 0, 'This pattern has no streamed preview.');

      await replay.scrollIntoViewIfNeeded();
      await startRun(replay);
      // The run ends by bringing the button back.
      await expect(replay).toBeVisible({ timeout: 20_000 });
    });
  }
});
