import { Component } from '@angular/core';

import { MCP_REGISTRY_URL } from '@generated/documentation/mcp/registry-url';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

@Component({
  selector: 'z-mcp-configuration-section',
  standalone: true,
  imports: [CodeBlockComponent],
  template: `
    <section class="flex flex-col gap-6 sm:gap-8">
      <div class="flex flex-col gap-4 sm:gap-6">
        <h2
          class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 sm:text-3xl lg:mt-20"
        >
          Configuration
        </h2>
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          The server works with zero configuration. A single environment variable lets you point it somewhere else.
        </p>
      </div>

      <div class="my-2 overflow-auto rounded-md border">
        <table class="w-full caption-bottom text-sm">
          <thead class="[&_tr]:text-primary bg-neutral-100 dark:bg-neutral-800">
            <tr class="hover:bg-muted/50 transition-colors">
              <th class="h-12 px-4 text-left align-middle font-medium">Variable</th>
              <th class="h-12 px-4 text-left align-middle font-medium">Description</th>
              <th class="h-12 px-4 text-left align-middle font-medium">Default</th>
            </tr>
          </thead>
          <tbody class="bg-accent/20 [&_tr:last-child]:border-0">
            <tr class="hover:bg-muted/50 border-b transition-colors">
              <td class="p-4 text-left align-middle font-medium">
                <code class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono! text-sm font-semibold">
                  ZARD_REGISTRY_URL
                </code>
              </td>
              <td class="p-4 text-left align-middle font-medium">
                Base URL of the registry the server reads from. Point it to a private registry or to a local one during
                development.
              </td>
              <td class="p-4 text-left align-middle font-medium">
                <code class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono! text-sm font-semibold">
                  https://zardui.com/r
                </code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-col gap-4">
        <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
          Declare it in the
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">env</code>
          block of your client configuration:
        </p>
        <z-code-block [data]="registryUrl" />
      </div>
    </section>
  `,
})
export class McpConfigurationSectionComponent {
  readonly registryUrl: CodeBlockData = MCP_REGISTRY_URL;
}
