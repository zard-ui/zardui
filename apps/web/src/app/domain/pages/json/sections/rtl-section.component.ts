import { Component } from '@angular/core';

import { JSON_RTL_EXAMPLE } from '@generated/documentation/json/rtl-example';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

@Component({
  selector: 'z-json-rtl-section',
  imports: [CodeBlockComponent],
  template: `
    <section class="flex flex-col gap-6 sm:gap-8" scrollSpyItem="rtl" id="rtl">
      <div class="flex flex-col gap-4 sm:gap-6">
        <h2
          class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 sm:text-3xl lg:mt-20"
        >
          RTL
        </h2>
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          The
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">rtl</code>
          property declares that the project reads right to left. It defaults to
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">false</code>
          .
        </p>
        <z-code-block [data]="rtlExample" />
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          Turning it on does not change what the CLI installs yet — the components are the same either way. It is the
          place where that preference will live once they ship right-to-left variants, and it is in the file now so that
          a project can record the intent before then.
        </p>
      </div>
    </section>
  `,
})
export class JsonRtlSectionComponent {
  readonly rtlExample: CodeBlockData = JSON_RTL_EXAMPLE;
}
