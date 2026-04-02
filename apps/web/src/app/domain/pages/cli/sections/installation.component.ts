import { Component } from '@angular/core';

import { TABS_0, BLOCK_1, TABS_2, BLOCK_3, BLOCK_4 } from '@generated/pages/cli/installation';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import { CodeTabsComponent } from '@highlight/components/code-tabs/code-tabs.component';
import type { CodeBlockData, CodeTabData } from '@highlight/types';

@Component({
  selector: 'cli-installation-section',
  imports: [CodeBlockComponent, CodeTabsComponent],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">
      Installation
    </h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Get ZardUI up and running in your Angular project with these simple steps.
    </p>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Step 1: Initialize your project</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Run the init command to set up ZardUI in your Angular project. This will configure Tailwind CSS, install
      dependencies, and create necessary utility files.
    </p>
    <z-code-tabs [data]="initTabs" />
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The init command will guide you through an interactive setup:
    </p>
    <z-code-block [data]="initTerminal" />

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Step 2: Add components</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Start adding components to your project. You can add individual components, multiple components at once, or all
      available components.
    </p>
    <z-code-tabs [data]="addTabs" />
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">Expected output:</p>
    <z-code-block [data]="addOutput" />

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Step 3: Import and use</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Import the components in your Angular modules or standalone components and start using them in your templates.
    </p>
    <z-code-block [data]="usageExample" />
  `,
})
export class CliInstallationSection {
  readonly initTabs: CodeTabData = TABS_0;
  readonly initTerminal: CodeBlockData = BLOCK_1;
  readonly addTabs: CodeTabData = TABS_2;
  readonly addOutput: CodeBlockData = BLOCK_3;
  readonly usageExample: CodeBlockData = BLOCK_4;
}
