import { Component } from '@angular/core';

import {
  BLOCK_0,
  BLOCK_1,
  BLOCK_2,
  BLOCK_3,
  BLOCK_4,
  BLOCK_5,
  TABS_6,
  BLOCK_7,
  BLOCK_8,
  BLOCK_9,
  BLOCK_10,
  BLOCK_11,
  BLOCK_12,
  BLOCK_13,
  BLOCK_14,
  BLOCK_15,
} from '@generated/pages/cli/commands';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import { CodeTabsComponent } from '@highlight/components/code-tabs/code-tabs.component';
import type { CodeBlockData, CodeTabData } from '@highlight/types';

@Component({
  selector: 'cli-commands-section',
  standalone: true,
  imports: [CodeBlockComponent, CodeTabsComponent],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">Commands</h2>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">create</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Scaffold a new project with zard/ui already set up. Runs the generator for the template you pick, then initializes
      zard/ui inside it and drops in an example component.
    </p>
    <z-code-block [data]="createUsage" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <strong>Options:</strong>
    </p>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">-t, --template &lt;template&gt;</code>
      — angular, angular-library, nx, nx-library or analog
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">-p, --preset &lt;preset&gt;</code>
      — the design system: a preset code from
      <a class="underline underline-offset-4" href="/create">zardui.com/create</a>
      , a path to a zard.preset.json, or a URL
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--pm &lt;manager&gt;</code>
      — npm, pnpm, yarn or bun
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--no-install</code>
      — scaffold without installing dependencies
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--no-git</code>
      — do not initialize a git repository
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--no-example</code>
      — skip the example component and leave the home page as the generator wrote it
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">-y, --yes</code>
      — answer every question with its default
    </p>
    <z-code-block [data]="createExample" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Nx installs its dependencies regardless of
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--no-install</code>
      — it needs them to run its own generators. The Analog generator asks its own questions and needs an interactive
      terminal; without one, create stops and hands you the command to run yourself.
    </p>

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
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--preset &lt;preset&gt;</code>
      — the design system to set up. Skips the questions it answers; everything else stays the same.
    </p>
    <z-code-block [data]="initPreset" />

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

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">apply</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Swap the design system of a project that is already set up.
    </p>
    <z-code-block [data]="applyUsage" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      It replaces the contents of
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">:root</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">.dark</code>
      and
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--radius</code>
      , and leaves the rest of your stylesheet exactly as it was — including anything you added inside those blocks. If
      the file does not look like one zard/ui wrote, apply changes nothing and tells you so.
    </p>
    <z-code-block [data]="applyExample" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <strong>Options:</strong>
    </p>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--only &lt;part&gt;</code>
      — apply only theme, icons or config. Repeatable.
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--force</code>
      — rewrite the whole stylesheet when the surgical patch does not fit. You lose anything else in the file.
    </p>
    <z-code-block [data]="applyOnly" />

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">preset</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Inspect a design system without applying it. None of these write anything.
    </p>
    <z-code-block [data]="presetSubcommands" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">decode</code>
      prints what a code contains,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">resolve</code>
      prints the code for the project you are in,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">url</code>
      prints the builder link, and
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">open</code>
      opens it. resolve answers for a components.json written before presets existed too, deriving the design system
      from what the file already said.
    </p>

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
export class CliCommandsSection {
  readonly createUsage: CodeBlockData = BLOCK_0;
  readonly createExample: CodeBlockData = BLOCK_1;
  readonly initUsage: CodeBlockData = BLOCK_2;
  readonly initHeadless: CodeBlockData = BLOCK_3;
  readonly initPreset: CodeBlockData = BLOCK_4;
  readonly addUsage: CodeBlockData = BLOCK_5;
  readonly addExampleTabs: CodeTabData = TABS_6;
  readonly addMultiple: CodeBlockData = BLOCK_7;
  readonly addAll: CodeBlockData = BLOCK_8;
  readonly addInteractive: CodeBlockData = BLOCK_9;
  readonly addDarkMode: CodeBlockData = BLOCK_10;
  readonly applyUsage: CodeBlockData = BLOCK_11;
  readonly applyExample: CodeBlockData = BLOCK_12;
  readonly applyOnly: CodeBlockData = BLOCK_13;
  readonly presetSubcommands: CodeBlockData = BLOCK_14;
  readonly globalOptions: CodeBlockData = BLOCK_15;
}
