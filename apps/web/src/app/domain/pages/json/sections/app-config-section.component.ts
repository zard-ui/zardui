import { Component } from '@angular/core';

import { MarkdownRendererComponent } from '@doc/domain/components/render/markdown-renderer.component';

@Component({
  selector: 'z-json-app-config-section',
  standalone: true,
  imports: [MarkdownRendererComponent],
  template: `
    <section class="flex flex-col gap-6 sm:gap-8" scrollSpyItem="app-config" id="app-config">
      <div class="flex flex-col gap-4 sm:gap-6">
        <h2
          class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 sm:text-3xl lg:mt-20"
        >
          App Config File
        </h2>
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          The
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">appConfigFile</code>
          property specifies the path to your Angular application's configuration file. This is used by the CLI to
          automatically add providers like
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">provideZard()</code>
          when needed.
        </p>
        <z-markdown-renderer markdownUrl="documentation/json/app-config-example.md"></z-markdown-renderer>
      </div>
    </section>
  `,
})
export class JsonAppConfigSectionComponent {}
