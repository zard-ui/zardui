import { Component } from '@angular/core';
import { MarkdownRendererComponent } from '@zard/domain/components/render/markdown-renderer.component';

@Component({
  selector: 'z-json-tailwind-section',
  standalone: true,
  imports: [MarkdownRendererComponent],
  template: `
    <section class="flex flex-col gap-8 sm:gap-10" scrollSpyItem="tailwind" id="tailwind">
      <div class="flex flex-col gap-4 sm:gap-6">
        <h2 class="font-heading mt-12 scroll-m-28 text-2xl sm:text-3xl font-semibold tracking-tight first:mt-0 lg:mt-20">Tailwind</h2>
        <div class="flex flex-col gap-3">
          <p class="text-base sm:text-lg text-muted-foreground leading-relaxed">Configuration to help the CLI understand how Tailwind CSS is set up in your project.</p>
          <p class="text-sm sm:text-base text-muted-foreground leading-relaxed">
            <strong>Important</strong>: Zard/ui only supports <strong>Tailwind CSS v4</strong> and <strong>does not support Tailwind CSS v3</strong> or <strong>SCSS</strong>.
          </p>
        </div>
      </div>

      <div class="flex flex-col gap-8 sm:gap-10">
        <div id="tailwind-css" class="scroll-mt-20 flex flex-col gap-4">
          <h3 class="text-lg sm:text-xl lg:text-2xl font-medium">tailwind.css</h3>
          <p class="text-sm sm:text-base text-muted-foreground leading-relaxed">Path to the CSS file that imports Tailwind CSS into your project.</p>
          <z-markdown-renderer markdownUrl="documentation/json/tailwind-css-example.md"></z-markdown-renderer>
        </div>

        <div id="tailwind-basecolor" class="scroll-mt-20 flex flex-col gap-4">
          <h3 class="text-lg sm:text-xl lg:text-2xl font-medium">tailwind.baseColor</h3>
          <div class="flex flex-col gap-3">
            <p class="text-sm sm:text-base text-muted-foreground leading-relaxed">
              This is used to generate the default color palette for your components. <strong>This cannot be changed after initialization.</strong>
            </p>
            <p class="text-sm sm:text-base text-muted-foreground leading-relaxed">Currently supported base colors:</p>
          </div>
          <z-markdown-renderer markdownUrl="documentation/json/tailwind-basecolor-example.md"></z-markdown-renderer>
          <div class="rounded-lg border bg-muted/30 p-4 sm:p-6">
            <p class="text-xs sm:text-sm text-muted-foreground">
              <strong>Note</strong>: Zard/ui currently only supports <code class="bg-muted px-1.5 py-0.5 rounded text-xs">slate</code> as the base color. More colors will be added
              in future releases.
            </p>
          </div>
        </div>

        <div id="tailwind-cssvariables" class="scroll-mt-20 flex flex-col gap-4">
          <h3 class="text-lg sm:text-xl lg:text-2xl font-medium">tailwind.cssVariables</h3>
          <div class="flex flex-col gap-3">
            <p class="text-sm sm:text-base text-muted-foreground leading-relaxed">You can choose between using CSS variables or Tailwind CSS utility classes for theming.</p>
            <p class="text-sm sm:text-base text-muted-foreground leading-relaxed">
              To use utility classes for theming set <code class="bg-muted px-1.5 py-0.5 rounded text-xs sm:text-sm">tailwind.cssVariables</code> to
              <code class="bg-muted px-1.5 py-0.5 rounded text-xs sm:text-sm">false</code>. For CSS variables, set
              <code class="bg-muted px-1.5 py-0.5 rounded text-xs sm:text-sm">tailwind.cssVariables</code> to
              <code class="bg-muted px-1.5 py-0.5 rounded text-xs sm:text-sm">true</code>.
            </p>
          </div>
          <z-markdown-renderer markdownUrl="documentation/json/tailwind-cssvariables-example.md"></z-markdown-renderer>
          <div class="rounded-lg border bg-muted/30 p-4 sm:p-6">
            <p class="text-xs sm:text-sm text-muted-foreground">
              <strong>This cannot be changed after initialization.</strong> To switch between CSS variables and utility classes, you'll have to delete and re-install your
              components.
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class JsonTailwindSectionComponent {}
