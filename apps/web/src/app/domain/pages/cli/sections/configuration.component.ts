import { Component } from '@angular/core';

import { BLOCK_0, BLOCK_1, BLOCK_2 } from '@generated/pages/cli/configuration';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

@Component({
  selector: 'cli-configuration-section',
  standalone: true,
  imports: [CodeBlockComponent],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">
      Configuration
    </h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The CLI stores configuration in
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">components.json</code>
      in your project root. This file is created automatically when you run
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">npx zard-cli init</code>
      .
    </p>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Default Configuration</h3>
    <z-code-block [data]="defaultConfig" />

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">TypeScript Path Mappings</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The CLI automatically configures TypeScript path mappings in your
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">tsconfig.json</code>
      :
    </p>
    <z-code-block [data]="tsConfig" />
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      This allows you to import components and utilities using clean paths:
    </p>
    <z-code-block [data]="importExample" />
  `,
})
export class CliConfigurationSection {
  readonly defaultConfig: CodeBlockData = BLOCK_0;
  readonly tsConfig: CodeBlockData = BLOCK_1;
  readonly importExample: CodeBlockData = BLOCK_2;
}
