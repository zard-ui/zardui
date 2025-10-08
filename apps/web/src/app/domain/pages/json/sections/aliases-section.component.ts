import { Component } from '@angular/core';

import { MarkdownRendererComponent } from '../../../components/render/markdown-renderer.component';

@Component({
  selector: 'z-json-aliases-section',
  standalone: true,
  imports: [MarkdownRendererComponent],
  template: `
    <section class="flex flex-col gap-8 sm:gap-10" scrollSpyItem="aliases" id="aliases">
      <div class="flex flex-col gap-4 sm:gap-6">
        <h2 class="font-heading mt-12 scroll-m-28 text-2xl sm:text-3xl font-semibold tracking-tight first:mt-0 lg:mt-20">Aliases</h2>
        <div class="flex flex-col gap-3">
          <p class="text-base sm:text-lg text-muted-foreground leading-relaxed">
            The CLI uses these values and the <code class="bg-muted px-1.5 py-0.5 rounded text-xs sm:text-sm">paths</code> config from your
            <code class="bg-muted px-1.5 py-0.5 rounded text-xs sm:text-sm">tsconfig.json</code> file to place generated components in the correct location.
          </p>
          <p class="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Path aliases have to be set up in your <code class="bg-muted px-1.5 py-0.5 rounded text-xs sm:text-sm">tsconfig.json</code> file.
          </p>
        </div>
      </div>

      <div class="flex flex-col gap-8 sm:gap-10">
        <div id="aliases-components" class="scroll-mt-20 flex flex-col gap-4">
          <h3 class="text-lg sm:text-xl lg:text-2xl font-medium">aliases.components</h3>
          <p class="text-sm sm:text-base text-muted-foreground leading-relaxed">Import alias for your components.</p>
          <z-markdown-renderer markdownUrl="documentation/json/aliases-components-example.md"></z-markdown-renderer>
        </div>

        <div id="aliases-utils" class="scroll-mt-20 flex flex-col gap-4">
          <h3 class="text-lg sm:text-xl lg:text-2xl font-medium">aliases.utils</h3>
          <p class="text-sm sm:text-base text-muted-foreground leading-relaxed">Import alias for your utility functions.</p>
          <z-markdown-renderer markdownUrl="documentation/json/aliases-utils-example.md"></z-markdown-renderer>
        </div>
      </div>
    </section>
  `,
})
export class JsonAliasesSectionComponent {}
