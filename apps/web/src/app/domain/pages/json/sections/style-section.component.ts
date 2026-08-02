import { Component } from '@angular/core';

import { JSON_STYLE_EXAMPLE } from '@generated/documentation/json/style-example';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

@Component({
  selector: 'z-json-style-section',
  standalone: true,
  imports: [CodeBlockComponent],
  template: `
    <section class="flex flex-col gap-6 sm:gap-8" scrollSpyItem="style" id="style">
      <div class="flex flex-col gap-4 sm:gap-6">
        <h2
          class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 sm:text-3xl lg:mt-20"
        >
          Style
        </h2>
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          The style for your components. Currently,
          <strong>Zard/ui only supports the "css" style</strong>
          .
        </p>
        <z-code-block [data]="styleExample" />
      </div>
    </section>
  `,
})
export class JsonStyleSectionComponent {
  readonly styleExample: CodeBlockData = JSON_STYLE_EXAMPLE;
}
