import { Component } from '@angular/core';

import { BLOCK_0, BLOCK_1, BLOCK_2, BLOCK_3, BLOCK_4 } from '@generated/pages/registry/dependencies';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

@Component({
  selector: 'z-registry-dependencies-section',
  imports: [CodeBlockComponent],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">
      Dependencies
    </h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      An item can declare two kinds of dependency: npm packages and other registry items. They are resolved by different
      parts of the CLI.
    </p>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">npm packages</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">dependencies</code>
      is collected from every item selected for installation, deduplicated, and installed in a single call using the
      package manager declared in your
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">components.json</code>
      —
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">npm</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">yarn</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">pnpm</code>
      or
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">bun</code>
      . If that install fails, the CLI retries it once with
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--legacy-peer-deps</code>
      .
    </p>
    <z-code-block [data]="npmDependencies" />
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">devDependencies</code>
      is part of the format and is carried from the manifest into the published JSON, but no item declares it today.
    </p>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Registry dependencies</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">registryDependencies</code>
      points at other items of the same registry, and they are resolved recursively — a dependency that has its own
      dependencies pulls them in too. An item whose destination directory already exists and is not empty is skipped,
      unless you pass
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">-o, --overwrite</code>
      . With
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">-a, --all</code>
      the recursive walk is skipped altogether, because every item is already part of the install.
    </p>
    <z-code-block [data]="registryDependencies" />

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Import rewriting</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The code stored in the registry is the code of this monorepo, so it uses the internal paths of the library. Before
      writing a file, the CLI rewrites those imports to the aliases configured in your project:
    </p>
    <ul class="text-muted-foreground list-disc space-y-2 pl-6 text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <li>
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">../../shared/utils/utils</code>
        becomes
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">&lt;aliases.utils&gt;/merge-classes</code>
        .
      </li>
      <li>
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">../../shared/utils/number</code>
        becomes
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">&lt;aliases.utils&gt;/number</code>
        .
      </li>
      <li>
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">../&lt;something&gt;</code>
        becomes
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">
          &lt;aliases.components&gt;/&lt;something&gt;
        </code>
        .
      </li>
      <li>
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">&#64;/shared/&lt;key&gt;/&lt;x&gt;</code>
        becomes
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">&lt;aliases[key]&gt;/&lt;x&gt;</code>
        , for every alias you configured.
      </li>
      <li>
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">ClassValue</code>
        imported from
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">class-variance-authority</code>
        is re-pointed at
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">clsx</code>
        .
      </li>
    </ul>
    <z-code-block [data]="aliasesExample" />
    <z-code-block [data]="beforeRewrite" />
    <z-code-block [data]="afterRewrite" />

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Version compatibility</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      A few packages track the Angular major version. Those are installed as
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">&lt;package&gt;&#64;^&lt;major&gt;.0.0</code>
      , where the major is read from the Angular version detected in your project. Today the only package on that list
      is
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">embla-carousel-angular</code>
      .
    </p>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      When the detected Angular version is a pre-release —
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">-rc</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">-next</code>
      or
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">-canary</code>
      — the CLI warns that some dependencies may have compatibility issues, and carries on.
    </p>
  `,
})
export class RegistryDependenciesSectionComponent {
  readonly npmDependencies: CodeBlockData = BLOCK_0;
  readonly registryDependencies: CodeBlockData = BLOCK_1;
  readonly aliasesExample: CodeBlockData = BLOCK_2;
  readonly beforeRewrite: CodeBlockData = BLOCK_3;
  readonly afterRewrite: CodeBlockData = BLOCK_4;
}
