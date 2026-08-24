import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BLOCK_0, BLOCK_1, BLOCK_2, BLOCK_3 } from '@generated/pages/cli/configuration';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

@Component({
  selector: 'z-cli-configuration-section',
  imports: [CodeBlockComponent, RouterLink],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">
      Configuration
    </h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The CLI stores configuration in
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">components.json</code>
      in your project root. This file is created automatically when you run
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">npx zard-cli init</code>
      , and the
      <a class="text-foreground underline underline-offset-4" routerLink="/docs/components-json">
        components.json page
      </a>
      documents every field.
    </p>
    <z-code-block [data]="defaultConfig" />

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">TypeScript path mappings</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The CLI maps the import alias for you, in whichever tsconfig your project type actually extends —
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">tsconfig.base.json</code>
      on Nx,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">tsconfig.json</code>
      elsewhere:
    </p>
    <z-code-block [data]="tsConfig" />
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      No
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">baseUrl</code>
      is written: the option became an error in TypeScript 6, and since 4.1 paths resolve relative to the tsconfig
      itself without it. Projects that already declare it are respected, with the mapping written relative to it.
    </p>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      This is what lets you import components and utilities through clean paths:
    </p>
    <z-code-block [data]="importExample" />

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Custom registry</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      An optional
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">registryUrl</code>
      points the CLI at a registry other than the official one — for teams publishing their own component set.
    </p>
    <z-code-block [data]="registryExample" />
  `,
})
export class CliConfigurationSectionComponent {
  readonly defaultConfig: CodeBlockData = BLOCK_0;
  readonly tsConfig: CodeBlockData = BLOCK_1;
  readonly importExample: CodeBlockData = BLOCK_2;
  readonly registryExample: CodeBlockData = BLOCK_3;
}
