import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

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
  BLOCK_9,
  BLOCK_10,
  BLOCK_11,
  BLOCK_12,
  BLOCK_13,
  BLOCK_14,
  BLOCK_15,
  BLOCK_16,
  BLOCK_17,
} from '@generated/pages/cli/commands';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import { CodeTabsComponent } from '@highlight/components/code-tabs/code-tabs.component';
import type { CodeBlockData, CodeTabData } from '@highlight/types';

@Component({
  selector: 'z-cli-commands-section',
  imports: [CodeBlockComponent, CodeTabsComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
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
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--css &lt;path&gt;</code>
      — The global stylesheet that receives the theme (in a library, the file init creates)
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--app-config &lt;path&gt;</code>
      — The app.config.ts that receives provideZard(); ignored for libraries
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--base-color &lt;color&gt;</code>
      — Theme base color:
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">neutral</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">stone</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">zinc</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">gray</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">slate</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">mauve</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">olive</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">mist</code>
      or
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">taupe</code>
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--components-alias &lt;alias&gt;</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--utils-alias &lt;alias&gt;</code>
      — Import aliases, defaults to
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">&#64;/shared/components</code>
      and
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">&#64;/shared/utils</code>
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--rtl</code>
      — The project reads right to left: records
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">"rtl": true</code>
      and sets
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">dir="rtl"</code>
      on
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">&lt;html&gt;</code>
      in
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">index.html</code>
      .
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--no-rtl</code>
      is the default
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--preset &lt;code&gt;</code>
      — Apply a design preset (style, base color, theme, fonts, icons, radius, menu). Build one at
      <a class="text-foreground underline underline-offset-4" routerLink="/create">zardui.com/create</a>
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--pointer</code>
      — Use the pointer cursor on buttons. Only with
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--preset</code>
    </p>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Every question the wizard asks has a flag. In a terminal they fill the answers in advance; headless (CI, pipes)
      they are the answers.
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

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <strong>With a preset:</strong>
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--preset</code>
      configures a project that already exists with a whole design in one go — the style, base color, theme and chart
      colors, fonts, icon library, radius and menu look. Any of the five project types accepts it, libraries included.
      It writes the same
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">components.json</code>
      and theme tokens as a plain init, plus the font packages with their imports, the icon library's
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">ng-icons</code>
      package and the
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">preset</code>
      key. It cannot be combined with
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--base-color</code>
      , since the preset already chooses it.
    </p>
    <z-code-block [data]="initPreset" />
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      A preset code starts with
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">Z</code>
      and is built on the
      <a class="text-foreground underline underline-offset-4" routerLink="/create">create page</a>
      . The CLI decodes it locally and rejects a malformed code, or one that comes from another tool, before it touches
      a single file. Components you add afterwards are installed with the preset's icon library; components already in
      the project keep their current look until you add them again with
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--overwrite</code>
      .
    </p>

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
      — Add every available component. Blocks are not included; they are added by name
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">-p, --path &lt;path&gt;</code>
      — Write the components somewhere other than the configured alias
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--index-html &lt;path&gt;</code>
      — The index.html that receives the dark-mode theme script
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
      Headless, it uses
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--index-html</code>
      or that suggested path.
    </p>
    <z-code-block [data]="addDarkMode" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <strong>Blocks:</strong>
      a block is a whole screen already composed — a login form, a dashboard — and it installs by name, like a
      component. It carries the components it uses, so running it on a project that has none of them still leaves you
      with a block that compiles.
    </p>
    <z-code-block [data]="addBlock" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Each block is written to a directory of its own, under the
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">blocks</code>
      alias of
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">components.json</code>
      —
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">@/shared/blocks</code>
      unless you changed it.
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--path</code>
      moves them elsewhere, still one directory per block, and the components they need follow along.
    </p>
    <z-code-block [data]="addBlockPath" />

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">create</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Create a new project with the framework's own generator, already configured with a design preset. It is the
      one-command alternative to creating the project yourself and then running
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">init</code>
      .
    </p>
    <z-code-block [data]="createUsage" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <strong>Options:</strong>
    </p>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">[name]</code>
      — The name of the project and of the directory it is created in: lowercase letters, digits and dashes, starting
      with a letter
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--template &lt;template&gt;</code>
      — The project to scaffold:
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">angular</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">nx</code>
      or
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">analog</code>
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--preset &lt;code&gt;</code>
      — The design preset. Build one at
      <a class="text-foreground underline underline-offset-4" routerLink="/create">zardui.com/create</a>
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--pointer</code>
      — Use the pointer cursor on buttons
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--rtl</code>
      — The project reads right to left.
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--no-rtl</code>
      is the default
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--package-manager &lt;manager&gt;</code>
      —
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">npm</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">pnpm</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">yarn</code>
      or
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">bun</code>
      . Defaults to the one that ran the CLI, else npm
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">-c, --cwd &lt;cwd&gt;</code>
      — The directory the project is created in, defaults to the current one
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">-y, --yes</code>
      — Skip confirmations and use the default design when no preset is given
    </p>

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <strong>What it does:</strong>
    </p>
    <ul class="text-muted-foreground mt-4 list-disc space-y-2 pl-6 text-base leading-relaxed">
      <li>
        scaffolds the project:
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">ng new</code>
        for Angular,
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">create-nx-workspace</code>
        plus the Angular application generator for Nx,
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">create-analog</code>
        for Analog — every prompt answered by a flag, with plain CSS styles
      </li>
      <li>
        runs
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">init --preset</code>
        on the new project, as the type that matches the template
      </li>
      <li>
        installs
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">button</code>
        , so there is a component to start from
      </li>
    </ul>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">create</code>
      only creates applications. For a library, or a project that already exists, use
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">init --preset</code>
      .
    </p>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <strong>Interactive:</strong>
      with no flags, the command asks for the template first — the cursor starts on the first item, it is never chosen
      for you — then the name, then the preset. The preset question lists the default design and a curated set;
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">Custom…</code>
      prints the link to the create page so you can design one and paste its code.
    </p>
    <z-code-block [data]="createInteractive" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Whatever you pass as a flag is not asked again, so a command copied from the create page runs without a single
      question:
    </p>
    <z-code-block [data]="createFlags" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <strong>Non-interactive use:</strong>
      outside a terminal — CI, pipes — nobody can be asked, so the name and
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--template</code>
      are always required, and the preset must come from
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--preset</code>
      or from
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--yes</code>
      , which accepts the default design. Errors name the flag or the preset that is wrong.
    </p>
    <z-code-block [data]="createHeadless" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <strong>Safe by design:</strong>
      every flag, the preset, the project name and the registry are checked before anything is written. A name that
      already exists in the target directory is refused —
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">create</code>
      never writes into an existing directory — and an unreachable registry stops it before the scaffold starts, so a
      failure leaves no half-created project. If configuring fails after the scaffold, the project is kept and the
      message tells you how to resume with
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">init --preset</code>
      .
    </p>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <strong>Right to left:</strong>
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--rtl</code>
      sets
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">dir="rtl"</code>
      on
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">&lt;html&gt;</code>
      and nothing else.
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">lang</code>
      stays
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">"en"</code>
      , because direction does not say which language the content is in — set it yourself to the right one (
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">ar</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">he</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">fa</code>
      …).
    </p>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">apply</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Apply a design preset to a project that is already initialized, without running init again. It never prompts and
      never touches components.
    </p>
    <z-code-block [data]="applyUsage" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <strong>Options:</strong>
    </p>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--preset &lt;code&gt;</code>
      — The preset to apply (required)
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--only &lt;parts&gt;</code>
      — Apply only part of it:
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">theme</code>
      or
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">font</code>
      , comma-separated for both. Defaults to all of it
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--pointer</code>
      — Add the pointer cursor rule for buttons to the theme
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--no-pointer</code>
      — Remove it
      <br />
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">-c, --cwd &lt;cwd&gt;</code>
      — Working directory, defaults to the current one
    </p>

    <ul class="text-muted-foreground mt-4 list-disc space-y-2 pl-6 text-base leading-relaxed">
      <li>
        <strong>Full preset</strong>
        (no
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--only</code>
        ) — theme tokens, fonts, icon library and the
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">style</code>
        ,
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">icons</code>
        ,
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">menuColor</code>
        ,
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">menuAppearance</code>
        ,
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">menuAccent</code>
        and
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">preset</code>
        keys of
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">components.json</code>
      </li>
      <li>
        <strong>theme</strong>
        — the base color, theme and chart colors, radius, menu look and base layer in your stylesheet, and the matching
        keys in
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">components.json</code>
      </li>
      <li>
        <strong>font</strong>
        — the font packages, their imports and
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--font-sans</code>
        /
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--font-heading</code>
      </li>
    </ul>
    <z-code-block [data]="applyExamples" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Rules of your own below the theme block in the stylesheet survive, and so do the aliases and every other key of
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">components.json</code>
      . Components already in your project keep their current style and icons; add them again with
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--overwrite</code>
      to follow the preset.
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
  readonly addBlock: CodeBlockData = BLOCK_9;
  readonly addBlockPath: CodeBlockData = BLOCK_10;
  readonly createUsage: CodeBlockData = BLOCK_11;
  readonly createInteractive: CodeBlockData = BLOCK_12;
  readonly createFlags: CodeBlockData = BLOCK_13;
  readonly createHeadless: CodeBlockData = BLOCK_14;
  readonly initPreset: CodeBlockData = BLOCK_15;
  readonly applyUsage: CodeBlockData = BLOCK_16;
  readonly applyExamples: CodeBlockData = BLOCK_17;
}
