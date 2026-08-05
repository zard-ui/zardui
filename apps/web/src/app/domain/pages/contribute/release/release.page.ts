import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';

import { BLOCK_0 as PIPELINE_BLOCK, BLOCK_1 as DRY_RUN_BLOCK } from '@generated/pages/contribute/release';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

import { CalloutComponent } from '@doc/domain/components/callout/callout.component';
import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { SeoService } from '@doc/shared/services/seo.service';

interface PipelineStage {
  step: string;
  title: string;
  description: string;
}

interface BumpRule {
  commits: string;
  bump: string;
}

interface PackageEntry {
  name: string;
  workflow: string;
  trigger: string;
}

@Component({
  selector: 'z-contribute-release',
  imports: [
    CodeBlockComponent,
    CalloutComponent,
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
  ],
  templateUrl: './release.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributeReleasePage implements OnInit {
  activeAnchor?: string;

  private readonly seoService = inject(SeoService);

  readonly pipelineBlock: CodeBlockData = PIPELINE_BLOCK;
  readonly dryRunBlock: CodeBlockData = DRY_RUN_BLOCK;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'pipeline', label: 'The Pipeline', type: 'custom' },
      { id: 'version-bump', label: 'Version Bump', type: 'custom' },
      { id: 'packages', label: 'Published Packages', type: 'custom' },
      { id: 'your-part', label: 'Your Part', type: 'custom' },
    ],
  };

  readonly stages: PipelineStage[] = [
    {
      step: '1',
      title: 'A pull request is squash-merged into master',
      description:
        'The deploy workflow triggers on every push to master, unless the commit message contains [skip ci] — which is how release commits avoid looping.',
    },
    {
      step: '2',
      title: 'Build and test',
      description: 'The workflow reinstalls dependencies from the lockfile, runs npm run build, then npm test.',
    },
    {
      step: '3',
      title: 'Registry refresh',
      description:
        'npm run build:registry regenerates apps/web/public/r, and any change is committed as a [skip ci] chore.',
    },
    {
      step: '4',
      title: 'Version and changelog',
      description:
        'nx release version computes the bump from the commit types, then nx release changelog updates CHANGELOG.md. The conventional-commit mapping lives in nx.json.',
    },
    {
      step: '5',
      title: 'Commit, tag and publish',
      description:
        'The workflow commits 🔖 chore(release): publish v<version> [skip ci], tags it v<version>, and publishes the CLI to npm with provenance under the latest or beta tag.',
    },
    {
      step: '6',
      title: 'GitHub release and notification',
      description: 'A GitHub release is created with generated notes, and a Discord webhook announces it.',
    },
  ];

  readonly bumpRules: BumpRule[] = [
    { commits: 'Any commit marked with !', bump: 'major' },
    { commits: 'At least one feat', bump: 'minor' },
    { commits: 'fix, perf or revert only', bump: 'patch' },
    { commits: 'docs, refactor, test, build, ci, style or chore only', bump: 'none' },
  ];

  readonly packages: PackageEntry[] = [
    {
      name: 'zard-cli',
      workflow: '.github/workflows/release.yml',
      trigger: 'Automatic, on every push to master.',
    },
    {
      name: 'zard (library)',
      workflow: '.github/workflows/release.yml',
      trigger: 'Versioned together with the CLI — nx.json releases both as a fixed group.',
    },
    {
      name: 'zard-mcp',
      workflow: '.github/workflows/release-mcp.yml',
      trigger: 'Manual, through workflow_dispatch. Tagged mcp-v<version>.',
    },
  ];

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Release',
      'How Zard UI releases itself after a merge to master: nx release, the version bump derived from commits, the npm publish and what a contributor has to do.',
      '/docs/contribute/release',
      'og-contribute-release.jpg',
    );
  }
}
