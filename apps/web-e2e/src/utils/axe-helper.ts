import AxeBuilder from '@axe-core/playwright';
import { type Page, expect } from '@playwright/test';

/**
 * Run axe accessibility checks against the current page.
 *
 * @param page - Playwright Page object
 * @param context - Optional CSS selector to limit the scan (e.g., '#overview')
 * @param disabledRules - Optional list of axe rule IDs to disable for known issues
 */
export async function checkA11y(page: Page, context?: string, disabledRules: string[] = []): Promise<void> {
  let builder = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);

  if (context) {
    builder = builder.include(context);
  }

  if (disabledRules.length > 0) {
    builder = builder.disableRules(disabledRules);
  }

  const results = await builder.analyze();

  expect(
    results.violations,
    `A11y violations:\n${results.violations
      .map(v => `  [${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} instances)`)
      .join('\n')}`,
  ).toEqual([]);
}
