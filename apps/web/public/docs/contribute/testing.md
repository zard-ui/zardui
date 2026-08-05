---
title: Testing
description: Two suites guard the library: Jest unit tests next to each component, and Playwright specs that drive the real documentation pages.
---

# Testing

Two suites guard the library: Jest unit tests next to each component, and Playwright specs that drive the real documentation pages.

The CI runs both. Unit tests run on every pull request; the E2E job runs after the build and includes automated accessibility checks, so a regression in keyboard support or ARIA state fails the pipeline.

## Unit Tests

`npm test` expands to `nx run-many --target=test --p=libs/*` , so it covers every library in the workspace.

| Piece | Detail |
| --- | --- |
| Jest 30 | The runner, wired through @nx/jest. One project per library. |
| happy-dom | The DOM implementation, faster than jsdom for component rendering. |
| @testing-library/angular | render() and screen. Assert on what a user perceives, not on internal state. |
| @testing-library/jest-dom | Matchers such as toBeVisible and toHaveClass. |
| Co-location | The spec sits next to the component as <name>.component.spec.ts. |

libs/zard/src/lib/shared/components/button/button.component.spec.ts

```
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/angular';

import { ZardButtonComponent } from './button.component';

describe('ZardButtonComponent', () => {
  describe('basic rendering', () => {
    it('creates successfully', async () => {
      await render('<button z-button>Test</button>', {
        imports: [ZardButtonComponent],
      });

      expect(screen.getByRole('button')).toBeVisible();
    });
  });

  describe('disabled state', () => {
    it('applies disabled classes when zDisabled is true', async () => {
      await render('<button z-button [zDisabled]="true">Button</button>', {
        imports: [ZardButtonComponent],
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('pointer-events-none');
      expect(button).toHaveClass('opacity-50');
    });
  });
});
```

## E2E Tests

E2E specs run against the documentation site itself, so they exercise the component exactly as a user meets it — server-rendered, hydrated, inside a real page.

| Piece | Detail |
| --- | --- |
| Playwright | Chromium only for now, driven through @nx/playwright. |
| apps/web-e2e/src/components/ | One spec per component, named after it. |
| ComponentDemoPage | The page object in src/utils/component-page.ts. It navigates to the docs page and waits for hydration. |
| checkA11y | The axe wrapper in src/utils/axe-helper.ts, running the WCAG 2.1 A and AA rule sets. |
| Base URL | http://localhost:4222 — the config boots the local dev server when needed. |

apps/web-e2e/src/components/button.spec.ts

```
import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Button component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'button');
    await demoPage.goto();
  });

  test('button is clickable and remains interactive', async () => {
    const button = demoPage.firstDemoBox.locator('button[z-button]').first();
    await expect(button).toBeEnabled();
    await button.click();
    await expect(button).toBeVisible();
  });

  test('passes accessibility checks', async ({ page }) => {
    await checkA11y(page, '#overview', ['button-name', 'color-contrast']);
  });
});
```

i

#### Disabling an axe rule

`checkA11y` takes a list of rule ids to skip. Use it only for known, documented limitations — the button spec disables `color-contrast` because Shiki's syntax colours fail the ratio — and always leave a comment saying why.

## E2E Governance

Because the specs run against live documentation pages, an unrelated copy change can break them. These four rules keep the suite trustworthy.

Test behaviour, not content

Assert on interactions and ARIA state. Demo copy and element counts change; behaviour should not.

The first demo is the fixture

Specs target the hero demo of each component page. Keep it stable, or update the spec with it.

Update E2E in the same pull request

If you change a component or its first demo, the spec change belongs in the same PR.

Use stable selectors

Prefer component selectors (z-button), attribute selectors ([z-input]) and roles over CSS classes.

## Commands

Running the full E2E suite is expensive. Locally, run the unit tests on every change and the E2E suite before opening the pull request.

Test commands

```
# Unit tests (Jest) for every project under libs/
npm test
npm run test:watch

# A single project
npx nx run zard:test

# E2E (Playwright) — boots the local dev server automatically
npm run e2e
npm run e2e:ui
npx nx e2e web-e2e -- --grep "Button"
```
