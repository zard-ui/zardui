import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';

import {
  BLOCK_0 as GENERATE_BLOCK,
  BLOCK_1 as COMPONENT_BLOCK,
  BLOCK_2 as VARIANTS_BLOCK,
  BLOCK_3 as DEMO_REGISTRY_BLOCK,
  BLOCK_4 as API_BLOCK,
  BLOCK_5 as USAGE_DATA_BLOCK,
  BLOCK_6 as VERIFY_BLOCK,
} from '@generated/pages/contribute/components';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

import { CalloutComponent } from '@doc/domain/components/callout/callout.component';
import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { SeoService } from '@doc/shared/services/seo.service';

interface FileEntry {
  path: string;
  purpose: string;
}

interface ConventionEntry {
  rule: string;
  detail: string;
}

@Component({
  selector: 'z-contribute-components',
  imports: [
    CodeBlockComponent,
    CalloutComponent,
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
  ],
  templateUrl: './components.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributeComponentsPage implements OnInit {
  activeAnchor?: string;

  private readonly seoService = inject(SeoService);

  readonly generateBlock: CodeBlockData = GENERATE_BLOCK;
  readonly componentBlock: CodeBlockData = COMPONENT_BLOCK;
  readonly variantsBlock: CodeBlockData = VARIANTS_BLOCK;
  readonly demoRegistryBlock: CodeBlockData = DEMO_REGISTRY_BLOCK;
  readonly apiBlock: CodeBlockData = API_BLOCK;
  readonly usageDataBlock: CodeBlockData = USAGE_DATA_BLOCK;
  readonly verifyBlock: CodeBlockData = VERIFY_BLOCK;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'generator', label: 'Run the Generator', type: 'custom' },
      { id: 'anatomy', label: 'Anatomy', type: 'custom' },
      { id: 'conventions', label: 'Conventions', type: 'custom' },
      { id: 'demos', label: 'Demos', type: 'custom' },
      { id: 'api-reference', label: 'API Reference', type: 'custom' },
      { id: 'usage-snippet', label: 'Usage Snippet', type: 'custom' },
      { id: 'checklist', label: 'Checklist', type: 'custom' },
    ],
  };

  readonly createdFiles: FileEntry[] = [
    { path: '<name>.component.ts', purpose: 'The component, already wired to its variants and class input.' },
    { path: '<name>.variants.ts', purpose: 'An empty CVA definition plus the derived variant type.' },
    { path: '<name>.component.spec.ts', purpose: 'A Jest spec that asserts the component is created.' },
    { path: 'index.ts', purpose: 'The barrel that re-exports the component and its variants.' },
    { path: 'demo/default.ts', purpose: 'The first demo component.' },
    { path: 'demo/<name>.ts', purpose: 'The demo registry read by the docs page.' },
    { path: 'doc/api.ts', purpose: 'A starter ApiSection[] with the class prop.' },
  ];

  readonly updatedFiles: FileEntry[] = [
    { path: 'libs/zard/src/index.ts', purpose: 'Adds the barrel export in alphabetical order.' },
    {
      path: 'apps/web/src/app/shared/constants/components.constant.ts',
      purpose: 'Appends the COMPONENTS_REGISTRY entry.',
    },
    {
      path: 'apps/web/src/app/shared/constants/routes.constant.ts',
      purpose: 'Appends the sidebar item to COMPONENTS_PATH.',
    },
    {
      path: 'packages/highlight/src/generator/usage-data.ts',
      purpose: 'Seeds the usage snippet so @generated/usage/<name> exists.',
    },
  ];

  readonly conventions: ConventionEntry[] = [
    {
      rule: 'Prefix inputs with z',
      detail: 'zType, zSize, zDisabled, zLoading. Only the class input keeps its plain name.',
    },
    {
      rule: 'Boolean inputs use booleanAttribute',
      detail: 'input(false, { transform: booleanAttribute }) so <z-thing zDisabled> works without a binding.',
    },
    {
      rule: 'class is a ClassValue',
      detail: 'Accept ClassValue from clsx and merge it last inside mergeClasses so consumers can always override.',
    },
    {
      rule: 'Dual selector when it makes sense',
      detail: 'z-name, [z-name] lets the component be used as an element or applied to a native tag, like a[z-button].',
    },
    {
      rule: 'Use @/ inside the library',
      detail: 'Imports within libs/zard go through @/shared/…, never through a long relative path.',
    },
    {
      rule: 'OnPush and ViewEncapsulation.None',
      detail: 'Both are mandatory; classes are applied to the host through the [class] host binding.',
    },
    {
      rule: 'Set exportAs',
      detail: 'Use the camelCase z-prefixed name (zButton, zCardTitle) so templates can grab a reference.',
    },
  ];

  readonly checklist: string[] = [
    'The component compiles and the unit spec passes: npx nx run zard:test.',
    'Every public input appears in doc/api.ts with its real type and default.',
    'Each demo has an entry in demo/<name>.ts with its codeData import.',
    'usage-data.ts holds a snippet that actually compiles for consumers.',
    'npm run generate:highlight was run and apps/web/src/generated/ is staged.',
    'npm run build succeeds — that is the job the CI runs.',
    'The E2E spec was updated if the component or its first demo changed.',
  ];

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Contributing Components',
      'Scaffold, build, document and ship a Zard UI component: the Nx generator, the CVA pattern, demos, the API reference and the pre-PR checklist.',
      '/docs/contribute/components',
      'og-contribute-components.jpg',
    );
  }
}
