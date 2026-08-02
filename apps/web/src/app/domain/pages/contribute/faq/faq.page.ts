import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';

import {
  BLOCK_0 as AMEND_BLOCK,
  BLOCK_1 as HIGHLIGHT_BLOCK,
  BLOCK_2 as ROUTES_BLOCK,
  BLOCK_3 as RESET_BLOCK,
} from '@generated/pages/contribute/faq';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

import { CalloutComponent } from '@doc/domain/components/callout/callout.component';
import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { SeoService } from '@doc/shared/services/seo.service';

interface FaqEntry {
  question: string;
  answer: string;
}

@Component({
  selector: 'z-contribute-faq',
  imports: [
    CodeBlockComponent,
    CalloutComponent,
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
  ],
  templateUrl: './faq.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributeFaqPage implements OnInit {
  activeAnchor?: string;

  private readonly seoService = inject(SeoService);

  readonly amendBlock: CodeBlockData = AMEND_BLOCK;
  readonly highlightBlock: CodeBlockData = HIGHLIGHT_BLOCK;
  readonly routesBlock: CodeBlockData = ROUTES_BLOCK;
  readonly resetBlock: CodeBlockData = RESET_BLOCK;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'commits', label: 'Commits', type: 'custom' },
      { id: 'code-blocks', label: 'Code Blocks', type: 'custom' },
      { id: 'navigation', label: 'Pages & Navigation', type: 'custom' },
      { id: 'build-errors', label: 'Build Errors', type: 'custom' },
      { id: 'still-stuck', label: 'Still Stuck?', type: 'custom' },
    ],
  };

  readonly codeBlockIssues: FaqEntry[] = [
    {
      question: 'The code block on my page is empty or out of date',
      answer:
        'The .ts under apps/web/src/generated is stale. Run npm run generate:highlight and stage the result — that directory is committed.',
    },
    {
      question: 'I generated a component and its page renders nothing',
      answer:
        'The demo registry imports from @generated/…, which only exists after the highlight generator runs. Run npm run generate:highlight, then reload.',
    },
    {
      question: 'My imports point at the wrong snippet',
      answer:
        'Exports are numbered by order of appearance, so inserting a fence in the middle of a Markdown file renumbers every block after it. Rerun the generator and re-check each BLOCK_n alias.',
    },
    {
      question: 'The Usage section of my component is missing',
      answer:
        'Add an entry for the component in packages/highlight/src/generator/usage-data.ts — usage-writer only emits files for the keys listed there.',
    },
  ];

  readonly navigationIssues: FaqEntry[] = [
    {
      question: 'I added a page and it is not in the sidebar',
      answer:
        'The sidebar is built from SIDEBAR_PATHS in routes.constant.ts. Add the item to the matching NavSection; the mobile menu and the command palette read the same array.',
    },
    {
      question: 'My new route was not prerendered',
      answer:
        'prerender-routes.txt is generated. Run node apps/web/update-routes.mjs and commit the result. The item must be shaped exactly as { name, path, available: true } for the regex to pick it up.',
    },
    {
      question: 'The page has no .md and the Copy Page button does nothing',
      answer:
        'apps/web/public/docs/**.md is written after the build by generate:md:docs. Run npm run build, then commit the new file. An empty output means the page structure strayed from z-content.',
    },
  ];

  readonly buildIssues: FaqEntry[] = [
    {
      question: 'Cannot find module @zard/… or @doc/…',
      answer:
        'Aliases are declared per project. @doc/domain/* only resolves inside apps/web; inside libs/zard the alias is @doc/*. Check the table on the Architecture page.',
    },
    {
      question: 'A template error mentions a type I never wrote',
      answer:
        'strictTemplates is on. Bindings are type-checked against the input signature — most often you are passing string where a literal union is expected.',
    },
    {
      question: 'Nx keeps returning a stale result',
      answer: 'Run npx nx reset to clear the local cache and the daemon, then run the target again.',
    },
    {
      question: 'The build warns that the initial bundle exceeded its budget',
      answer:
        'The budgets are set in apps/web/project.json. A warning does not fail the build; an error does. If your page pulled a heavy dependency into the initial chunk, load it lazily instead of raising the budget.',
    },
    {
      question: 'Do I need to touch the E2E specs?',
      answer:
        'Only when you change a component behaviour or its first demo — that demo is the fixture every spec targets. Pure documentation changes do not need E2E updates.',
    },
  ];

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'FAQ & Troubleshooting',
      'Rejected commits, empty code blocks, missing sidebar items, path alias errors, strictTemplates and Nx cache issues — with the command that fixes each.',
      '/docs/contribute/faq',
      'og-contribute-faq.jpg',
    );
  }
}
