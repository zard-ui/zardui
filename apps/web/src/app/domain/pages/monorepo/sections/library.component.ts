import { Component } from '@angular/core';

import { TABS_0, BLOCK_1, BLOCK_2, BLOCK_3, BLOCK_4, BLOCK_5 } from '@generated/pages/monorepo/library';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import { CodeTabsComponent } from '@highlight/components/code-tabs/code-tabs.component';
import type { CodeBlockData, CodeTabData } from '@highlight/types';

@Component({
  selector: 'monorepo-library-section',
  standalone: true,
  imports: [CodeBlockComponent, CodeTabsComponent],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">Nx library</h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">nx-library</code>
      type is for a library in
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">libs/</code>
      — the case where the components become part of something other teams install. A library is not a smaller
      application: there is no build to hook Tailwind into and no
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">app.config.ts</code>
      to register providers in, so those two steps do not run at all.
    </p>
    <z-code-tabs [data]="initTabs" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The configuration says as much:
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">appConfigFile</code>
      is empty, and
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">baseUrl</code>
      points at
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">src/lib</code>
      — the convention of both
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">ng generate library</code>
      and
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">nx g &#64;nx/angular:library</code>
      , where
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">src/</code>
      holds the public entry point and everything it exports lives one level down.
    </p>
    <z-code-block [data]="componentsJson" />

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">The theme ships with the library</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The theme tokens are still written, but into the library instead of an app — and a loose
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">.css</code>
      file is not reachable from the entry point, so ng-packagr would leave it out of the package. Declaring it as an
      asset is what puts it in the published output, at the root of the package rather than under a
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">src/</code>
      that only means something inside the library's own repository.
    </p>
    <z-code-block [data]="ngPackage" />
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      An Nx library only gets an
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">ng-package.json</code>
      when it is publishable. Without one there is no package to assemble, the step is skipped with a warning, and the
      CSS is consumed straight from the source.
    </p>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">What the consuming app still has to do</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Two things belong to the application, and the library cannot do either on its behalf: registering the providers,
      and importing the tokens. Skip them and the components render unstyled, which reads like a broken install rather
      than a missing step — so
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">init</code>
      says so before it finishes.
    </p>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      One step is the library's, and it is easy to miss:
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">provideZard()</code>
      is installed with
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">core</code>
      inside the library, and
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">init</code>
      does not touch the public entry point. Re-export it from
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">src/index.ts</code>
      , or the import below has nothing to resolve to.
    </p>
    <z-code-block [data]="entryPoint" />
    <z-code-block [data]="appConfig" />
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The stylesheet import resolves to the asset published at the package root. Tailwind is the application's to
      configure too: the library has no build of its own to run it in.
    </p>
    <z-code-block [data]="styles" />
  `,
})
export class MonorepoLibrarySection {
  readonly initTabs: CodeTabData = TABS_0;
  readonly componentsJson: CodeBlockData = BLOCK_1;
  readonly ngPackage: CodeBlockData = BLOCK_2;
  readonly entryPoint: CodeBlockData = BLOCK_3;
  readonly appConfig: CodeBlockData = BLOCK_4;
  readonly styles: CodeBlockData = BLOCK_5;
}
