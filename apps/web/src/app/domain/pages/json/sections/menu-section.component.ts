import { Component, ChangeDetectionStrategy } from '@angular/core';

import { JSON_MENU_EXAMPLE } from '@generated/documentation/json/menu-example';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

@Component({
  selector: 'z-json-menu-section',
  imports: [CodeBlockComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <section class="flex flex-col gap-6 sm:gap-8" scrollSpyItem="menu" id="menu">
      <div class="flex flex-col gap-4 sm:gap-6">
        <h2
          class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 sm:text-3xl lg:mt-20"
        >
          Menu
        </h2>
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          Three properties describe how menus, popovers and dropdowns look. They are written by
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">zard-cli init --preset</code>
          ,
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">apply</code>
          and
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">create</code>
          , and absent from a project without a preset, which then has the defaults.
        </p>
        <z-code-block [data]="menuExample" />
        <ul class="text-muted-foreground list-disc space-y-2 pl-6 text-base leading-relaxed sm:text-lg">
          <li>
            <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">menuColor</code>
            —
            <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">default</code>
            or
            <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">inverted</code>
            (dark in light mode and light in dark mode).
          </li>
          <li>
            <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">menuAppearance</code>
            —
            <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">solid</code>
            or
            <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">translucent</code>
            (with a backdrop blur). A translucent menu always uses the subtle accent.
          </li>
          <li>
            <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">menuAccent</code>
            —
            <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">subtle</code>
            (a neutral wash) or
            <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">bold</code>
            (the primary color) for the focused or hovered item.
          </li>
        </ul>
      </div>
    </section>
  `,
})
export class JsonMenuSectionComponent {
  readonly menuExample: CodeBlockData = JSON_MENU_EXAMPLE;
}
