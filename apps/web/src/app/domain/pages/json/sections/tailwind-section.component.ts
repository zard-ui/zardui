import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MarkdownRendererComponent } from '../../../components/render/markdown-renderer.component';

@Component({
  selector: 'z-json-tailwind-section',
  standalone: true,
  imports: [MarkdownRendererComponent, RouterLink],
  template: `
    <section class="flex flex-col gap-8 sm:gap-10" scrollSpyItem="tailwind" id="tailwind">
      <div class="flex flex-col gap-4 sm:gap-6">
        <h2
          class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 sm:text-3xl lg:mt-20"
        >
          Tailwind
        </h2>
        <div class="flex flex-col gap-3">
          <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
            Configuration to help the CLI understand how Tailwind CSS is set up in your project.
          </p>
          <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
            <strong>Important</strong>: Zard/ui only supports <strong>Tailwind CSS v4</strong> and
            <strong>does not support Tailwind CSS v3</strong> or <strong>SCSS</strong>.
          </p>
        </div>
      </div>

      <div class="flex flex-col gap-8 sm:gap-10">
        <div id="tailwind-css" class="flex scroll-mt-20 flex-col gap-4">
          <h3 class="text-lg font-medium sm:text-xl lg:text-2xl">tailwind.css</h3>
          <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
            Path to the CSS file that imports Tailwind CSS into your project.
          </p>
          <z-markdown-renderer markdownUrl="documentation/json/tailwind-css-example.md"></z-markdown-renderer>
        </div>

        <div id="tailwind-basecolor" class="flex scroll-mt-20 flex-col gap-4">
          <h3 class="text-lg font-medium sm:text-xl lg:text-2xl">tailwind.baseColor</h3>
          <div class="flex flex-col gap-3">
            <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
              This is used to generate the default color palette for your components.
              <strong>This cannot be changed after initialization.</strong> (but if u want u can change manually, all
              the themes exist into the <a class="text-blue-500" routerLink="/docs/theming">theming page</a>)
            </p>
            <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">Currently supported base colors:</p>
          </div>
          <z-markdown-renderer markdownUrl="documentation/json/tailwind-basecolor-example.md"></z-markdown-renderer>
        </div>

        <div id="tailwind-cssvariables" class="flex scroll-mt-20 flex-col gap-4">
          <h3 class="text-lg font-medium sm:text-xl lg:text-2xl">tailwind.cssVariables</h3>
          <div class="flex flex-col gap-3">
            <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
              You can choose between using CSS variables or Tailwind CSS utility classes for theming.
            </p>
            <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
              To use utility classes for theming set
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">tailwind.cssVariables</code> to
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">false</code>. For CSS variables, set
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">tailwind.cssVariables</code> to
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">true</code>.
            </p>
          </div>
          <z-markdown-renderer markdownUrl="documentation/json/tailwind-cssvariables-example.md"></z-markdown-renderer>
          <div class="bg-muted/30 rounded-lg border p-4 sm:p-6">
            <p class="text-muted-foreground text-xs sm:text-sm">
              <strong>This cannot be changed after initialization.</strong> To switch between CSS variables and utility
              classes, you'll have to delete and re-install your components.
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class JsonTailwindSectionComponent {}
