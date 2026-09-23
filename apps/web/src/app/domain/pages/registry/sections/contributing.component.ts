import { Component } from '@angular/core';

import { BLOCK_0, BLOCK_1 } from '@generated/pages/registry/contributing';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

@Component({
  selector: 'z-registry-contributing-section',
  imports: [CodeBlockComponent],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">
      Adding a component to the registry
    </h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      A component only reaches the registry once it is declared in the manifest. Writing the files is not enough — the
      build reads the manifest, not the directory listing.
    </p>
    <ol class="text-muted-foreground list-decimal space-y-2 pl-6 text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <li>
        Create the component under
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">
          libs/zard/src/lib/shared/components/&lt;name&gt;/
        </code>
        .
      </li>
      <li>
        Register the item in
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">
          packages/cli/src/core/registry/registry-data.ts
        </code>
        , listing every file that should be copied into the user project and declaring
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">dependencies</code>
        or
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">registryDependencies</code>
        when the component needs them.
      </li>
      <li>
        Run
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">npm run build:registry</code>
        and check the output in
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">apps/web/public/r/</code>
        .
      </li>
      <li>Test the whole flow against the local registry before opening the pull request.</li>
    </ol>
    <z-code-block [data]="manifestEntry" />
    <z-code-block [data]="commands" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      For the rest of the workflow — branch naming, commit conventions and review — see the
      <a
        class="font-medium underline underline-offset-4"
        href="https://github.com/zard-ui/zardui/blob/master/CONTRIBUTING.md"
        target="_blank"
        rel="noopener noreferrer"
      >
        CONTRIBUTING.md
      </a>
      of the repository.
    </p>
  `,
})
export class RegistryContributingSectionComponent {
  readonly manifestEntry: CodeBlockData = BLOCK_0;
  readonly commands: CodeBlockData = BLOCK_1;
}
