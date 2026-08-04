import { Component } from '@angular/core';

@Component({
  selector: 'registry-overview-section',
  standalone: true,
  imports: [],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">
      What is the registry?
    </h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The registry is a set of static JSON files published at
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">https://zardui.com/r</code>
      . Every item carries the full source code of its files, so a client can download an item and write the files
      directly into a project.
    </p>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      That is the open code philosophy: the components you install are copied into your repository and you own them from
      that moment on. There is no Zard UI runtime dependency to keep in sync.
    </p>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Endpoints</h3>
    <ul class="text-muted-foreground list-disc space-y-2 pl-6 text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <li>
        Index:
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">https://zardui.com/r/registry.json</code>
      </li>
      <li>
        Item:
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">https://zardui.com/r/&lt;name&gt;.json</code>
        — for example
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">https://zardui.com/r/button.json</code>
      </li>
      <li>
        Blocks index:
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">https://zardui.com/r/blocks-registry.json</code>
      </li>
      <li>
        Block:
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">
          https://zardui.com/r/blocks/&lt;id&gt;.json
        </code>
      </li>
    </ul>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Who consumes it</h3>
    <ul class="text-muted-foreground list-disc space-y-2 pl-6 text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <li>
        The CLI
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">zard-cli</code>
        , which resolves items and writes their files into your project.
      </li>
      <li>The MCP server, which exposes components, their docs and their demos to AI assistants.</li>
      <li>Any other tool that can speak HTTP — the endpoints are public and require no authentication.</li>
    </ul>
  `,
})
export class RegistryOverviewSection {}
