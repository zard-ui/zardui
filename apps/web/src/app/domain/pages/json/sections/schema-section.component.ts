import { Component } from '@angular/core';

import { MarkdownRendererComponent } from '@doc/domain/components/render/markdown-renderer.component';

@Component({
  selector: 'z-json-schema-section',
  standalone: true,
  imports: [MarkdownRendererComponent],
  template: `
    <section class="flex flex-col gap-6 sm:gap-8" scrollSpyItem="schema" id="schema">
      <div class="flex flex-col gap-4 sm:gap-6">
        <h2
          class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 sm:text-3xl lg:mt-20"
        >
          $schema
        </h2>
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          The
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">$schema</code>
          property provides JSON schema validation for your
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">components.json</code>
          file. This enables autocompletion and validation in your IDE.
        </p>
        <z-markdown-renderer markdownUrl="documentation/json/schema-example.md"></z-markdown-renderer>
      </div>
    </section>
  `,
})
export class JsonSchemaSectionComponent {}
