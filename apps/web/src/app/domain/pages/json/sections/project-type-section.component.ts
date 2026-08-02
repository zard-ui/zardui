import { Component } from '@angular/core';

import { JSON_PROJECT_TYPE_EXAMPLE } from '@generated/documentation/json/project-type-example';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

@Component({
  selector: 'z-json-project-type-section',
  standalone: true,
  imports: [CodeBlockComponent],
  template: `
    <section class="flex flex-col gap-6 sm:gap-8" scrollSpyItem="project-type" id="project-type">
      <div class="flex flex-col gap-4 sm:gap-6">
        <h2
          class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 sm:text-3xl lg:mt-20"
        >
          Project Type
        </h2>
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          The
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">projectType</code>
          property records the kind of project you chose when running init. The CLI uses it to know where the components
          live and how the build is wired: which file holds the TypeScript paths, whether Tailwind goes through PostCSS
          or a Vite plugin, and whether there is an application to register providers in.
        </p>
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          <strong>Supported values:</strong>
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">angular</code>
          ,
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">angular-library</code>
          ,
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">nx</code>
          ,
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">nx-library</code>
          or
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">analog</code>
        </p>
        <z-code-block [data]="projectTypeExample" />
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          A
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">components.json</code>
          written before this property existed is read as
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">angular</code>
          .
        </p>
      </div>
    </section>
  `,
})
export class JsonProjectTypeSectionComponent {
  readonly projectTypeExample: CodeBlockData = JSON_PROJECT_TYPE_EXAMPLE;
}
