import { Component } from '@angular/core';

import { MCP_CLAUDE_CODE } from '@generated/documentation/mcp/claude-code';
import { MCP_CLAUDE_CODE_JSON } from '@generated/documentation/mcp/claude-code-json';
import { MCP_CLAUDE_DESKTOP } from '@generated/documentation/mcp/claude-desktop';
import { MCP_CURSOR } from '@generated/documentation/mcp/cursor';
import { MCP_VERIFY } from '@generated/documentation/mcp/verify';
import { MCP_VSCODE } from '@generated/documentation/mcp/vscode';
import { MCP_WINDSURF } from '@generated/documentation/mcp/windsurf';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

import { CalloutComponent } from '@doc/domain/components/callout/callout.component';

@Component({
  selector: 'z-mcp-installation-section',
  standalone: true,
  imports: [CodeBlockComponent, CalloutComponent],
  template: `
    <section class="flex flex-col gap-6 sm:gap-8">
      <div class="flex flex-col gap-4 sm:gap-6">
        <h2
          class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 sm:text-3xl lg:mt-20"
        >
          Installation
        </h2>
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          There is nothing to install globally. Every client below runs the server on demand with
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">npx</code>
          , so you always get the latest published version.
        </p>
      </div>

      <z-callout title="Requirements" icon="ℹ" variant="muted">
        Node.js 20 or newer, and an MCP-capable client. The
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">install-component</code>
        tool also requires the ZardUI CLI to be initialized in the target project.
      </z-callout>

      <div class="flex flex-col gap-8 sm:gap-10">
        <div id="client-claude-code" class="flex scroll-mt-20 flex-col gap-4">
          <h3 class="text-lg font-medium sm:text-xl lg:text-2xl">Claude Code</h3>
          <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
            Register the server with a single command:
          </p>
          <z-code-block [data]="claudeCode" />
          <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
            Prefer to commit the configuration with your project? Create a
            <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">.mcp.json</code>
            file at the repository root instead — everyone on the team gets the server automatically.
          </p>
          <z-code-block [data]="claudeCodeJson" />
        </div>

        <div id="client-claude-desktop" class="flex scroll-mt-20 flex-col gap-4">
          <h3 class="text-lg font-medium sm:text-xl lg:text-2xl">Claude Desktop</h3>
          <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
            Open
            <strong>Settings → Developer → Edit Config</strong>
            and add the server to
            <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">claude_desktop_config.json</code>
            .
          </p>
          <z-code-block [data]="claudeDesktop" />
        </div>

        <div id="client-cursor" class="flex scroll-mt-20 flex-col gap-4">
          <h3 class="text-lg font-medium sm:text-xl lg:text-2xl">Cursor</h3>
          <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
            Add the server to
            <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">.cursor/mcp.json</code>
            for a single project, or to
            <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">~/.cursor/mcp.json</code>
            to enable it everywhere.
          </p>
          <z-code-block [data]="cursor" />
        </div>

        <div id="client-vscode" class="flex scroll-mt-20 flex-col gap-4">
          <h3 class="text-lg font-medium sm:text-xl lg:text-2xl">VS Code</h3>
          <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
            GitHub Copilot reads MCP servers from
            <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">.vscode/mcp.json</code>
            . Note the
            <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">servers</code>
            key and the explicit transport type.
          </p>
          <z-code-block [data]="vscode" />
        </div>

        <div id="client-windsurf" class="flex scroll-mt-20 flex-col gap-4">
          <h3 class="text-lg font-medium sm:text-xl lg:text-2xl">Windsurf</h3>
          <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
            Edit
            <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">~/.codeium/windsurf/mcp_config.json</code>
            and add the server under
            <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">mcpServers</code>
            .
          </p>
          <z-code-block [data]="windsurf" />
        </div>

        <div id="client-verify" class="flex scroll-mt-20 flex-col gap-4">
          <h3 class="text-lg font-medium sm:text-xl lg:text-2xl">Verify the connection</h3>
          <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
            Restart your client — MCP servers are only loaded at startup. In Claude Code you can confirm the server is
            reachable with:
          </p>
          <z-code-block [data]="verify" />
          <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
            In the other clients, open the MCP panel and check that
            <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">zard-ui</code>
            lists nine tools.
          </p>
        </div>
      </div>
    </section>
  `,
})
export class McpInstallationSectionComponent {
  readonly claudeCode: CodeBlockData = MCP_CLAUDE_CODE;
  readonly claudeCodeJson: CodeBlockData = MCP_CLAUDE_CODE_JSON;
  readonly claudeDesktop: CodeBlockData = MCP_CLAUDE_DESKTOP;
  readonly cursor: CodeBlockData = MCP_CURSOR;
  readonly vscode: CodeBlockData = MCP_VSCODE;
  readonly windsurf: CodeBlockData = MCP_WINDSURF;
  readonly verify: CodeBlockData = MCP_VERIFY;
}
