import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';

import {
  BLOCK_0 as TOOLCHAIN_BLOCK,
  BLOCK_1 as INSTALL_BLOCK,
  BLOCK_2 as START_BLOCK,
  BLOCK_3 as ENV_BLOCK,
  BLOCK_4 as TROUBLESHOOTING_BLOCK,
} from '@generated/pages/contribute/setup';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

import { CalloutComponent } from '@doc/domain/components/callout/callout.component';
import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { SeoService } from '@doc/shared/services/seo.service';

interface CommandRow {
  command: string;
  description: string;
}

@Component({
  selector: 'z-contribute-setup',
  imports: [
    CodeBlockComponent,
    CalloutComponent,
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
  ],
  templateUrl: './setup.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributeSetupPage implements OnInit {
  activeAnchor?: string;

  private readonly seoService = inject(SeoService);

  readonly toolchainBlock: CodeBlockData = TOOLCHAIN_BLOCK;
  readonly installBlock: CodeBlockData = INSTALL_BLOCK;
  readonly startBlock: CodeBlockData = START_BLOCK;
  readonly envBlock: CodeBlockData = ENV_BLOCK;
  readonly troubleshootingBlock: CodeBlockData = TROUBLESHOOTING_BLOCK;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'requirements', label: 'Requirements', type: 'custom' },
      { id: 'install', label: 'Fork & Install', type: 'custom' },
      { id: 'dev-server', label: 'Development Server', type: 'custom' },
      { id: 'git-hooks', label: 'Git Hooks', type: 'custom' },
      { id: 'commands', label: 'Essential Commands', type: 'custom' },
      { id: 'troubleshooting', label: 'Troubleshooting', type: 'custom' },
    ],
  };

  readonly developmentCommands: CommandRow[] = [
    { command: 'npm start', description: 'Pre-builds the code blocks, then serves the docs site on port 4222.' },
    {
      command: 'npm run build',
      description: 'The full production pipeline — exactly what the CI runs on every pull request.',
    },
    { command: 'npm run serve:ssr', description: 'Serves the built SSR server from dist/apps/web.' },
  ];

  readonly generationCommands: CommandRow[] = [
    { command: 'npm run generate:component', description: 'Scaffolds a new component in libs/zard.' },
    { command: 'npm run generate:block', description: 'Scaffolds a new block in libs/blocks.' },
    {
      command: 'npm run generate:highlight',
      description: 'Regenerates every highlighted code block under apps/web/src/generated/.',
    },
    { command: 'npm run generate:md', description: 'Writes the per-component Markdown into apps/web/public/docs/.' },
    {
      command: 'npm run generate:md:docs',
      description: 'Converts the prerendered pages to Markdown. Runs after the build.',
    },
    { command: 'npm run sync:blocks', description: 'Rewrites the files[] array of every block from its sources.' },
    { command: 'npm run build:registry', description: 'Builds the registry served to the CLI and the MCP server.' },
  ];

  readonly qualityCommands: CommandRow[] = [
    { command: 'npm test', description: 'Runs the Jest suites of every project under libs/.' },
    { command: 'npm run test:watch', description: 'Same, in watch mode.' },
    { command: 'npm run e2e', description: 'Runs the Playwright suite, booting the local dev server automatically.' },
    { command: 'npm run e2e:ui', description: 'Opens the interactive Playwright UI.' },
    {
      command: 'npx nx run-many --target=lint --p=zard,blocks',
      description: 'The lint job the CI runs.',
    },
  ];

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Setup',
      'Fork, clone and run Zard UI locally: requirements, the dev server on port 4222, git hooks and the commands you will actually use.',
      '/docs/contribute/setup',
      'og-contribute-setup.jpg',
    );
  }
}
