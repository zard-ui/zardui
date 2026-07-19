import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object helper for navigating to and interacting with ZardUI
 * component demo pages at /docs/components/:componentName.
 *
 * Page structure (from component.page.html):
 * #overview — first demo (z-code-box) + component description + z-assist AI component
 * #installation — CLI/Manual tabs with installation steps
 * #usage — Import and code usage examples (z-code-block embedded)
 * #examples — All demos rendered in z-code-box components
 * #api — API Reference (z-api-reference)
 */
export class ComponentDemoPage {
  constructor(
    readonly page: Page,
    readonly componentName: string,
  ) {}

  /** Navigate to the component demo page and wait for content to load. */
  async goto(): Promise<void> {
    await this.page.goto(`/docs/components/${this.componentName}`);
    await this.page.waitForSelector('#overview', { state: 'visible', timeout: 15_000 });
    // Wait for Angular SSR hydration to complete so event listeners are bound
    await this.page.waitForLoadState('networkidle');
  }

  /** Get the overview section containing first demo and description. */
  get overviewSection(): Locator {
    return this.page.locator('#overview');
  }

  /** Get the installation section with CLI/Manual tabs. */
  get installationSection(): Locator {
    return this.page.locator('#installation');
  }

  /** Get the usage section with import and code examples. */
  get usageSection(): Locator {
    return this.page.locator('#usage');
  }

  /** Get the examples section containing all z-code-box demos. */
  get examplesSection(): Locator {
    return this.page.locator('#examples');
  }

  /** Get the API reference section. */
  get apiSection(): Locator {
    return this.page.locator('#api');
  }

  /** Get a specific demo by its scrollSpyItem name / id attribute. */
  getDemoByName(exampleName: string): Locator {
    return this.page.locator(`[id="${exampleName}"]`);
  }

  /** Get all z-code-box demo containers. */
  get allDemoBoxes(): Locator {
    return this.page.locator('z-code-box');
  }

  /** Get the first demo box (rendered in the overview section). */
  get firstDemoBox(): Locator {
    return this.overviewSection.locator('z-code-box');
  }

  /** Get the AI assist component in overview. */
  get aiAssistComponent(): Locator {
    return this.overviewSection.locator('z-assist');
  }

  /** Get the API reference component. */
  get apiReferenceComponent(): Locator {
    return this.apiSection.locator('z-api-reference');
  }
}
