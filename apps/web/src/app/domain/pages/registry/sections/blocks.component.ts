import { Component } from '@angular/core';

import { BLOCK_0, BLOCK_1 } from '@generated/pages/registry/blocks';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

@Component({
  selector: 'z-registry-blocks-section',
  imports: [CodeBlockComponent],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">
      Blocks registry
    </h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Blocks are larger compositions built on top of the components. They live in
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">libs/blocks/src/lib/&lt;id&gt;/</code>
      , and each one declares its
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">id</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">title</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">description</code>
      and
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">category</code>
      in a
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">block.ts</code>
      file.
    </p>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The same build step that produces the component registry also emits
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">apps/web/public/r/blocks/&lt;id&gt;.json</code>
      and the index
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">apps/web/public/r/blocks-registry.json</code>
      .
    </p>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">The blocks index</h3>
    <z-code-block [data]="blocksIndex" />

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">A block</h3>
    <z-code-block [data]="blockExample" />
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Note that the file entries of a block are shaped differently from the ones of a component: besides
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">name</code>
      and
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">content</code>
      they also carry a
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">path</code>
      and a
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">language</code>
      .
    </p>
  `,
})
export class RegistryBlocksSectionComponent {
  readonly blocksIndex: CodeBlockData = BLOCK_0;
  readonly blockExample: CodeBlockData = BLOCK_1;
}
