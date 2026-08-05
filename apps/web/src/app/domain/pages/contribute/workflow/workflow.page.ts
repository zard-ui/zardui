import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';

import {
  BLOCK_0 as BRANCH_BLOCK,
  BLOCK_1 as PRE_PUSH_BLOCK,
  BLOCK_2 as COMMIT_BLOCK,
} from '@generated/pages/contribute/workflow';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

import { CalloutComponent } from '@doc/domain/components/callout/callout.component';
import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { SeoService } from '@doc/shared/services/seo.service';

interface CommitType {
  emoji: string;
  type: string;
  description: string;
  bump: string;
}

interface RejectionReason {
  reason: string;
  fix: string;
}

interface CiJob {
  job: string;
  command: string;
}

@Component({
  selector: 'z-contribute-workflow',
  imports: [
    CodeBlockComponent,
    CalloutComponent,
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
  ],
  templateUrl: './workflow.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributeWorkflowPage implements OnInit {
  activeAnchor?: string;

  private readonly seoService = inject(SeoService);

  readonly branchBlock: CodeBlockData = BRANCH_BLOCK;
  readonly prePushBlock: CodeBlockData = PRE_PUSH_BLOCK;
  readonly commitBlock: CodeBlockData = COMMIT_BLOCK;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'branches', label: 'Branches', type: 'custom' },
      { id: 'commits', label: 'Commit Format', type: 'custom' },
      { id: 'rejections', label: 'Why Commits Are Rejected', type: 'custom' },
      { id: 'pull-request', label: 'Pull Request', type: 'custom' },
      { id: 'ci', label: 'What the CI Runs', type: 'custom' },
    ],
  };

  readonly commitTypes: CommitType[] = [
    { emoji: '✨', type: 'feat', description: 'A new feature', bump: 'minor' },
    { emoji: '🐛', type: 'fix', description: 'A bug fix', bump: 'patch' },
    { emoji: '🚀', type: 'perf', description: 'A performance improvement', bump: 'patch' },
    { emoji: '⏪️', type: 'revert', description: 'Reverts a previous commit', bump: 'patch' },
    {
      emoji: '📦',
      type: 'refactor',
      description: 'A change that neither fixes a bug nor adds a feature',
      bump: 'none',
    },
    { emoji: '📝', type: 'docs', description: 'Documentation only', bump: 'none' },
    { emoji: '💄', type: 'style', description: 'Formatting, no behaviour change', bump: 'none' },
    { emoji: '🧪', type: 'test', description: 'Adding or fixing tests', bump: 'none' },
    { emoji: '🏗️', type: 'build', description: 'Build system or dependencies', bump: 'none' },
    { emoji: '🔧', type: 'ci', description: 'CI configuration and scripts', bump: 'none' },
    { emoji: '🚧', type: 'chore', description: 'Anything that does not touch src or tests', bump: 'none' },
  ];

  readonly rejections: RejectionReason[] = [
    { reason: 'No emoji at the start of the header', fix: 'Prefix the message with the emoji for your type.' },
    { reason: 'A type outside the allowed list', fix: 'Use one of the types in the table above, in lower case.' },
    { reason: 'Subject shorter than 10 characters', fix: 'Describe the change, do not just name the area.' },
    { reason: 'Subject longer than 72 characters', fix: 'Move the detail to the commit body.' },
    { reason: 'Subject ending with a period', fix: 'Drop the trailing period.' },
    { reason: 'Header longer than 100 characters', fix: 'Shorten the scope or the subject.' },
    { reason: 'A body line longer than 100 characters', fix: 'Wrap the body.' },
  ];

  readonly prChecklist: string[] = [
    'The pull request targets master.',
    'The title follows the same emoji + type + subject format as the commits.',
    'The related issue is linked.',
    'Unit tests pass locally: npm test.',
    'The full build passes: npm run build.',
    'E2E specs were updated if a component or its first demo changed.',
    'Generated files that your change produced are committed.',
    'Screenshots or a GIF are attached when the change is visual.',
  ];

  readonly ciJobs: CiJob[] = [
    { job: 'commitlint', command: 'Validates every commit message in the pull request, failing on warnings.' },
    { job: 'lint', command: 'npx nx run-many --target=lint --p=zard,blocks --parallel' },
    { job: 'build', command: 'npm run build' },
    { job: 'test', command: 'npm test — runs after build' },
    { job: 'e2e', command: 'npx nx e2e web-e2e — runs after build, uploads the Playwright report' },
  ];

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Workflow',
      'From issue to merge: branch naming, the mandatory emoji commit format, why commitlint rejects a message, the PR checklist and the CI jobs.',
      '/docs/contribute/workflow',
      'og-contribute-workflow.jpg',
    );
  }
}
