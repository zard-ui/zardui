import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mcp-overview-section',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">What it is</h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Without it, an assistant writes zard/ui from memory — inputs that do not exist, imports that never resolve. With
      it, the assistant reads the same
      <a class="text-foreground underline underline-offset-4" routerLink="/docs/registry">registry</a>
      the CLI installs from and each component's documentation page, then installs through the
      <a class="text-foreground underline underline-offset-4" routerLink="/docs/cli">CLI</a>
      itself.
    </p>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      It works with any client that speaks the Model Context Protocol, and is versioned apart from the library.
    </p>
  `,
})
export class McpOverviewSection {}
