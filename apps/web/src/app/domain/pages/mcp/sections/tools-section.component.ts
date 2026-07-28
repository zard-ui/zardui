import { Component } from '@angular/core';

interface McpTool {
  name: string;
  parameters: string;
  description: string;
}

@Component({
  selector: 'z-mcp-tools-section',
  standalone: true,
  template: `
    <section class="flex flex-col gap-6 sm:gap-8">
      <div class="flex flex-col gap-4 sm:gap-6">
        <h2
          class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 sm:text-3xl lg:mt-20"
        >
          Tools
        </h2>
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          The server exposes nine tools. You never call them by hand — describe what you want and the assistant picks
          the right ones.
        </p>
      </div>

      <div class="my-2 overflow-auto rounded-md border">
        <table class="w-full caption-bottom text-sm">
          <thead class="[&_tr]:text-primary bg-neutral-100 dark:bg-neutral-800">
            <tr class="hover:bg-muted/50 transition-colors">
              <th class="h-12 px-4 text-left align-middle font-medium">Tool</th>
              <th class="h-12 px-4 text-left align-middle font-medium">Parameters</th>
              <th class="h-12 px-4 text-left align-middle font-medium">Description</th>
            </tr>
          </thead>
          <tbody class="bg-accent/20 [&_tr:last-child]:border-0">
            @for (tool of tools; track tool.name) {
              <tr class="hover:bg-muted/50 border-b transition-colors">
                <td class="p-4 text-left align-middle font-medium">
                  <code class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono! text-sm font-semibold">
                    {{ tool.name }}
                  </code>
                </td>
                <td class="text-muted-foreground p-4 text-left align-middle whitespace-nowrap">
                  {{ tool.parameters }}
                </td>
                <td class="p-4 text-left align-middle font-medium">{{ tool.description }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
        Read operations hit the public registry at
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">https://zardui.com/r</code>
        and are cached for five minutes.
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">install-component</code>
        is the only tool that writes to your project — it shells out to
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">npx zard-cli add &lt;name&gt; --yes</code>
        .
      </p>
    </section>
  `,
})
export class McpToolsSectionComponent {
  readonly tools: McpTool[] = [
    {
      name: 'list-components',
      parameters: '—',
      description: 'Lists every component in the registry with its type, file count and dependencies.',
    },
    {
      name: 'search-components',
      parameters: 'query',
      description: 'Searches components by name using fuzzy matching.',
    },
    {
      name: 'get-component',
      parameters: 'name',
      description: 'Returns the complete source code of a component and its dependencies.',
    },
    {
      name: 'get-component-docs',
      parameters: 'name',
      description: 'Returns the overview and the API reference of a component.',
    },
    {
      name: 'get-component-examples',
      parameters: 'name',
      description: 'Returns the demo code used on the documentation site.',
    },
    {
      name: 'get-dependencies',
      parameters: 'name',
      description: 'Resolves the full dependency tree: npm packages plus internal registry dependencies.',
    },
    {
      name: 'install-component',
      parameters: 'name, cwd?',
      description: 'Installs a component into the current project through the ZardUI CLI.',
    },
    {
      name: 'list-blocks',
      parameters: '—',
      description: 'Lists every available block — pre-built compositions such as login or dashboard screens.',
    },
    {
      name: 'get-block',
      parameters: 'id',
      description: 'Returns the complete source code of a block.',
    },
  ];
}
