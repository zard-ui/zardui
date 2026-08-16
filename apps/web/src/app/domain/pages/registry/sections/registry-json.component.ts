import { Component } from '@angular/core';

import { BLOCK_0 } from '@generated/pages/registry/registry-json';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

@Component({
  selector: 'registry-registry-json-section',
  standalone: true,
  imports: [CodeBlockComponent],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">
      The index (registry.json)
    </h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">registry.json</code>
      lists every item the registry knows about. It is a summary: it carries the metadata needed to resolve an install,
      but never the source code, which only lives in the individual item files.
    </p>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The excerpt below is the real index reduced to three items —
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">core</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">utils</code>
      and
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">button</code>
      . The published file contains every component of the library.
    </p>
    <z-code-block [data]="indexExample" />

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Top-level fields</h3>
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
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">$schema</code>
            </td>
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">string</code>
            </td>
            <td class="text-muted-foreground p-4 align-middle">
              Identifier of the registry format, always
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">
                https://zardui.com/schema/registry.json
              </code>
              .
            </td>
          </tr>
          <tr class="hover:bg-muted/50 border-b transition-colors">
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">name</code>
            </td>
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">string</code>
            </td>
            <td class="text-muted-foreground p-4 align-middle">
              Registry namespace —
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">&#64;zard</code>
              .
            </td>
          </tr>
          <tr class="hover:bg-muted/50 border-b transition-colors">
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">homepage</code>
            </td>
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">string</code>
            </td>
            <td class="text-muted-foreground p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">https://zardui.com</code>
              .
            </td>
          </tr>
          <tr class="hover:bg-muted/50 border-b transition-colors">
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">schemaVersion</code>
            </td>
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">number</code>
            </td>
            <td class="text-muted-foreground p-4 align-middle">
              The shape of the file — not the version of the package, which is the field below. It rises when a change
              breaks readers, so a client that only understands an older format can refuse the registry and say so
              instead of misreading it. A new optional field does not raise it. Absent means
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">1</code>
              , from before the field existed.
            </td>
          </tr>
          <tr class="hover:bg-muted/50 border-b transition-colors">
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">version</code>
            </td>
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">string</code>
            </td>
            <td class="text-muted-foreground p-4 align-middle">
              Version of the
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">zard-cli</code>
              package at the moment the registry was built. Informational — use
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">schemaVersion</code>
              to decide whether you can read it.
            </td>
          </tr>
          <tr class="hover:bg-muted/50 border-b transition-colors">
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">items</code>
            </td>
            <td class="p-4 align-middle">
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">array</code>
            </td>
            <td class="text-muted-foreground p-4 align-middle">One summary per item, without the file contents.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Fields of an item summary</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Each entry of
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">items</code>
      exposes
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">name</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">type</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">basePath</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">dependencies</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">devDependencies</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">registryDependencies</code>
      and
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">files</code>
      . Every field except
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">name</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">type</code>
      and
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">files</code>
      is optional and only emitted when the item declares it. In the index,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">files</code>
      is only the list of file names —
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">string[]</code>
      — not the objects with content you find in an item file.
    </p>

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <strong>Note:</strong>
      the URL in
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">$schema</code>
      is only an identifier written by the build. There is no JSON Schema document published at that address today, so
      it does not give you editor validation or autocompletion.
    </p>
  `,
})
export class RegistryRegistryJsonSection {
  readonly indexExample: CodeBlockData = BLOCK_0;
}
