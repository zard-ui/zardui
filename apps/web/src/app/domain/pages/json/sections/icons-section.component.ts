import { Component } from '@angular/core';

import { JSON_ICONS_EXAMPLE } from '@generated/documentation/json/icons-example';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

@Component({
  selector: 'z-json-icons-section',
  standalone: true,
  imports: [CodeBlockComponent],
  template: `
    <section class="flex flex-col gap-6 sm:gap-8" scrollSpyItem="icons" id="icons">
      <div class="flex flex-col gap-4 sm:gap-6">
        <h2
          class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 sm:text-3xl lg:mt-20"
        >
          Icons
        </h2>
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          The
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">icons</code>
          property names the icon set the components are written against. Every component draws through
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">ng-icons</code>
          , which stays the dependency either way — this picks which of its packages comes along (
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">&#64;ng-icons/lucide</code>
          ) and which names the components import.
        </p>
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          <strong>Supported values:</strong>
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">lucide</code>
        </p>
        <z-code-block [data]="iconsExample" />
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          Lucide is the only set supported today, so this is the only value the CLI accepts — writing anything else
          makes
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">add</code>
          reject the file. The property exists ahead of the sets that will follow: every entry in the registry already
          carries the icons it draws, in the component and in its examples, so supporting another one is a matter of
          translating names rather than rewriting components.
        </p>
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          A
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">components.json</code>
          written before this property existed is read as
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">lucide</code>
          .
        </p>
      </div>
    </section>
  `,
})
export class JsonIconsSectionComponent {
  readonly iconsExample: CodeBlockData = JSON_ICONS_EXAMPLE;
}
