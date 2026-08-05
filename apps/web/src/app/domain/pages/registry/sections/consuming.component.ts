import { Component } from '@angular/core';

import { BLOCK_1, TABS_0 } from '@generated/pages/registry/consuming';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import { CodeTabsComponent } from '@highlight/components/code-tabs/code-tabs.component';
import type { CodeBlockData, CodeTabData } from '@highlight/types';

@Component({
  selector: 'registry-consuming-section',
  standalone: true,
  imports: [CodeBlockComponent, CodeTabsComponent],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">
      Consuming the registry
    </h2>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">With the CLI</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The CLI is the intended client. It fetches the index, resolves the item and its dependencies, rewrites the imports
      and writes the files into your project.
    </p>
    <z-code-tabs [data]="addTabs" />
    <ul class="text-muted-foreground list-disc space-y-2 pl-6 text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <li>The index is cached in memory for 5 minutes within a single CLI run.</li>
      <li>
        HTTP requests time out after 30 seconds and are retried up to 3 times, with an exponential backoff starting at 1
        second.
      </li>
      <li>
        A
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">429</code>
        response is honoured: the CLI waits for the number of seconds given in the
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">Retry-After</code>
        header before trying again.
      </li>
      <li>
        A response that looks like HTML is rejected with an explicit error instead of being parsed, which keeps proxy
        and error pages from being mistaken for registry data.
      </li>
    </ul>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">From the MCP server</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The MCP server reads the same endpoints, with its own 5 minute cache for the indexes and a 10 second request
      timeout. It is the consumer that surfaces the
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">docs</code>
      and
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">demos</code>
      fields of an item, so an AI assistant can read the documentation and the examples of a component alongside its
      source code.
    </p>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Over plain HTTP</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Nothing about the registry is specific to the CLI. The files are public, static and served with permissive CORS,
      so any tool that can perform a GET request can read them.
    </p>
    <z-code-block [data]="curlExample" />
  `,
})
export class RegistryConsumingSection {
  readonly addTabs: CodeTabData = TABS_0;
  readonly curlExample: CodeBlockData = BLOCK_1;
}
