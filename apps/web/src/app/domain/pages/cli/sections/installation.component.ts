import { Component } from '@angular/core';

import { TABS_0, BLOCK_1, BLOCK_2, BLOCK_3, TABS_4, BLOCK_5 } from '@generated/pages/cli/installation';
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
      Get zard/ui up and running in your project with these steps.
    </p>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Step 1: Initialize your project</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Run the init command to set up zard/ui. It installs the dependencies, writes the theme tokens, wires Tailwind into
      your build and configures the import aliases.
    </p>
    <z-code-tabs [data]="initTabs" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The first question is what kind of project you are setting up. Everything after it follows from that answer —
      which files get configured, and where the components will live.
    </p>
    <z-code-block [data]="initMenu" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Answered questions stay on screen as a transcript, and the paths suggested from there on come from the project you
      picked:
    </p>
    <z-code-block [data]="initPrompt" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Text fields are fully editable: arrows and
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">Home</code>
      /
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">End</code>
      move the caret,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">Delete</code>
      and
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">Backspace</code>
      cut on either side of it, and
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">Ctrl+W</code>
      drops the previous word. The first keystroke replaces the whole suggestion — press
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">←</code>
      first if you would rather edit it.
    </p>

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Once everything is answered, the steps run with live progress. Steps that take a while — installing dependencies,
      usually — show how long they have been running, so a spinner is never mistaken for a stuck process.
    </p>
    <z-code-block [data]="initRun" />

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Step 2: Add components</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Add one component, several at once, or every available one. Dependencies between components are resolved for you:
      asking for a component pulls in whatever it needs.
    </p>
    <z-code-tabs [data]="addTabs" />

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Step 3: Import and use</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Import the components in your standalone components and start using them in your templates.
    </p>
    <z-code-block [data]="usageExample" />
  `,
})
export class CliInstallationSection {
  readonly initTabs: CodeTabData = TABS_0;
  readonly initMenu: CodeBlockData = BLOCK_1;
  readonly initPrompt: CodeBlockData = BLOCK_2;
  readonly initRun: CodeBlockData = BLOCK_3;
  readonly addTabs: CodeTabData = TABS_4;
  readonly usageExample: CodeBlockData = BLOCK_5;
}
