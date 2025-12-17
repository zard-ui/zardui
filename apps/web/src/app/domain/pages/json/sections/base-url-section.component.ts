import { Component } from '@angular/core';

import { MarkdownRendererComponent } from '@doc/domain/components/render/markdown-renderer.component';

@Component({
  selector: 'z-json-base-url-section',
  standalone: true,
  imports: [MarkdownRendererComponent],
  template: `
    <section class="flex flex-col gap-6 sm:gap-8" scrollSpyItem="base-url" id="base-url">
      <div class="flex flex-col gap-4 sm:gap-6">
        <h2
          class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 sm:text-3xl lg:mt-20"
        >
          Base URL
        </h2>
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          The
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">baseUrl</code>
          property defines the base directory for resolving aliases. This should match the
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">baseUrl</code>
          in your
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">tsconfig.json</code>
          .
        </p>
        <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
          When using
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">&#64;/</code>
          prefix in your aliases, the CLI resolves paths relative to this base URL.
        </p>
        <z-markdown-renderer markdownUrl="documentation/json/base-url-example.md"></z-markdown-renderer>
      </div>
    </section>
  `,
})
export class JsonBaseUrlSectionComponent {}
