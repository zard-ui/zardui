import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object helper for navigating to and interacting with ZardUI
 * component demo pages at /docs/components/:componentName.
 *
 * Page structure (from component.page.html):
 *   #overview    — first demo + markdown overview
 *   #installation
 *   #examples   — all demos rendered in z-code-box > z-card.demo-card
 *   #api
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

  /** Get the overview section. */
  get overviewSection(): Locator {
    return this.page.locator('#overview');
  }

  /** Get the examples section containing all z-code-box demos. */
  get examplesSection(): Locator {
    return this.page.locator('#examples');
  }

  /** Get a specific demo by its scrollSpyItem name / id attribute. */
  getDemoByName(exampleName: string): Locator {
    return this.page.locator(`[id="${exampleName}"]`);
  }

  /** Get all demo card containers (z-card.demo-card). */
  get allDemoCards(): Locator {
    return this.page.locator('z-card.demo-card');
  }

  /** Get the first demo card (rendered in the overview section). */
  get firstDemoCard(): Locator {
    return this.overviewSection.locator('z-card.demo-card');
  }
}
