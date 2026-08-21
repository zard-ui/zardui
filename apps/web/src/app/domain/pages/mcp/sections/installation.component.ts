import { Component } from '@angular/core';

import { TABS_0, BLOCK_1, BLOCK_2, BLOCK_3, BLOCK_4 } from '@generated/pages/mcp/installation';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import { CodeTabsComponent } from '@highlight/components/code-tabs/code-tabs.component';
import type { CodeBlockData, CodeTabData } from '@highlight/types';

@Component({
  selector: 'z-mcp-installation-section',
  imports: [CodeBlockComponent, CodeTabsComponent],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">
      Installation
    </h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The server is published as
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">zard-mcp</code>
      and speaks over stdio, so there is nothing to run or keep alive: your client starts it when it needs it. If your
      tool has a command for adding MCP servers, that is the shortest way in.
    </p>
    <z-code-tabs [data]="cliTabs" />

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">By configuration file</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Clients that read a project file use the same shape. Committing it to the repository is what makes the server
      available to everyone working on the project, rather than to whoever set it up.
    </p>
    <z-code-block [data]="projectConfig" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">Cursor reads its own file:</p>
    <z-code-block [data]="cursorConfig" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      VS Code uses a different key and asks for the transport explicitly:
    </p>
    <z-code-block [data]="vscodeConfig" />

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Check that it works</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Ask for something that only the registry can answer. If the assistant comes back with real component code instead
      of an invented API, the server is connected.
    </p>
    <z-code-block [data]="prompt" />
  `,
})
export class McpInstallationSectionComponent {
  readonly cliTabs: CodeTabData = TABS_0;
  readonly projectConfig: CodeBlockData = BLOCK_1;
  readonly cursorConfig: CodeBlockData = BLOCK_2;
  readonly vscodeConfig: CodeBlockData = BLOCK_3;
  readonly prompt: CodeBlockData = BLOCK_4;
}
