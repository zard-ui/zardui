import { Component } from '@angular/core';

import { JSON_CURRENT_STRUCTURE_EXAMPLE } from '@generated/documentation/json/current-structure-example';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

@Component({
  selector: 'z-json-current-structure-section',
  standalone: true,
  imports: [CodeBlockComponent],
  template: `
    <section class="flex flex-col gap-6 sm:gap-8" scrollSpyItem="current-structure" id="current-structure">
      <div class="flex flex-col gap-4 sm:gap-6">
        <h2
          class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 sm:text-3xl lg:mt-20"
        >
          Current Zard/ui components.json
        </h2>
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          Here's the current
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">components.json</code>
          structure that Zard/ui supports:
        </p>
        <z-code-block [data]="currentStructureExample" />
      </div>
    </section>
  `,
})
export class JsonCurrentStructureSectionComponent {
  readonly currentStructureExample: CodeBlockData = JSON_CURRENT_STRUCTURE_EXAMPLE;
}
