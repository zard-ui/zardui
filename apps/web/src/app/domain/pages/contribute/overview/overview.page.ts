import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BLOCK_0 as QUICK_START } from '@generated/pages/contribute/overview';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';
import { type IconName, NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBlocks,
  lucideBookOpen,
  lucideBug,
  lucideComponent,
  lucideFlaskConical,
  lucideMail,
  lucideMessageCircle,
  lucideCircleDot,
  lucideTerminal,
} from '@ng-icons/lucide';

import { CalloutComponent } from '@doc/domain/components/callout/callout.component';
import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { CONTRIBUTE_PATH } from '@doc/shared/constants/routes.constant';
import { SeoService } from '@doc/shared/services/seo.service';

import { ZardCardComponent } from '@zard/components/card/card.component';

interface ContributionType {
  icon: IconName;
  title: string;
  description: string;
}

interface QuickStartStep {
  step: string;
  title: string;
  description: string;
  link?: { label: string; path: string };
}

interface HelpChannel {
  icon: IconName;
  title: string;
  description: string;
  href: string;
}

@Component({
  selector: 'z-contribute-overview',
  imports: [
    RouterLink,
    CodeBlockComponent,
    CalloutComponent,
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    ZardCardComponent,
    NgIcon,
  ],
  templateUrl: './overview.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideBlocks,
      lucideBookOpen,
      lucideBug,
      lucideComponent,
      lucideFlaskConical,
      lucideMail,
      lucideMessageCircle,
      lucideCircleDot,
      lucideTerminal,
    }),
  ],
})
export class ContributeOverviewPage implements OnInit {
  activeAnchor?: string;

  private readonly seoService = inject(SeoService);

  readonly quickStartBlock: CodeBlockData = QUICK_START;

  /** Every page of this module, straight from the sidebar definition. */
  readonly moduleMap = CONTRIBUTE_PATH.data.filter(item => item.path !== '/docs/contribute');

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'ways-to-contribute', label: 'Ways to Contribute', type: 'custom' },
      { id: 'quick-start', label: 'Quick Start', type: 'custom' },
      { id: 'guide-map', label: 'Guide Map', type: 'custom' },
      { id: 'getting-help', label: 'Getting Help', type: 'custom' },
    ],
  };

  readonly contributionTypes: ContributionType[] = [
    {
      icon: 'lucideComponent',
      title: 'Components',
      description:
        'Add a component to libs/zard, or extend an existing one with a new variant, input or accessibility fix.',
    },
    {
      icon: 'lucideBlocks',
      title: 'Blocks',
      description: 'Compose existing components into a ready-to-paste screen under libs/blocks.',
    },
    {
      icon: 'lucideBug',
      title: 'Bug fixes',
      description: 'Pick an open issue, reproduce it in a demo, fix it and cover the behaviour with a test.',
    },
    {
      icon: 'lucideFlaskConical',
      title: 'Tests',
      description: 'Raise coverage with Jest unit tests or Playwright E2E specs — no new feature required.',
    },
    {
      icon: 'lucideBookOpen',
      title: 'Documentation',
      description: 'Improve a docs page, an API reference or the Markdown sources that feed the code blocks.',
    },
    {
      icon: 'lucideTerminal',
      title: 'CLI & MCP',
      description: 'Work on zard-cli or the zard-mcp server under packages/, both published from this monorepo.',
    },
  ];

  readonly quickStartSteps: QuickStartStep[] = [
    {
      step: '1',
      title: 'Set up the repository',
      description: 'Fork, clone, install dependencies and start the documentation site on port 4222.',
      link: { label: 'Setup', path: '/docs/contribute/setup' },
    },
    {
      step: '2',
      title: 'Learn the layout',
      description: 'Understand which project owns what, and where the file you need to touch lives.',
      link: { label: 'Architecture', path: '/docs/contribute/architecture' },
    },
    {
      step: '3',
      title: 'Build something',
      description: 'Scaffold a component or a block with the Nx generators and fill in the real implementation.',
      link: { label: 'Components', path: '/docs/contribute/components' },
    },
    {
      step: '4',
      title: 'Prove it works',
      description: 'Run the unit tests, the linter and the full build before opening a pull request.',
      link: { label: 'Testing', path: '/docs/contribute/testing' },
    },
    {
      step: '5',
      title: 'Ship it',
      description: 'Commit with the mandatory emoji format, open a PR against master and let the CI run.',
      link: { label: 'Workflow', path: '/docs/contribute/workflow' },
    },
  ];

  readonly helpChannels: HelpChannel[] = [
    {
      icon: 'lucideCircleDot',
      title: 'Issues',
      description: 'Report a bug or request a feature. Good first issues are labelled.',
      href: 'https://github.com/zard-ui/zardui/issues',
    },
    {
      icon: 'lucideMessageCircle',
      title: 'Discussions',
      description: 'Ask questions, share ideas and discuss proposals before writing code.',
      href: 'https://github.com/zard-ui/zardui/discussions',
    },
    {
      icon: 'lucideMail',
      title: 'Email',
      description: 'For anything that does not fit a public thread.',
      href: 'mailto:gomesluiz.dev@gmail.com',
    },
  ];

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Contribute',
      'Everything you need to contribute to Zard UI: setup, architecture, generators, testing, commit rules and release automation.',
      '/docs/contribute',
      'og-contribute-overview.jpg',
    );
  }
}
