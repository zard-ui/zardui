import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { JSON_STYLE_EXAMPLE } from '@generated/documentation/json/style-example';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

@Component({
  selector: 'z-json-style-section',
  imports: [CodeBlockComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <section class="flex flex-col gap-6 sm:gap-8" scrollSpyItem="style" id="style">
      <div class="flex flex-col gap-4 sm:gap-6">
        <h2
          class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 sm:text-3xl lg:mt-20"
        >
          Style
        </h2>
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          The style of your design: the look a preset picks for spacing, radius, density and typography.
        </p>
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          <strong>Supported values:</strong>
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">vega</code>
          ,
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">nova</code>
          ,
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">maia</code>
          ,
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">lyra</code>
          ,
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">mira</code>
          ,
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">luma</code>
          ,
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">sera</code>
          ,
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">rhea</code>
          or the legacy
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">css</code>
          .
        </p>
        <z-code-block [data]="styleExample" />
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          The eight named styles are written by
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">zard-cli init --preset</code>
          ,
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">zard-cli apply</code>
          and
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">zard-cli create</code>
          — pick one on the
          <a class="text-foreground underline underline-offset-4" routerLink="/create">create page</a>
          . The default is
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">nova</code>
          .
        </p>
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">css</code>
          is what every project initialized before styles existed carries. It keeps working and is read as the current
          look, so nothing needs to change in an existing project.
        </p>
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          For now the value is recorded, and the components the CLI installs are the same whichever style it names.
          Everything else a preset chooses is applied: theme, fonts, radius, menu look and icon library.
        </p>
      </div>
    </section>
  `,
})
export class JsonStyleSectionComponent {
  readonly styleExample: CodeBlockData = JSON_STYLE_EXAMPLE;
}
