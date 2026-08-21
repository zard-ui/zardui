import { Component } from '@angular/core';

interface ToolRow {
  readonly name: string;
  readonly input: string;
  readonly description: string;
}

@Component({
  selector: 'z-mcp-tools-section',
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">Tools</h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Nine tools, in two groups: eight that read the registry, and one that writes to your project. The assistant picks
      them on its own — you describe what you want, not which tool to call.
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
                  <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">{{ tool.input }}</code>
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

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Reading versus writing</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Everything except
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">install-component</code>
      only fetches published files. That one runs the CLI in a working directory and writes components into your
      project, so it is the one worth approving deliberately if your client asks before running tools.
    </p>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      It never builds a shell command: the component name is validated and passed as a discrete argument, so nothing in
      it can start a second command. The working directory must exist, because it decides which
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">zard-cli</code>
      runs — the copy installed in the project is preferred over downloading one.
    </p>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Where the answers come from</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Source code comes from the registry, the same files the CLI installs. Documentation and examples come from the
      markdown of each component's page — one document with installation, usage, examples and the API reference, which
      is why an assistant using this server writes code against the real API instead of guessing at one.
    </p>
  `,
})
export class McpToolsSectionComponent {
  readonly tools: ToolRow[] = [
    { name: 'list-components', input: '', description: 'Every available component, with its metadata.' },
    { name: 'search-components', input: 'query', description: 'Find components by name.' },
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
      description: 'The dependency tree of a component — npm packages and other registry items.',
    },
    { name: 'install-component', input: 'name, cwd?', description: 'Installs a component into the project, via CLI.' },
    { name: 'list-blocks', input: '', description: 'Every available block — pre-built compositions.' },
    { name: 'get-block', input: 'id', description: 'The full source code of a block.' },
  ];
}
