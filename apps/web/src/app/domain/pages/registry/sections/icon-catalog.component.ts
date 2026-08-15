import { Component } from '@angular/core';

import { BLOCK_0 } from '@generated/pages/registry/icon-catalog';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

@Component({
  selector: 'registry-icon-catalog-section',
  standalone: true,
  imports: [CodeBlockComponent],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">
      Icon catalogue (icons.json)
    </h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">icons.json</code>
      declares the icon sets a registry supports and the table that translates between them. The CLI reads it at run
      time rather than relying on the copy it was built with, so a set added here works for the CLIs that are already
      installed.
    </p>
    <z-code-block [data]="catalog" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">families</code>
      is keyed by the value that goes in
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">icons</code>
      in your components.json. Two things separate one set from another: the npm package the project needs and the
      prefix its symbols carry — everything else about installing a component is identical.
    </p>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">icons</code>
      is one row per icon, keyed by what it means rather than by what any set calls it. Items are published in one set,
      and a client installing with another rewrites the symbols through this table: the import, the
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">provideIcons</code>
      call and the
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">name</code>
      in the template are the same word. A row with no entry for the target set means that set has no equivalent — the
      symbol is left alone and reported, never guessed.
    </p>
  `,
})
export class RegistryIconCatalogSection {
  readonly catalog: CodeBlockData = BLOCK_0;
}
