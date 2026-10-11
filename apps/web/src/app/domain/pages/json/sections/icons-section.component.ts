import { Component, ChangeDetectionStrategy } from '@angular/core';

import { JSON_ICONS_EXAMPLE } from '@generated/documentation/json/icons-example';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

@Component({
  selector: 'z-json-icons-section',
  imports: [CodeBlockComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
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
          ,
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">tabler</code>
          ,
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">hugeicons</code>
          ,
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">phosphor</code>
          or
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">remixicon</code>
        </p>
        <z-code-block [data]="iconsExample" />
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          Each value brings its own
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">ng-icons</code>
          package —
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">&#64;ng-icons/lucide</code>
          ,
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">&#64;ng-icons/tabler-icons</code>
          ,
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">&#64;ng-icons/huge-icons</code>
          ,
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">&#64;ng-icons/phosphor-icons</code>
          and
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">&#64;ng-icons/remixicon</code>
          — and every component you add afterwards is written with that set's names.
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">zard-cli init --preset</code>
          ,
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">apply</code>
          and
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">create</code>
          write it from the preset; the valid values are the ones the registry publishes, and the CLI lists them if you
          write one it does not know.
        </p>
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          When a set has no equivalent for an icon, the CLI reports it as missing when you add the component and keeps
          the lucide import, so the build still passes.
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
