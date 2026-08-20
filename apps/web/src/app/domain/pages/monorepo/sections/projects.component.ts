import { Component } from '@angular/core';

import { BLOCK_0, BLOCK_1 } from '@generated/pages/monorepo/projects';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

@Component({
  selector: 'monorepo-projects-section',
  standalone: true,
  imports: [CodeBlockComponent],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">
      Choosing the project
    </h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Once the type is answered, only the projects that match it are offered: applications for
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">nx</code>
      , libraries for
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">nx-library</code>
      . Offering the others would mean offering a target the following steps do not know how to configure.
    </p>
    <z-code-block [data]="menu" />
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      With a single compatible project there is nothing to choose, so the question is skipped and the name appears in
      the header instead — the choice is still made, just not asked.
    </p>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Answering ahead of time</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--type</code>
      and
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--project</code>
      are the two wizard questions given in advance. A name that is not a project of that type is refused with the list
      of the ones that are, rather than falling back to something you did not ask for.
    </p>
    <z-code-block [data]="flags" />
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Without
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--project</code>
      the first compatible project declared in the workspace is the default. Without a terminal to draw on — CI, a pipe
      — nobody can answer anything, so the workspace decides the type as well, and
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--yes</code>
      becomes mandatory, because
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">init</code>
      overwrites the global CSS.
    </p>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">e2e projects are left out</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The Nx generator creates
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">&lt;app&gt;-e2e</code>
      declaring
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">projectType: "application"</code>
      , which put it in the menu next to the real apps — but there is no
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">app.config.ts</code>
      there, no global CSS and no build to configure. The suffix is the convention; a Playwright or Cypress config in
      the project directory catches the ones that were renamed.
    </p>
  `,
})
export class MonorepoProjectsSection {
  readonly menu: CodeBlockData = BLOCK_0;
  readonly flags: CodeBlockData = BLOCK_1;
}
