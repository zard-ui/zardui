import { Component } from '@angular/core';

import { CalloutComponent } from '@doc/domain/components/callout/callout.component';

@Component({
  selector: 'z-mcp-introduction-section',
  standalone: true,
  imports: [CalloutComponent],
  template: `
    <div class="flex flex-col gap-6 sm:gap-8">
      <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
        The
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">zard-mcp</code>
        server implements the
        <a
          href="https://modelcontextprotocol.io"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-foreground underline underline-offset-4"
        >
          Model Context Protocol
        </a>
        , the open standard that lets AI assistants talk to external tools. Once connected, your assistant reads the
        ZardUI registry directly instead of guessing an API from memory.
      </p>
      <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
        It exposes nine tools to list, search, read and install components and blocks — always against the same registry
        the CLI uses, so the code your assistant writes matches the version you actually install.
      </p>

      <z-callout title="Why connect your assistant?" icon="ℹ" variant="info">
        Without the MCP server, an assistant writes ZardUI code from whatever it memorized. With it, the assistant reads
        the
        <strong>real source, API and demos</strong>
        of every component before writing a single line.
      </z-callout>

      <div class="flex flex-col gap-4">
        @for (capability of capabilities; track capability.title) {
          <div class="flex flex-col gap-1 rounded-lg border p-4 sm:p-5">
            <span class="text-sm font-semibold sm:text-base">{{ capability.title }}</span>
            <span class="text-muted-foreground text-sm leading-relaxed">{{ capability.description }}</span>
          </div>
        }
      </div>
    </div>
  `,
})
export class McpIntroductionSectionComponent {
  readonly capabilities = [
    {
      title: 'Discover',
      description: 'List every component and block in the registry, or search them by name.',
    },
    {
      title: 'Read',
      description: 'Fetch the full source code, the API reference and the demos of any component.',
    },
    {
      title: 'Resolve',
      description: 'Walk the complete dependency tree — npm packages plus internal registry dependencies.',
    },
    {
      title: 'Install',
      description: 'Run the ZardUI CLI in your project to add a component without leaving the conversation.',
    },
  ];
}
