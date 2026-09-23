import { Component } from '@angular/core';

interface ToolRow {
  readonly name: string;
  readonly input: string;
  readonly description: string;
}

@Component({
  selector: 'mcp-tools-section',
  standalone: true,
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">Tools</h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Ten tools, in two groups: nine that read, and one that writes to your project. A wrong name comes back with a
      suggestion, so asking for
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">toast</code>
      points the assistant to
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">sonner</code>
      without a second search.
    </p>

    <div class="my-6 w-full overflow-x-auto rounded-md border">
      <table class="w-full caption-bottom text-sm">
        <thead class="[&_tr]:text-primary bg-neutral-100 dark:bg-neutral-800">
          <tr>
            <th class="h-12 px-4 text-left align-middle font-medium">Tool</th>
            <th class="h-12 px-4 text-left align-middle font-medium">Input</th>
            <th class="h-12 px-4 text-left align-middle font-medium">Description</th>
          </tr>
        </thead>
        <tbody class="bg-accent/20 [&_tr:last-child]:border-0">
          @for (tool of tools; track tool.name) {
            <tr class="hover:bg-muted/50 border-b transition-colors">
              <td class="p-4 align-middle">
                <code class="bg-muted rounded px-1.5 py-0.5 text-xs whitespace-nowrap sm:text-sm">{{ tool.name }}</code>
              </td>
              <td class="p-4 align-middle">
                @if (tool.input) {
                  <span class="flex flex-wrap gap-1">
                    @for (param of tool.input.split(', '); track param) {
                      <code class="bg-muted rounded px-1.5 py-0.5 text-xs whitespace-nowrap sm:text-sm">
                        {{ param }}
                      </code>
                    }
                  </span>
                } @else {
                  <span class="text-muted-foreground">—</span>
                }
              </td>
              <td class="text-muted-foreground p-4 align-middle">{{ tool.description }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Where the answers come from</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Source code comes from the registry, the same files the CLI installs. Documentation and examples come from the
      markdown of each component's page, API reference included.
    </p>
  `,
})
export class McpToolsSection {
  readonly tools: ToolRow[] = [
    { name: 'list-components', input: '', description: 'Every component, with a one-line description and category.' },
    {
      name: 'search-components',
      input: 'query, limit?',
      description: 'Find components by name, purpose or the name other libraries use ("modal", "toast").',
    },
    { name: 'get-component', input: 'name', description: 'The full source code of a component.' },
    {
      name: 'get-component-docs',
      input: 'name',
      description: 'The documentation page: installation, usage, examples and API reference.',
    },
    { name: 'get-component-examples', input: 'name', description: 'The usage examples, with the code of each one.' },
    {
      name: 'get-dependencies',
      input: 'name',
      description: 'Everything an install brings: registry components in install order, npm packages, and the tree.',
    },
    {
      name: 'get-docs',
      input: 'topic?, section?',
      description:
        'A guide on theming, dark mode, forms or setup, whole or one section. Without a topic, the list of guides.',
    },
    {
      name: 'install-component',
      input: 'name, cwd?, overwrite?',
      description: 'Installs a component into the project, via CLI. Existing files are kept unless overwrite.',
    },
    {
      name: 'list-blocks',
      input: 'category?',
      description: 'Every available block, optionally filtered by category.',
    },
    { name: 'get-block', input: 'id', description: 'The full source code of a block.' },
  ];
}
