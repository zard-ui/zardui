import { Component } from '@angular/core';

import { TABS_0, BLOCK_1, BLOCK_2, BLOCK_3 } from '@generated/pages/monorepo/application';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import { CodeTabsComponent } from '@highlight/components/code-tabs/code-tabs.component';
import type { CodeBlockData, CodeTabData } from '@highlight/types';

@Component({
  selector: 'monorepo-application-section',
  standalone: true,
  imports: [CodeBlockComponent, CodeTabsComponent],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">
      Nx application
    </h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">nx</code>
      type is for an application living inside the workspace — the case where the components are used, not published.
      Pick it in the wizard, or answer ahead of time with the flags.
    </p>
    <z-code-tabs [data]="initTabs" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Every path in the report is relative to the workspace root, and each one belongs to the app that was chosen —
      except the aliases, which are shared by construction.
    </p>
    <z-code-block [data]="report" />

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">The alias</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The mapping points at the app's source root, so the components installed there are reachable from anywhere in the
      workspace under the prefix you configured. The prefix comes from the alias you chose — pick
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">&#64;app/components</code>
      and the key is
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">&#64;app/*</code>
      , not a fixed
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">&#64;/*</code>
      .
    </p>
    <z-code-block [data]="tsconfig" />

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Tailwind</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Written next to the app's
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">project.json</code>
      , never at the workspace root. Running
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">init</code>
      again rewrites it on purpose: it is the way to fix a file left over from an earlier setup.
    </p>
    <z-code-block [data]="postcss" />
  `,
})
export class MonorepoApplicationSection {
  readonly initTabs: CodeTabData = TABS_0;
  readonly report: CodeBlockData = BLOCK_1;
  readonly tsconfig: CodeBlockData = BLOCK_2;
  readonly postcss: CodeBlockData = BLOCK_3;
}
