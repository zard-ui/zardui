import { test, expect } from '@playwright/test';

/**
 * The "Copy Page as Markdown" feature (z-assist toolbar). Each component docs
 * page has a generated `.md` served as a static asset at `<path>.md` (like
 * llms.txt), so it is genuinely navigable and copyable in dev and prod.
 */
test.describe('Component page as Markdown', () => {
  test('is served as a navigable static .md file', async ({ request }) => {
    const response = await request.get('/docs/components/button.md');

    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('# Button');
    expect(body).toContain('## Installation');
    expect(body).toContain('npx zard-cli@latest add button');
    expect(body).toContain('## API Reference');
    // Raw source is served, never the Shiki-highlighted HTML.
    expect(body).not.toContain('<pre class="shiki');
  });

  test('documentation pages are also served as navigable .md files', async ({ request }) => {
    const response = await request.get('/docs/theming.md');

    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('# Theming');
    expect(body).toContain('## CSS Variables');
  });

  test('is copied to the clipboard by the "Copy Page" button', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    await page.goto('/docs/components/button');
    await page.waitForSelector('#overview', { state: 'visible', timeout: 15_000 });
    await page.waitForLoadState('networkidle');

    const copyButton = page.getByRole('button', { name: 'Copy page as Markdown' });
    await expect(copyButton).toBeVisible();

    await copyButton.click();

    // The label flips to "Copied" only after clipboard.writeText resolves.
    await expect(copyButton).toContainText('Copied');

    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toContain('# Button');
    expect(clipboard).toContain('## API Reference');
  });
});
