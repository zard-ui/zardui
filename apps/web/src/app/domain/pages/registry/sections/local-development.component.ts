import { Component } from '@angular/core';

import { BLOCK_0, BLOCK_1, BLOCK_2 } from '@generated/pages/registry/local-development';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

@Component({
  selector: 'registry-local-development-section',
  standalone: true,
  imports: [CodeBlockComponent],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">
      Running the registry locally
    </h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Working on a component means rebuilding the registry and serving it yourself. Three scripts cover that loop:
    </p>
    <z-code-block [data]="scripts" />
    <ul class="text-muted-foreground list-disc space-y-2 pl-6 text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <li>
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">build:registry</code>
        regenerates
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">apps/web/public/r/**</code>
        from the sources on disk.
      </li>
      <li>
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">serve:registry</code>
        serves those files at
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">http://localhost:4223/r</code>
        . If
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">apps/web/public/r</code>
        does not exist yet, it builds the registry first.
      </li>
      <li>
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">cli</code>
        chains the development build of the CLI and the local server, which is the usual entry point.
      </li>
    </ul>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The port defaults to
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">4223</code>
      and can be changed with the
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">REGISTRY_PORT</code>
      environment variable:
    </p>
    <z-code-block [data]="port" />
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The local server only serves
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">.json</code>
      files, sends
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">Access-Control-Allow-Origin: *</code>
      on every response, and mirrors production caching: items are immutable, while
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">registry.json</code>
      must be revalidated.
    </p>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Using the published CLI against it</h3>
    <z-code-block [data]="publishedCli" />
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The development build of the CLI already embeds
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">http://localhost:4223/r</code>
      as its default, while the production build embeds
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">https://zardui.com/r</code>
      . Both come from the same placeholder, replaced at build time.
    </p>
  `,
})
export class RegistryLocalDevelopmentSection {
  readonly scripts: CodeBlockData = BLOCK_0;
  readonly port: CodeBlockData = BLOCK_1;
  readonly publishedCli: CodeBlockData = BLOCK_2;
}
