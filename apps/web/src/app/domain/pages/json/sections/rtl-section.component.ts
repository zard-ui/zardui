import { Component, ChangeDetectionStrategy } from '@angular/core';

import { JSON_RTL_EXAMPLE } from '@generated/documentation/json/rtl-example';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

@Component({
  selector: 'z-json-rtl-section',
  imports: [CodeBlockComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
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
          The components are direction-agnostic, so the files the CLI installs are identical either way.
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">zard-cli init --rtl</code>
          and
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">zard-cli create --rtl</code>
          record
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">true</code>
          here and set
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">dir="rtl"</code>
          on
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">&lt;html&gt;</code>
          in the app's
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">index.html</code>
          . They leave
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">lang</code>
          alone — set it to your content's language (
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">ar</code>
          ,
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">he</code>
          ,
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">fa</code>
          …) yourself.
        </p>
      </div>
    </section>
  `,
})
export class JsonRtlSectionComponent {
  readonly rtlExample: CodeBlockData = JSON_RTL_EXAMPLE;
}
