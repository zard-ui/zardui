```angular-ts title="libs/zard/src/lib/shared/components/button/button.component.spec.ts" showLineNumbers copyButton
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

```typescript title="apps/web-e2e/src/components/button.spec.ts" showLineNumbers copyButton
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

```bash title="Test commands" copyButton
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
