import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mcp-overview-section',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">What it is</h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      An assistant asked for a zard/ui component has to work from whatever it happened to memorise about the library —
      which is how you end up with inputs that do not exist and imports that never resolve. The MCP server replaces the
      guess with the source: it gives the assistant the same
      <a class="text-foreground underline underline-offset-4" routerLink="/docs/registry">registry</a>
      the CLI installs from, plus the documentation page of each component.
    </p>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      In practice that means it can list what exists, search by name, read the actual code of a component, resolve what
      that component depends on, and install it for you — with the same result as running the
      <a class="text-foreground underline underline-offset-4" routerLink="/docs/cli">CLI</a>
      yourself, because it is the CLI doing the work.
    </p>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      It works with any client that speaks the Model Context Protocol — Claude Code, Cursor, VS Code, and the others —
      and it is versioned separately from the component library, so updating one does not force the other.
    </p>
  `,
})
export class McpOverviewSection {}
