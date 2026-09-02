import { test, expect } from '@playwright/test';

import { COMPONENT_NAMES } from './utils/component-names';

/**
 * Every documentation page must hydrate cleanly on a direct page load.
 *
 * A hydration mismatch does not look like an error to a visitor — Angular gives up on
 * the mismatched subtree, leaves it as inert server HTML, and the components inside it
 * never receive their inputs. The navigation menu shipped that way: its trigger renders
 * a chevron imperatively, that extra node reached the serialized HTML, hydration failed
 * on it, and the menu was dead to the pointer for anyone who landed on the page rather
 * than navigating to it.
 *
 * The two signals below are what that failure leaves behind:
 *
 *   - an `ngh` attribute is how the server marks a node for hydration, and Angular
 *     removes it as it claims the node. Any left over means a subtree was abandoned.
 *   - the mismatch itself is reported on the console.
 */
test.describe('Hydration', () => {
  for (const component of COMPONENT_NAMES) {
    test(`${component} hydrates without a mismatch`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', message => {
        // Assets the page merely points at — avatars, fonts, anything third-party —
        // fail for reasons that have nothing to do with whether the app hydrated, and
        // they fail differently on every network. Only what the app itself reports counts.
        if (message.type() === 'error' && !message.text().startsWith('Failed to load resource')) {
          errors.push(message.text());
        }
      });
      page.on('pageerror', error => errors.push(error.message));

      await page.goto(`/docs/components/${component}`);
      await page.waitForSelector('#overview', { state: 'visible', timeout: 15_000 });
      await page.waitForLoadState('networkidle');

      await expect.poll(() => page.locator('[ngh]').count(), { timeout: 10_000 }).toBe(0);
      expect(errors).toEqual([]);
    });
  }
});
