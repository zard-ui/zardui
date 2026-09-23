import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'z-monorepo-overview-section',
  imports: [RouterLink],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">
      What changes in a workspace
    </h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      A single-app project has one of everything: one
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">tsconfig.json</code>
      , one global CSS file, one build. A workspace has one of each per project, plus a set of files at the root that
      every project inherits — and the two are not interchangeable. Writing to the wrong one is how a path alias ends up
      resolving in the editor and failing in the build.
    </p>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      That is the whole reason the project type is the first question the
      <a class="text-foreground underline underline-offset-4" routerLink="/docs/cli">CLI</a>
      asks. It is not a label: it decides which file receives the aliases, where the Tailwind configuration is written,
      and whether there is an application to register providers in at all.
    </p>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Aliases go to tsconfig.base.json</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Nx keeps the shared TypeScript configuration in
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">tsconfig.base.json</code>
      , and that is the file each project extends. The
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">tsconfig.json</code>
      at the root is not inherited by any project, so a path mapping written there never reaches the compiler. The
      editor resolves it anyway — it reads the root config — which is exactly what makes the failure confusing: the
      import looks fine until the build says it cannot find the module.
    </p>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">PostCSS goes inside the app</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The Angular build looks for a
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">.postcssrc.json</code>
      starting from the CSS file it is processing and walking up to the workspace root. Both the project directory and
      the root would be found — but the root configures every app in the workspace at once, including the ones that
      never asked for Tailwind. So the file is written inside the project that uses it, and the apps next door are left
      alone.
    </p>
  `,
})
export class MonorepoOverviewSectionComponent {}
