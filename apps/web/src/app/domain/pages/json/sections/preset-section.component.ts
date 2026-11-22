import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { JSON_PRESET_EXAMPLE } from '@generated/documentation/json/preset-example';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

@Component({
  selector: 'z-json-preset-section',
  imports: [CodeBlockComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <section class="flex flex-col gap-6 sm:gap-8" scrollSpyItem="preset" id="preset">
      <div class="flex flex-col gap-4 sm:gap-6">
        <h2
          class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 sm:text-3xl lg:mt-20"
        >
          Preset
        </h2>
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          The
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">preset</code>
          property holds the preset code the project was last fully configured from — the short
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">Z…</code>
          code built on the
          <a class="text-foreground underline underline-offset-4" routerLink="/create">create page</a>
          .
        </p>
        <z-code-block [data]="presetExample" />
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          It is informational: it records the design and nothing reads it to decide what to install, so a code from a
          newer CLI never makes
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">add</code>
          fail. It is written by a full
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">init --preset</code>
          ,
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">create</code>
          or
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">apply</code>
          ; a partial
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">apply --only</code>
          leaves it alone.
        </p>
      </div>
    </section>
  `,
})
export class JsonPresetSectionComponent {
  readonly presetExample: CodeBlockData = JSON_PRESET_EXAMPLE;
}
