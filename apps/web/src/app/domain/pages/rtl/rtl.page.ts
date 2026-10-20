import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  BLOCK_0 as ANIMATIONS_PHYSICAL_BLOCK,
  BLOCK_1 as ANIMATIONS_LOGICAL_BLOCK,
} from '@generated/pages/rtl/animations';
import { BLOCK_0 as CLI_CONFIG_BLOCK } from '@generated/pages/rtl/cli-config';
import { BLOCK_0 as CLI_INIT_BLOCK } from '@generated/pages/rtl/cli-init';
import { BLOCK_0 as DIR_DIRECTIVE_BLOCK } from '@generated/pages/rtl/dir-directive';
import { BLOCK_0 as DIRECTIONALITY_BLOCK } from '@generated/pages/rtl/directionality';
import { BLOCK_0 as FONTS_CSS_BLOCK } from '@generated/pages/rtl/fonts-css';
import { TABS_0 as FONTS_INSTALL_TABS } from '@generated/pages/rtl/fonts-install';
import { BLOCK_0 as HTML_DIR_BLOCK } from '@generated/pages/rtl/html-dir';
import {
  BLOCK_0 as LOGICAL_PHYSICAL_BLOCK,
  BLOCK_1 as LOGICAL_LOGICAL_BLOCK,
} from '@generated/pages/rtl/logical-classes';
import { TABS_0 as MIGRATE_ADD_TABS } from '@generated/pages/rtl/migrate-add';
import { BLOCK_0 as MIGRATE_ICON_BLOCK } from '@generated/pages/rtl/migrate-icon';
import {
  BLOCK_0 as MIGRATE_PAGINATION_BLOCK,
  BLOCK_1 as MIGRATE_PAGINATION_PARTS_BLOCK,
} from '@generated/pages/rtl/migrate-pagination';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

import { StepsComponent } from '@doc/domain/components/steps/steps.component';
import { Step } from '@doc/shared/constants/install.constant';
import { SeoService } from '@doc/shared/services/seo.service';
import { ZardCodeBoxComponent } from '@doc/widget/components/zard-code-box/zard-code-box.component';

import { RtlCardDemoComponent } from './rtl-card.demo';
import { DocContentComponent } from '../../components/doc-content/doc-content.component';
import { DocHeadingComponent } from '../../components/doc-heading/doc-heading.component';
import { NavigationConfig } from '../../components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'z-rtl',
  imports: [
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    CodeBlockComponent,
    StepsComponent,
    RouterLink,
    ZardCodeBoxComponent,
  ],
  templateUrl: './rtl.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RtlPage implements OnInit {
  activeAnchor?: string;

  readonly cardDemo = RtlCardDemoComponent;

  readonly directionalityBlock: CodeBlockData = DIRECTIONALITY_BLOCK;
  readonly logicalPhysicalBlock: CodeBlockData = LOGICAL_PHYSICAL_BLOCK;
  readonly logicalLogicalBlock: CodeBlockData = LOGICAL_LOGICAL_BLOCK;
  readonly animationsPhysicalBlock: CodeBlockData = ANIMATIONS_PHYSICAL_BLOCK;
  readonly animationsLogicalBlock: CodeBlockData = ANIMATIONS_LOGICAL_BLOCK;

  readonly getStartedSteps: Step[] = [
    {
      title: 'Set the direction on the document',
      subtitle:
        'Add dir="rtl" and the language of your content to the html tag. Update lang="ar" to your target language. Every component and every overlay it opens reads the direction from there.',
      codeBlockData: HTML_DIR_BLOCK,
    },
    {
      title: 'Or scope a subtree',
      subtitle:
        'Mixed-direction page? Import the CDK Dir directive and put dir on any element. Components inside, and the overlays they open, take that direction instead of the document one.',
      codeBlockData: DIR_DIRECTIVE_BLOCK,
    },
    {
      title: 'Let the CLI do it',
      subtitle:
        'zard-cli init asks whether your app reads right to left, and --rtl / --no-rtl answer the question up front. Nothing is inferred from your project: the answer is yours.',
      codeBlockData: CLI_INIT_BLOCK,
    },
    {
      title: 'The choice is recorded',
      subtitle:
        'With RTL on, init writes "rtl": true to components.json and sets dir="rtl" on the html tag of your index.html. The component files you install are identical either way.',
      codeBlockData: CLI_CONFIG_BLOCK,
    },
  ];

  readonly fontSteps: Step[] = [
    {
      title: 'Install the font',
      subtitle: 'Use Fontsource. For Hebrew, install @fontsource-variable/noto-sans-hebrew instead.',
      codeTabData: FONTS_INSTALL_TABS,
    },
    {
      title: 'Import it and set --font-sans',
      subtitle: 'Import the font in your global stylesheet and point the Tailwind font token at it.',
      codeBlockData: FONTS_CSS_BLOCK,
    },
  ];

  readonly migrateSteps: Step[] = [
    {
      title: 'Add the components again',
      subtitle:
        'Components installed before the RTL work still have physical classes. Re-adding them with --overwrite replaces the files with the logical versions. Commit or stash your local edits first, because the overwrite is complete.',
      codeTabData: MIGRATE_ADD_TABS,
    },
    {
      title: 'Update the pieces that are not a plain file copy',
      subtitle:
        'Sidebar, calendar and pagination also carry behavior or labels you may have customized. Re-add them, then check their RTL examples: the sidebar docks to the inline-start edge, the calendar mirrors its week and navigation, and pagination takes translated labels.',
      codeBlockData: [MIGRATE_PAGINATION_BLOCK, MIGRATE_PAGINATION_PARTS_BLOCK],
    },
    {
      title: 'Flip custom directional icons',
      subtitle:
        'Icons that point along the reading direction, like an arrow or a chevron you added yourself, need the rtl:rotate-180 class. The icons inside zard components already have it.',
      codeBlockData: MIGRATE_ICON_BLOCK,
    },
  ];

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'get-started', label: 'Get started', type: 'core' },
      { id: 'how-it-works', label: 'How it works', type: 'core' },
      { id: 'font-recommendations', label: 'Font recommendations', type: 'core' },
      { id: 'animations', label: 'Animations', type: 'core' },
      { id: 'migrating', label: 'Migrating existing components', type: 'core' },
    ],
  };

  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'RTL',
      'Right-to-left support for ZardUI components: set the direction, pick a font and migrate existing components.',
      '/docs/rtl',
      'og-rtl.jpg',
    );
  }
}
