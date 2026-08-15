import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BLOCK_0 } from '@generated/pages/mcp/configuration';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

@Component({
  selector: 'mcp-configuration-section',
  standalone: true,
  imports: [CodeBlockComponent, RouterLink],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">
      Configuration
    </h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Two environment variables, both optional, for teams serving their own components.
    </p>

    <div class="my-6 w-full overflow-x-auto rounded-md border">
      <table class="w-full caption-bottom text-sm">
        <thead class="[&_tr]:text-primary bg-neutral-100 dark:bg-neutral-800">
          <tr>
            <th class="h-12 px-4 text-left align-middle font-medium">Variable</th>
            <th class="h-12 px-4 text-left align-middle font-medium">Default</th>
            <th class="h-12 px-4 text-left align-middle font-medium">Description</th>
          </tr>
        </thead>
        <tbody class="bg-accent/20 [&_tr:last-child]:border-0">
          <tr class="hover:bg-muted/50 border-b transition-colors">
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs whitespace-nowrap sm:text-sm">ZARD_REGISTRY_URL</code>
            </td>
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">https://zardui.com/r</code>
            </td>
            <td class="text-muted-foreground p-4 align-middle">
              Where component source and metadata are read from. See the
              <a class="text-foreground underline underline-offset-4" routerLink="/docs/registry">registry page</a>
              for the format a custom one has to publish.
            </td>
          </tr>
          <tr class="hover:bg-muted/50 border-b transition-colors">
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs whitespace-nowrap sm:text-sm">ZARD_DOCS_URL</code>
            </td>
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">https://zardui.com</code>
            </td>
            <td class="text-muted-foreground p-4 align-middle">
              The site the documentation pages are read from, as
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">/docs/components/&lt;name&gt;.md</code>
              . Separate from the registry because a custom registry serves files, not pages.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <z-code-block [data]="envExample" />
  `,
})
export class McpConfigurationSection {
  readonly envExample: CodeBlockData = BLOCK_0;
}
