import { Component } from '@angular/core';

import { TABS_0, TABS_1 } from '@generated/pages/mcp/installation';
import { CodeTabsComponent } from '@highlight/components/code-tabs/code-tabs.component';
import type { CodeTabData } from '@highlight/types';

import { ZardButtonComponent } from '@zard/components/button/button.component';

const SERVER = { command: 'npx', args: ['-y', 'zard-mcp'] };

@Component({
  selector: 'z-mcp-installation-section',
  imports: [CodeTabsComponent, ZardButtonComponent],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">
      Installation
    </h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The server is published as
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">zard-mcp</code>
      and runs over stdio: your client starts it on demand, and it needs Node 20 or newer. Cursor and VS Code install it
      in one click.
    </p>
    <div class="mt-6 flex flex-wrap gap-2">
      <a z-button zType="outline" [href]="cursorUrl">Add to Cursor</a>
      <a z-button zType="outline" [href]="vscodeUrl" target="_blank" rel="noopener">Add to VS Code</a>
    </div>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">From the command line</h3>
    <z-code-tabs [data]="cliTabs" />

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">By configuration file</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Commit the project file and everyone on the repository gets the server.
    </p>
    <ul class="text-muted-foreground mt-4 ml-6 list-disc space-y-1 text-base leading-relaxed">
      @for (file of configFiles; track file.client) {
        <li>
          {{ file.client }}
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">{{ file.path }}</code>
        </li>
      }
    </ul>
    <z-code-tabs [data]="configTabs" />

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Check that it works</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Restart the client and look for
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">zard-ui</code>
      with ten tools. In Claude Code or Codex run
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">/mcp</code>
      to list servers; in Cursor and Windsurf open Settings → MCP; in VS Code press Start above the server in
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">mcp.json</code>
      to connect it.
    </p>
  `,
})
export class McpInstallationSectionComponent {
  readonly cliTabs: CodeTabData = TABS_0;
  readonly configTabs: CodeTabData = TABS_1;

  readonly configFiles = [
    { client: 'Claude Code', path: '.mcp.json' },
    { client: 'Cursor', path: '.cursor/mcp.json' },
    { client: 'VS Code', path: '.vscode/mcp.json' },
    { client: 'Windsurf', path: '~/.codeium/windsurf/mcp_config.json' },
    { client: 'Zed', path: 'settings.json' },
    { client: 'Codex', path: '~/.codex/config.toml' },
  ];

  readonly cursorUrl = `cursor://anysphere.cursor-deeplink/mcp/install?name=zard-ui&config=${btoa(JSON.stringify(SERVER))}`;
  readonly vscodeUrl = `https://vscode.dev/redirect/mcp/install?name=zard-ui&config=${encodeURIComponent(JSON.stringify(SERVER))}`;
}
