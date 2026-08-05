import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';

import {
  BLOCK_0 as WEB_ALIASES_BLOCK,
  BLOCK_1 as LIB_ALIASES_BLOCK,
  BLOCK_2 as COMPONENT_PATTERN_BLOCK,
} from '@generated/pages/contribute/architecture';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

import { CalloutComponent } from '@doc/domain/components/callout/callout.component';
import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { SeoService } from '@doc/shared/services/seo.service';

interface ProjectEntry {
  path: string;
  name: string;
  role: string;
}

interface DecisionEntry {
  title: string;
  description: string;
}

interface AliasEntry {
  alias: string;
  target: string;
  declaredIn: string;
}

@Component({
  selector: 'z-contribute-architecture',
  imports: [
    CodeBlockComponent,
    CalloutComponent,
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
  ],
  templateUrl: './architecture.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributeArchitecturePage implements OnInit {
  activeAnchor?: string;

  private readonly seoService = inject(SeoService);

  readonly webAliasesBlock: CodeBlockData = WEB_ALIASES_BLOCK;
  readonly libAliasesBlock: CodeBlockData = LIB_ALIASES_BLOCK;
  readonly componentPatternBlock: CodeBlockData = COMPONENT_PATTERN_BLOCK;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'projects', label: 'Projects', type: 'custom' },
      { id: 'data-flow', label: 'How They Connect', type: 'custom' },
      { id: 'decisions', label: 'Architectural Decisions', type: 'custom' },
      { id: 'path-aliases', label: 'Path Aliases', type: 'custom' },
    ],
  };

  readonly projects: ProjectEntry[] = [
    {
      path: 'apps/web',
      name: 'Documentation site',
      role: 'The Angular application you are reading, rendered with SSR and prerendered at build time.',
    },
    {
      path: 'apps/web-e2e',
      name: 'End-to-end tests',
      role: 'Playwright specs that drive the documentation site, including accessibility checks.',
    },
    {
      path: 'libs/zard',
      name: 'Component library',
      role: 'The publishable library. Every component, its variants, unit tests, demos and API reference.',
    },
    {
      path: 'libs/blocks',
      name: 'Block library',
      role: 'Ready-to-paste screens composed from Zard components, each with its own metadata file.',
    },
    {
      path: 'packages/highlight',
      name: 'Code highlighting',
      role: 'Shiki-based generators plus the components that render code blocks, tabs and expandable snippets.',
    },
    {
      path: 'packages/cli',
      name: 'zard-cli',
      role: 'The command line tool that installs components into a consumer project from the registry.',
    },
    {
      path: 'packages/mcp',
      name: 'zard-mcp',
      role: 'An MCP server that exposes components, docs and blocks to AI assistants.',
    },
    {
      path: 'tools/generators',
      name: '@zardui/generators',
      role: 'The local Nx plugin providing the component and block generators.',
    },
    {
      path: 'scripts',
      name: 'Automation scripts',
      role: 'Dev server orchestration, registry build, block sync and commit normalisation.',
    },
    {
      path: 'api',
      name: 'Edge functions',
      role: 'og.ts renders the dynamic Open Graph images used by the SEO service.',
    },
  ];

  readonly decisions: DecisionEntry[] = [
    {
      title: 'Standalone components only',
      description: 'There are no NgModules. Components declare their own imports, which keeps lazy chunks small.',
    },
    {
      title: 'Signal inputs',
      description:
        'Every public input is an input() signal, and derived state is a computed(). Boolean inputs use the booleanAttribute transform so they work as bare HTML attributes.',
    },
    {
      title: 'OnPush change detection',
      description: 'All components use ChangeDetectionStrategy.OnPush; the ESLint config warns when one does not.',
    },
    {
      title: 'ViewEncapsulation.None',
      description:
        'Styling is done with Tailwind utilities on the host element, so encapsulated styles would only get in the way.',
    },
    {
      title: 'CVA + mergeClasses',
      description:
        'Variants are declared with class-variance-authority and merged with the consumer class input through mergeClasses(), which wraps clsx and tailwind-merge.',
    },
    {
      title: 'TailwindCSS v4, no config file',
      description:
        'Tailwind is configured entirely from apps/web/src/styles.css through @tailwindcss/postcss. There is no tailwind.config.js.',
    },
    {
      title: 'SSR and prerendering',
      description:
        'The site is prerendered from apps/web/prerender-routes.txt, which is itself generated from the route constants.',
    },
  ];

  readonly aliases: AliasEntry[] = [
    { alias: '@zard/*', target: 'libs/zard/src/lib/shared/*', declaredIn: 'apps/web/tsconfig.json' },
    { alias: '@blocks', target: 'libs/blocks/src/index.ts', declaredIn: 'apps/web/tsconfig.json' },
    { alias: '@doc/domain/*', target: 'apps/web/src/app/domain/*', declaredIn: 'apps/web/tsconfig.json' },
    { alias: '@doc/shared/*', target: 'apps/web/src/app/shared/*', declaredIn: 'apps/web/tsconfig.json' },
    { alias: '@doc/env/*', target: 'apps/web/src/environments/*', declaredIn: 'apps/web/tsconfig.json' },
    { alias: '@doc/widget/*', target: 'apps/web/src/app/widget/*', declaredIn: 'apps/web/tsconfig.json' },
    {
      alias: '@highlight/*',
      target: 'packages/highlight/src/*',
      declaredIn: 'apps/web/tsconfig.json · libs/zard/tsconfig.json',
    },
    {
      alias: '@generated/*',
      target: 'apps/web/src/generated/*',
      declaredIn: 'apps/web/tsconfig.json · libs/zard/tsconfig.json',
    },
    {
      alias: '@/*',
      target: 'libs/zard/src/lib/*',
      declaredIn: 'apps/web/tsconfig.json · libs/zard/tsconfig.json',
    },
    { alias: '@doc/*', target: 'apps/web/src/app/*', declaredIn: 'libs/zard/tsconfig.json' },
    { alias: '@zardui/generators', target: 'tools/generators/component/index.ts', declaredIn: 'tsconfig.base.json' },
  ];

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Architecture',
      'How the Zard UI monorepo is organised: what each project owns, how the library reaches the CLI and the docs site, and every path alias.',
      '/docs/contribute/architecture',
      'og-contribute-architecture.jpg',
    );
  }
}
