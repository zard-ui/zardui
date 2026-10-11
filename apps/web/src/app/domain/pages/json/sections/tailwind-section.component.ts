import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { JSON_TAILWIND_BASECOLOR_EXAMPLE } from '@generated/documentation/json/tailwind-basecolor-example';
import { JSON_TAILWIND_CSS_EXAMPLE } from '@generated/documentation/json/tailwind-css-example';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

@Component({
  selector: 'z-json-tailwind-section',
  imports: [CodeBlockComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
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
            <strong>Important</strong>
            : Zard/ui only supports
            <strong>Tailwind CSS v4</strong>
            and
            <strong>does not support Tailwind CSS v3</strong>
            or
            <strong>SCSS</strong>
            .
          </p>
        </div>
      </div>

      <div class="flex flex-col gap-8 sm:gap-10">
        <div id="tailwind-css" class="flex scroll-mt-20 flex-col gap-4">
          <h3 class="text-lg font-medium sm:text-xl lg:text-2xl">tailwind.css</h3>
          <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
            Path to the CSS file that imports Tailwind CSS into your project.
          </p>
          <z-code-block [data]="tailwindCssExample" />
        </div>

        <div id="tailwind-basecolor" class="flex scroll-mt-20 flex-col gap-4">
          <h3 class="text-lg font-medium sm:text-xl lg:text-2xl">tailwind.baseColor</h3>
          <div class="flex flex-col gap-3">
            <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
              This is used to generate the default color palette for your components.
              <strong>Editing this value does not repaint the theme.</strong>
              To change it afterwards run
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">
                zard-cli apply --preset &lt;code&gt; --only theme
              </code>
              , or copy the tokens by hand — all the themes exist in the
              <a class="text-blue-500" routerLink="/docs/theming">theming page</a>
              .
            </p>
            <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
              Currently supported base colors (
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">mauve</code>
              ,
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">olive</code>
              ,
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">mist</code>
              and
              <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">taupe</code>
              come with presets):
            </p>
          </div>
          <z-code-block [data]="tailwindBasecolorExample" />
        </div>
      </div>
    </section>
  `,
})
export class JsonTailwindSectionComponent {
  readonly tailwindCssExample: CodeBlockData = JSON_TAILWIND_CSS_EXAMPLE;
  readonly tailwindBasecolorExample: CodeBlockData = JSON_TAILWIND_BASECOLOR_EXAMPLE;
}
