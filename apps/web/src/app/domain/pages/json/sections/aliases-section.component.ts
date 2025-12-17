import { Component } from '@angular/core';

import { MarkdownRendererComponent } from '../../../components/render/markdown-renderer.component';

@Component({
  selector: 'z-json-aliases-section',
  standalone: true,
  imports: [MarkdownRendererComponent],
  template: `
    <section class="flex flex-col gap-8 sm:gap-10" scrollSpyItem="aliases" id="aliases">
      <div class="flex flex-col gap-4 sm:gap-6">
        <h2
          class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 sm:text-3xl lg:mt-20"
        >
          Aliases
        </h2>
        <div class="flex flex-col gap-3">
          <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
            The CLI uses these values and the
            <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">paths</code>
            config from your
            <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">tsconfig.json</code>
            file to place generated components in the correct location.
          </p>
          <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
            Aliases use the
            <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">&#64;/</code>
            prefix which resolves relative to your
            <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">baseUrl</code>
            configuration.
          </p>
        </div>
      </div>

      <div class="flex flex-col gap-8 sm:gap-10">
        <div id="aliases-components" class="flex scroll-mt-20 flex-col gap-4">
          <h3 class="text-lg font-medium sm:text-xl lg:text-2xl">aliases.components</h3>
          <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">Import alias for your UI components.</p>
          <z-markdown-renderer markdownUrl="documentation/json/aliases-components-example.md"></z-markdown-renderer>
        </div>

        <div id="aliases-utils" class="flex scroll-mt-20 flex-col gap-4">
          <h3 class="text-lg font-medium sm:text-xl lg:text-2xl">aliases.utils</h3>
          <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
            Import alias for your utility functions like
            <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">mergeClasses</code>
            .
          </p>
          <z-markdown-renderer markdownUrl="documentation/json/aliases-utils-example.md"></z-markdown-renderer>
        </div>

        <div id="aliases-core" class="flex scroll-mt-20 flex-col gap-4">
          <h3 class="text-lg font-medium sm:text-xl lg:text-2xl">aliases.core</h3>
          <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
            Import alias for core utilities like directives and providers (e.g.,
            <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">provideZard()</code>
            ).
          </p>
          <z-markdown-renderer markdownUrl="documentation/json/aliases-core-example.md"></z-markdown-renderer>
        </div>

        <div id="aliases-services" class="flex scroll-mt-20 flex-col gap-4">
          <h3 class="text-lg font-medium sm:text-xl lg:text-2xl">aliases.services</h3>
          <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
            Import alias for your Angular services.
          </p>
          <z-markdown-renderer markdownUrl="documentation/json/aliases-services-example.md"></z-markdown-renderer>
        </div>
      </div>
    </section>
  `,
})
export class JsonAliasesSectionComponent {}
