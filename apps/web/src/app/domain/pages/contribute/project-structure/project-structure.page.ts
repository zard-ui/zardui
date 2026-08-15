import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';

import {
  BLOCK_0 as REPO_TREE_BLOCK,
  BLOCK_1 as COMPONENT_TREE_BLOCK,
} from '@generated/pages/contribute/project-structure';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

import { CalloutComponent } from '@doc/domain/components/callout/callout.component';
import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { SeoService } from '@doc/shared/services/seo.service';

interface TaskEntry {
  goal: string;
  location: string;
  note: string;
}

interface ArtifactEntry {
  path: string;
  producedBy: string;
}

@Component({
  selector: 'z-contribute-project-structure',
  imports: [
    CodeBlockComponent,
    CalloutComponent,
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
  ],
  templateUrl: './project-structure.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributeProjectStructurePage implements OnInit {
  activeAnchor?: string;

  private readonly seoService = inject(SeoService);

  readonly repoTreeBlock: CodeBlockData = REPO_TREE_BLOCK;
  readonly componentTreeBlock: CodeBlockData = COMPONENT_TREE_BLOCK;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'tree', label: 'Directory Tree', type: 'custom' },
      { id: 'component-folder', label: 'A Component Folder', type: 'custom' },
      { id: 'where-do-i-go', label: 'Where Do I Go?', type: 'custom' },
      { id: 'generated-files', label: 'Generated Files', type: 'custom' },
    ],
  };

  readonly tasks: TaskEntry[] = [
    {
      goal: 'Add a new component',
      location: 'libs/zard/src/lib/shared/components/<name>/',
      note: 'Start with npm run generate:component — it also updates the barrel, the registry and the sidebar.',
    },
    {
      goal: 'Add a variant to an existing component',
      location: 'libs/zard/src/lib/shared/components/<name>/<name>.variants.ts',
      note: 'Add the key to the CVA variants object; the derived type updates itself.',
    },
    {
      goal: 'Add a demo',
      location: 'libs/zard/src/lib/shared/components/<name>/demo/',
      note: 'One file per example, then register it in demo/<name>.ts with its codeData import.',
    },
    {
      goal: 'Change the API reference',
      location: 'libs/zard/src/lib/shared/components/<name>/doc/api.ts',
      note: 'A typed ApiSection[]. It is not Markdown any more.',
    },
    {
      goal: 'Add a documentation page',
      location: 'apps/web/src/app/domain/pages/<name>/',
      note: 'Then register the route, add the sidebar item and rerun update-routes.mjs.',
    },
    {
      goal: 'Add a block',
      location: 'libs/blocks/src/lib/<name>/',
      note: 'Run npm run sync:blocks afterwards and add the two screenshots under apps/web/public/blocks/<name>/.',
    },
    {
      goal: 'Add a sidebar item',
      location: 'apps/web/src/app/shared/constants/routes.constant.ts',
      note: 'The same array feeds the sidebar, the mobile menu and the command palette.',
    },
    {
      goal: 'Add a CLI command',
      location: 'packages/cli/src/commands/',
      note: 'Commands are registered from packages/cli/src/index.ts.',
    },
    {
      goal: 'Add an E2E test',
      location: 'apps/web-e2e/src/components/<name>.spec.ts',
      note: 'Use the ComponentDemoPage helper and the checkA11y wrapper.',
    },
  ];

  readonly artifacts: ArtifactEntry[] = [
    { path: 'apps/web/src/generated/**', producedBy: 'npm run generate:highlight' },
    { path: 'apps/web/public/docs/components/**.md', producedBy: 'npm run generate:md' },
    { path: 'apps/web/public/docs/**.md', producedBy: 'npm run generate:md:docs (after the build)' },
    { path: 'apps/web/prerender-routes.txt', producedBy: 'node apps/web/update-routes.mjs' },
    { path: 'apps/web/public/r/**', producedBy: 'npm run build:registry' },
    { path: 'libs/blocks/src/lib/<name>/block.ts → files[]', producedBy: 'npm run sync:blocks' },
  ];

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Project Structure',
      'A commented map of the Zard UI repository, a task-to-directory lookup table, and which committed files are generated rather than written by hand.',
      '/docs/contribute/project-structure',
      'og-contribute-project-structure.jpg',
    );
  }
}
