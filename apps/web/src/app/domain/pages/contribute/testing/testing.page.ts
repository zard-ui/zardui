import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';

import {
  BLOCK_0 as UNIT_TEST_BLOCK,
  BLOCK_1 as E2E_TEST_BLOCK,
  BLOCK_2 as COMMANDS_BLOCK,
} from '@generated/pages/contribute/testing';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

import { CalloutComponent } from '@doc/domain/components/callout/callout.component';
import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { SeoService } from '@doc/shared/services/seo.service';

interface StackEntry {
  tool: string;
  detail: string;
}

interface RuleEntry {
  rule: string;
  detail: string;
}

@Component({
  selector: 'z-contribute-testing',
  imports: [
    CodeBlockComponent,
    CalloutComponent,
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
  ],
  templateUrl: './testing.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributeTestingPage implements OnInit {
  activeAnchor?: string;

  private readonly seoService = inject(SeoService);

  readonly unitTestBlock: CodeBlockData = UNIT_TEST_BLOCK;
  readonly e2eTestBlock: CodeBlockData = E2E_TEST_BLOCK;
  readonly commandsBlock: CodeBlockData = COMMANDS_BLOCK;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'unit-tests', label: 'Unit Tests', type: 'custom' },
      { id: 'e2e-tests', label: 'E2E Tests', type: 'custom' },
      { id: 'governance', label: 'E2E Governance', type: 'custom' },
      { id: 'commands', label: 'Commands', type: 'custom' },
    ],
  };

  readonly unitStack: StackEntry[] = [
    { tool: 'Jest 30', detail: 'The runner, wired through @nx/jest. One project per library.' },
    { tool: 'happy-dom', detail: 'The DOM implementation, faster than jsdom for component rendering.' },
    {
      tool: '@testing-library/angular',
      detail: 'render() and screen. Assert on what a user perceives, not on internal state.',
    },
    { tool: '@testing-library/jest-dom', detail: 'Matchers such as toBeVisible and toHaveClass.' },
    { tool: 'Co-location', detail: 'The spec sits next to the component as <name>.component.spec.ts.' },
  ];

  readonly e2eStack: StackEntry[] = [
    { tool: 'Playwright', detail: 'Chromium only for now, driven through @nx/playwright.' },
    { tool: 'apps/web-e2e/src/components/', detail: 'One spec per component, named after it.' },
    {
      tool: 'ComponentDemoPage',
      detail: 'The page object in src/utils/component-page.ts. It navigates to the docs page and waits for hydration.',
    },
    {
      tool: 'checkA11y',
      detail: 'The axe wrapper in src/utils/axe-helper.ts, running the WCAG 2.1 A and AA rule sets.',
    },
    { tool: 'Base URL', detail: 'http://localhost:4222 — the config boots the local dev server when needed.' },
  ];

  readonly governanceRules: RuleEntry[] = [
    {
      rule: 'Test behaviour, not content',
      detail: 'Assert on interactions and ARIA state. Demo copy and element counts change; behaviour should not.',
    },
    {
      rule: 'The first demo is the fixture',
      detail: 'Specs target the hero demo of each component page. Keep it stable, or update the spec with it.',
    },
    {
      rule: 'Update E2E in the same pull request',
      detail: 'If you change a component or its first demo, the spec change belongs in the same PR.',
    },
    {
      rule: 'Use stable selectors',
      detail: 'Prefer component selectors (z-button), attribute selectors ([z-input]) and roles over CSS classes.',
    },
  ];

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Testing',
      'Unit tests with Jest and Testing Library, Playwright E2E specs with accessibility checks, and the governance rules that keep them from breaking.',
      '/docs/contribute/testing',
      'og-contribute-testing.jpg',
    );
  }
}
