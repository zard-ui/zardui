import { Component } from '@angular/core';

import { BLOCK_0, BLOCK_1 } from '@generated/pages/registry/item-schema';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

@Component({
  selector: 'z-registry-item-schema-section',
  imports: [CodeBlockComponent],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">
      Item schema
    </h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Each item has its own file at
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">/r/&lt;name&gt;.json</code>
      . This is where the source code lives: every entry of
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">files</code>
      carries the complete content of one file. The example below is
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">button.json</code>
      with the contents truncated for readability.
    </p>
    <z-code-block [data]="itemExample" />

    <div class="my-6 w-full overflow-x-auto rounded-md border">
      <table class="w-full caption-bottom text-sm">
        <thead class="[&_tr]:text-primary bg-neutral-100 dark:bg-neutral-800">
          <tr>
            <th class="h-12 px-4 text-left align-middle font-medium">Field</th>
            <th class="h-12 px-4 text-left align-middle font-medium">Type</th>
            <th class="h-12 px-4 text-left align-middle font-medium">Description</th>
          </tr>
        </thead>
        <tbody class="bg-accent/20 [&_tr:last-child]:border-0">
          <tr class="hover:bg-muted/50 border-b transition-colors">
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">name</code>
            </td>
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">string</code>
            </td>
            <td class="text-muted-foreground p-4 align-middle">
              Identifier of the item — what you pass to
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">zard-cli add</code>
              .
            </td>
          </tr>
          <tr class="hover:bg-muted/50 border-b transition-colors">
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">type</code>
            </td>
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">string</code>
            </td>
            <td class="text-muted-foreground p-4 align-middle">
              Always
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">registry:component</code>
              .
            </td>
          </tr>
          <tr class="hover:bg-muted/50 border-b transition-colors">
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">basePath</code>
            </td>
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">string?</code>
            </td>
            <td class="text-muted-foreground p-4 align-middle">Overrides the destination directory.</td>
          </tr>
          <tr class="hover:bg-muted/50 border-b transition-colors">
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">files</code>
            </td>
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">&#123; name, content &#125;[]</code>
            </td>
            <td class="text-muted-foreground p-4 align-middle">
              Path of the file relative to the item directory, plus its full source code.
            </td>
          </tr>
          <tr class="hover:bg-muted/50 border-b transition-colors">
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">dependencies</code>
            </td>
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">string[]?</code>
            </td>
            <td class="text-muted-foreground p-4 align-middle">npm packages installed along with the item.</td>
          </tr>
          <tr class="hover:bg-muted/50 border-b transition-colors">
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">devDependencies</code>
            </td>
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">string[]?</code>
            </td>
            <td class="text-muted-foreground p-4 align-middle">npm dev dependencies of the item.</td>
          </tr>
          <tr class="hover:bg-muted/50 border-b transition-colors">
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">registryDependencies</code>
            </td>
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">string[]?</code>
            </td>
            <td class="text-muted-foreground p-4 align-middle">Other registry items this one requires.</td>
          </tr>
          <tr class="hover:bg-muted/50 border-b transition-colors">
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">icons</code>
            </td>
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">
                &#123; family, symbols, tokens, demos &#125;
              </code>
            </td>
            <td class="text-muted-foreground p-4 align-middle">
              The icons the component draws and the set they are written in.
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">symbols</code>
              are the identifiers as the code writes them,
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">tokens</code>
              the same icons by the set-neutral key of
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">icons.json</code>
              , and
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">demos</code>
              the ones that only appear in the examples. Present on every item, with empty lists for a component that
              draws none.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Documentation and examples are not in the item. They live in the page of each component, served as markdown at
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">/docs/components/&lt;name&gt;.md</code>
      — one document with installation, usage, examples and API reference, which is what the MCP server reads. Keeping
      them out of the item is also what makes installing one download the code and nothing else.
    </p>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Where the files land</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The CLI resolves the destination directory from
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">basePath</code>
      and the aliases declared in your
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">components.json</code>
      :
    </p>
    <ul class="text-muted-foreground list-disc space-y-2 pl-6 text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <li>
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">basePath: 'core'</code>
        — or an item literally named
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">core</code>
        — resolves to
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">aliases.core</code>
        .
      </li>
      <li>
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">basePath: 'services'</code>
        resolves to
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">aliases.services</code>
        — this is how
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">dark-mode</code>
        is installed.
      </li>
      <li>
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">basePath: 'utils'</code>
        resolves to
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">aliases.utils</code>
        — this is how the
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">utils</code>
        item is installed.
      </li>
      <li>
        Anything else resolves to
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">
          aliases.components/&lt;basePath ?? name&gt;
        </code>
        .
      </li>
    </ul>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">-p, --path</code>
      flag overrides all of the above and resolves to
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">
        &lt;cwd&gt;/&lt;path&gt;/&lt;basePath ?? name&gt;
      </code>
      :
    </p>
    <z-code-block [data]="pathFlag" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Whichever route is taken, the CLI checks that the resolved destination stays inside the project directory and
      refuses to write outside of it. Writing the files of an item is also transactional: if any file of an item fails
      to be written, every file already written for that same item is removed before the error is reported.
    </p>
  `,
})
export class RegistryItemSchemaSectionComponent {
  readonly itemExample: CodeBlockData = BLOCK_0;
  readonly pathFlag: CodeBlockData = BLOCK_1;
}
