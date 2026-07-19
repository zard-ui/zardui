import { Component } from '@angular/core';

import { BLOCK_0, BLOCK_1, BLOCK_2, TABS_3, TABS_4, TABS_5, TABS_6, TABS_7 } from '@generated/pages/cli/commands';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import { CodeTabsComponent } from '@highlight/components/code-tabs/code-tabs.component';
import type { CodeBlockData, CodeTabData } from '@highlight/types';

@Component({
  selector: 'cli-commands-section',
  standalone: true,
  imports: [CodeBlockComponent, CodeTabsComponent],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">Commands</h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Initialize your project and install dependencies for ZardUI components.
    </p>

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <strong>Usage:</strong>
    </p>
    <z-code-block [data]="initUsage" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <strong>Options:</strong>
    </p>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">-y, --yes</code>
      - Skip confirmation prompts
    </p>

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <strong>Interactive Setup:</strong>
    </p>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      When you run the init command, you'll be guided through the following prompts:
    </p>
    <z-code-block [data]="initPrompts" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      After answering the prompts, the CLI will:
    </p>
    <z-code-block [data]="initResult" />

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">add</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Add components to your project with automatic dependency management.
    </p>

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <strong>Usage:</strong>
    </p>
    <z-code-tabs [data]="addUsageTabs" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <strong>Options:</strong>
    </p>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">-y, --yes</code>
      - Skip confirmation prompts
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">-o, --overwrite</code>
      - Overwrite existing files
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">-a, --all</code>
      - Add all available components
    </p>

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <strong>Examples:</strong>
    </p>
    <z-code-tabs [data]="addExampleTabs" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">Add multiple components:</p>
    <z-code-tabs [data]="addMultipleTabs" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Add all available components:
    </p>
    <z-code-tabs [data]="addAllTabs" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Interactive component selection:
    </p>
    <z-code-tabs [data]="addInteractiveTabs" />
  `,
})
export class CliCommandsSection {
  readonly initUsage: CodeBlockData = BLOCK_0;
  readonly initPrompts: CodeBlockData = BLOCK_1;
  readonly initResult: CodeBlockData = BLOCK_2;
  readonly addUsageTabs: CodeTabData = TABS_3;
  readonly addExampleTabs: CodeTabData = TABS_4;
  readonly addMultipleTabs: CodeTabData = TABS_5;
  readonly addAllTabs: CodeTabData = TABS_6;
  readonly addInteractiveTabs: CodeTabData = TABS_7;
}
