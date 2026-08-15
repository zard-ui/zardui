import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';

import {
  BLOCK_0 as IMPORT_BLOCK,
  BLOCK_1 as RENDER_BLOCK,
  BLOCK_2 as PAGE_SKELETON_BLOCK,
  BLOCK_3 as TEMPLATE_SKELETON_BLOCK,
  BLOCK_4 as PIPELINE_BLOCK,
} from '@generated/pages/contribute/documentation';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

import { CalloutComponent } from '@doc/domain/components/callout/callout.component';
import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { SeoService } from '@doc/shared/services/seo.service';

interface GeneratorEntry {
  name: string;
  reads: string;
  writes: string;
}

interface MetaEntry {
  attribute: string;
  effect: string;
}

interface BuildingBlockEntry {
  selector: string;
  role: string;
}

interface NewPageStep {
  step: string;
  title: string;
  description: string;
}

@Component({
  selector: 'z-contribute-documentation',
  imports: [
    CodeBlockComponent,
    CalloutComponent,
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
  ],
  templateUrl: './documentation.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributeDocumentationPage implements OnInit {
  activeAnchor?: string;

  private readonly seoService = inject(SeoService);

  readonly importBlock: CodeBlockData = IMPORT_BLOCK;
  readonly renderBlock: CodeBlockData = RENDER_BLOCK;
  readonly pageSkeletonBlock: CodeBlockData = PAGE_SKELETON_BLOCK;
  readonly templateSkeletonBlock: CodeBlockData = TEMPLATE_SKELETON_BLOCK;
  readonly pipelineBlock: CodeBlockData = PIPELINE_BLOCK;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'generators', label: 'The Six Generators', type: 'custom' },
      { id: 'code-fences', label: 'Code Fence Metadata', type: 'custom' },
      { id: 'page-anatomy', label: 'Anatomy of a Page', type: 'custom' },
      { id: 'markdown-pipeline', label: 'Post-build Markdown', type: 'custom' },
      { id: 'new-page', label: 'Adding a New Page', type: 'custom' },
    ],
  };

  readonly generators: GeneratorEntry[] = [
    {
      name: 'demo-writer',
      reads: 'libs/zard/**/demo/*.ts (except the registry itself)',
      writes: 'apps/web/src/generated/components/<name>/demo/*.ts',
    },
    {
      name: 'installation-writer',
      reads: 'Every component folder in libs/zard',
      writes: 'apps/web/src/generated/installation/{cli,manual,register}/**',
    },
    {
      name: 'docs-writer',
      reads: 'apps/web/public/documentation/<section>/*.md',
      writes: 'apps/web/src/generated/documentation/<section>/*.ts',
    },
    {
      name: 'page-data-writer',
      reads: 'apps/web/public/documentation/<section>/*.md',
      writes: 'apps/web/src/generated/pages/<section>/*.ts, exporting BLOCK_n and TABS_n',
    },
    {
      name: 'usage-writer',
      reads: 'The USAGE_DATA record in packages/highlight/src/generator/usage-data.ts',
      writes: 'apps/web/src/generated/usage/<name>.ts',
    },
    {
      name: 'snippet-writer',
      reads: 'libs/zard/**/doc/snippets.md',
      writes: 'apps/web/src/generated/components/<name>/snippets.ts',
    },
  ];

  readonly metaAttributes: MetaEntry[] = [
    { attribute: 'title="app.component.ts"', effect: 'Shows a file name header with a language icon.' },
    { attribute: 'tab="npm"', effect: 'Groups consecutive fences into a single tabbed block (TABS_n).' },
    { attribute: 'id="api"', effect: 'Names the export in a snippets.md file instead of using its index.' },
    { attribute: 'showLineNumbers', effect: 'Renders line numbers in the gutter.' },
    { attribute: 'copyButton', effect: 'Adds the copy-to-clipboard button.' },
    { attribute: 'expandable="true"', effect: 'Collapses long blocks behind an expand control.' },
    { attribute: 'expandableTitle="Expand"', effect: 'Sets the label of that control.' },
    { attribute: '{1,3-5}', effect: 'Highlights the listed lines and ranges.' },
  ];

  readonly buildingBlocks: BuildingBlockEntry[] = [
    { selector: 'z-content', role: 'The page shell: content column plus the right-hand anchor navigation.' },
    {
      selector: 'z-doc-heading',
      role: 'The h1, the description and the AI assist toolbar. Owns the #overview anchor.',
    },
    { selector: 'scrollSpy / scrollSpyItem', role: 'Directives that keep the active anchor in sync while scrolling.' },
    { selector: 'z-callout', role: 'A highlighted note. Variants: info, warning, muted, gradient.' },
    { selector: 'z-steps / z-step', role: 'Numbered installation steps driven by a Step[] array.' },
    { selector: 'z-code-block', role: 'A single highlighted block from CodeBlockData.' },
    { selector: 'z-code-tabs', role: 'A tabbed group from CodeTabData.' },
    { selector: 'z-api-reference', role: 'The API table rendered from an ApiSection[].' },
  ];

  readonly newPageSteps: NewPageStep[] = [
    {
      step: '1',
      title: 'Write the Markdown sources',
      description:
        'Put one .md per page under apps/web/public/documentation/<section>/, with a fenced block per snippet you want to show.',
    },
    {
      step: '2',
      title: 'Generate the code blocks',
      description: 'Run npm run generate:highlight and note the BLOCK_n / TABS_n exports it produced.',
    },
    {
      step: '3',
      title: 'Create the page',
      description:
        'Add a standalone *.page.ts with an OnPush component, a z- prefixed selector, a NavigationConfig whose first item is overview, and setDocsSeo in ngOnInit.',
    },
    {
      step: '4',
      title: 'Register the route',
      description: 'Add a lazy loadComponent entry under the docs children in apps/web/src/app/app.routes.ts.',
    },
    {
      step: '5',
      title: 'Add the sidebar item',
      description:
        'Append { name, path, available: true } to the matching NavSection in routes.constant.ts. That one array feeds the sidebar, the mobile menu and the command palette.',
    },
    {
      step: '6',
      title: 'Refresh the prerender list',
      description: 'Run node apps/web/update-routes.mjs and commit the updated prerender-routes.txt.',
    },
    {
      step: '7',
      title: 'Build and commit the artifacts',
      description:
        'Run npm run build, then commit apps/web/src/generated/** and the new apps/web/public/docs/**.md files it produced.',
    },
  ];

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Documentation System',
      'How the Zard UI docs are built: the six Shiki generators, the code fence metadata, the page building blocks and the post-build Markdown pipeline.',
      '/docs/contribute/documentation',
      'og-contribute-documentation.jpg',
    );
  }
}
