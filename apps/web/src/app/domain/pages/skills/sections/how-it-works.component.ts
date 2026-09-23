import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'z-skills-how-it-works-section',
  imports: [RouterLink],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">
      How it works
    </h2>
    <ol class="text-muted-foreground my-6 ml-6 list-decimal text-base leading-relaxed [&>li]:mt-3">
      <li>
        <strong class="text-foreground font-medium">Detection.</strong>
        The description says when the skill applies — working with zard/ui, the CLI, the registry, or a project whose
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">components.json</code>
        declares a zard project type. The assistant loads it on its own; you do not invoke it.
      </li>
      <li>
        <strong class="text-foreground font-medium">Project context.</strong>
        It reads
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">components.json</code>
        from the project root and works from the real aliases, source root, icon family and package manager. There is no
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">info</code>
        command to run: the file is the configuration.
      </li>
      <li>
        <strong class="text-foreground font-medium">Conventions applied.</strong>
        Standalone and OnPush, signal inputs, the
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">z</code>
        prefix, semantic tokens, variants before raw classes,
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">z-field</code>
        for form layout — the same rules the library holds itself to.
      </li>
      <li>
        <strong class="text-foreground font-medium">Discovery before code.</strong>
        What exists comes from the registry index or the
        <a class="text-foreground underline underline-offset-4" routerLink="/docs/mcp">MCP server</a>
        ; a component's real API comes from its documentation page, published as Markdown at
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">/docs/components/&lt;name&gt;.md</code>
        . Reading it is cheaper than debugging an input that never existed.
      </li>
      <li>
        <strong class="text-foreground font-medium">Installation through the CLI.</strong>
        Components are written by
        <a class="text-foreground underline underline-offset-4" routerLink="/docs/cli">
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">zard-cli add</code>
        </a>
        , with the package runner the project actually uses — never by pasting source fetched from GitHub, which skips
        dependency resolution and the icon family.
      </li>
    </ol>

    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight lg:mt-20">Learn more</h2>
    <ul class="text-muted-foreground my-6 ml-6 list-disc text-base leading-relaxed [&>li]:mt-2">
      <li>
        <a class="text-foreground underline underline-offset-4" routerLink="/docs/cli">CLI</a>
        — the full command and flag reference
      </li>
      <li>
        <a class="text-foreground underline underline-offset-4" routerLink="/docs/mcp">MCP Server</a>
        — connect an assistant to the registry and the docs
      </li>
      <li>
        <a class="text-foreground underline underline-offset-4" routerLink="/docs/theming">Theming</a>
        — the tokens every component reads
      </li>
      <li>
        <a class="text-foreground underline underline-offset-4" routerLink="/docs/registry">Registry</a>
        — the published format, and how to serve your own
      </li>
      <li>
        <a
          class="text-foreground underline underline-offset-4"
          href="https://github.com/zard-ui/zardui/tree/master/skills/zard"
          target="_blank"
          rel="noopener"
        >
          skills/zard
        </a>
        — the source of everything described above
      </li>
    </ul>
  `,
})
export class SkillsHowItWorksSectionComponent {}
