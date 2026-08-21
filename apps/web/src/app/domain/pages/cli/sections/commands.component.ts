import { Component } from '@angular/core';

import {
  BLOCK_0,
  BLOCK_1,
  BLOCK_2,
  TABS_3,
  BLOCK_4,
  BLOCK_5,
  BLOCK_6,
  BLOCK_7,
  BLOCK_8,
} from '@generated/pages/cli/commands';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import { CodeTabsComponent } from '@highlight/components/code-tabs/code-tabs.component';
import type { CodeBlockData, CodeTabData } from '@highlight/types';

@Component({
  selector: 'z-cli-commands-section',
  imports: [CodeBlockComponent, CodeTabsComponent],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">Commands</h2>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">init</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Initialize your project and install dependencies.
    </p>
    <z-code-block [data]="initUsage" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <strong>Options:</strong>
    </p>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">-y, --yes</code>
      — Skip the confirmation prompt
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">-c, --cwd &lt;cwd&gt;</code>
      — Working directory, defaults to the current one
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">-t, --type &lt;type&gt;</code>
      — Project type:
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">angular</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">angular-library</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">nx</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">nx-library</code>
      or
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">analog</code>
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">-p, --project &lt;name&gt;</code>
      — Which workspace project to configure, when more than one is compatible
    </p>

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <strong>What it does:</strong>
    </p>
    <ul class="text-muted-foreground mt-4 list-disc space-y-2 pl-6 text-base leading-relaxed">
      <li>
        writes
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">components.json</code>
        with your answers
      </li>
      <li>installs the runtime dependencies and the Tailwind packages your project type needs</li>
      <li>
        registers
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">provideZard()</code>
        in your app config (applications only)
      </li>
      <li>wires Tailwind into the build — PostCSS or the Vite plugin, depending on the type (applications only)</li>
      <li>writes the theme tokens into the stylesheet you pointed it at</li>
      <li>
        maps the import alias in the right
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">tsconfig</code>
      </li>
      <li>
        copies the shared
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">core</code>
        and
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">utils</code>
        helpers every component depends on
      </li>
    </ul>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      In a library there is no build to wire and no app config to register providers in, so those two steps are skipped
      and one is added: the theme stylesheet is declared as an asset of the package, so it ships with it. Wiring
      Tailwind and calling
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">provideZard()</code>
      then belong to the application that consumes the library — the CLI says so at the end of the run.
    </p>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Running it again on a configured project asks for confirmation first, and then overwrites what it wrote before.
    </p>

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <strong>Non-interactive use:</strong>
    </p>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Outside a TTY — CI, pipes — there is nobody to answer the questions, so
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--yes</code>
      is required and
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--type</code>
      takes the place of the first one. Without it the workspace decides, which is a guess; pass it when it matters.
      Init refuses to run headless without
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--yes</code>
      , because it overwrites your global CSS.
    </p>
    <z-code-block [data]="initHeadless" />

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">add</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Add components to your project, resolving their dependencies.
    </p>
    <z-code-block [data]="addUsage" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <strong>Options:</strong>
    </p>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">-y, --yes</code>
      — Skip the confirmation prompt
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">-o, --overwrite</code>
      — Overwrite existing files
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">-c, --cwd &lt;cwd&gt;</code>
      — Working directory, defaults to the current one
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">-a, --all</code>
      — Add every available component
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">-p, --path &lt;path&gt;</code>
      — Write the components somewhere other than the configured alias
    </p>

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <strong>Examples:</strong>
    </p>
    <z-code-tabs [data]="addExampleTabs" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">Several at once:</p>
    <z-code-block [data]="addMultiple" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">Everything:</p>
    <z-code-block [data]="addAll" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      With no arguments, a searchable list opens — pick with
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">space</code>
      and confirm with
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">enter</code>
      . Headless, add needs the component names or
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--all</code>
      , since there is no list to pick from.
    </p>
    <z-code-block [data]="addInteractive" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <strong>Dark mode:</strong>
      adding
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">dark-mode</code>
      also injects the theme script into your
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">index.html</code>
      and registers the initializer, so the chosen theme is applied before the first paint instead of flashing. It asks
      where the file is, suggesting the right path for your project type — at the root for Analog, under the app for Nx.
      This step needs an interactive terminal.
    </p>
    <z-code-block [data]="addDarkMode" />

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Global options</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">-v, --version</code>
      — Print the version
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--debug</code>
      — Verbose logging, including stack traces on failure. Can also be turned on with the
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">ZARD_DEBUG</code>
      environment variable.
    </p>
    <z-code-block [data]="globalOptions" />
  `,
})
export class CliCommandsSectionComponent {
  readonly initUsage: CodeBlockData = BLOCK_0;
  readonly initHeadless: CodeBlockData = BLOCK_1;
  readonly addUsage: CodeBlockData = BLOCK_2;
  readonly addExampleTabs: CodeTabData = TABS_3;
  readonly addMultiple: CodeBlockData = BLOCK_4;
  readonly addAll: CodeBlockData = BLOCK_5;
  readonly addInteractive: CodeBlockData = BLOCK_6;
  readonly addDarkMode: CodeBlockData = BLOCK_7;
  readonly globalOptions: CodeBlockData = BLOCK_8;
}
