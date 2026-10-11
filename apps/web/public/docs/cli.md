---
title: CLI
description: Use the zard/ui CLI to add beautiful, accessible components to your Angular project with a single command.
---

# CLI

Use the zard/ui CLI to add beautiful, accessible components to your Angular project with a single command.

## Installation

Get zard/ui up and running in your project with these steps.

### Step 1: Initialize your project

Run the init command to set up zard/ui. It installs the dependencies, writes the theme tokens and configures the import aliases — and, in an application, wires Tailwind into the build. What runs follows from the project type you pick in the first question.

```
npx zard-cli@latest init
```

The first question is what kind of project you are setting up. Everything after it follows from that answer — which files get configured, and where the components will live.

Terminal

```
◇ zard/ui · initialize
  Setting up zard/ui in your project…

◆  What are you setting up?
   ❯  Angular           Application — providers in app.config.ts, tokens in the global CSS.
      Angular Library   Publishable library — components ship with it, no app providers.
      Nx                Application inside an Nx workspace — paths go to tsconfig.base.json.
      Nx Library        Library inside an Nx workspace — lives in libs/, no app providers.
      Analog.js         Vite-powered Angular app — Tailwind is a Vite plugin, not PostCSS.
   Decides where the components live and what init has to configure.

   ↑/↓ choose    enter confirm    esc back
```

Answered questions stay on screen as a transcript, and the paths suggested from there on come from the project you picked:

Terminal

```
   ✔  project type  …  Nx
   ✔  app           …  web

◆  Where is your app.config.ts file?
   › apps/web/src/app/app.config.ts
   zard/ui registers its global providers in this file.

   enter confirm    ⌫ edit    esc back
```

Text fields are fully editable: arrows and `Home` / `End` move the caret, `Delete` and `Backspace` cut on either side of it, and `Ctrl+W` drops the previous word. The first keystroke replaces the whole suggestion — press `←` first if you would rather edit it.

Once everything is answered, the steps run with live progress. Steps that take a while — installing dependencies, usually — show how long they have been running, so a spinner is never mistaken for a stuck process.

Terminal

```
✔  Writing configuration…

   ✔  components.json                 —  component & utils aliases
   ✔  dependencies                    —  CDK, CVA, tailwind-merge, ng-icons (Lucide)
   ✔  apps/web/src/app/app.config.ts  —  zard/ui providers
   ✔  apps/web/.postcssrc.json        —  Tailwind PostCSS plugin
   ✔  apps/web/src/styles.css         —  theme tokens (neutral)
   ✔  tsconfig.base.json              —  import path aliases
   ✔  core & utils                    —  shared helpers used by every component

   ████████████████████████████████████████  100%

   ╭───────────────────────────────────────────────╮
   │ ✔  zard/ui has been initialized successfully!  │
   ╰───────────────────────────────────────────────╯
```

Starting a new project? Skip creating it by hand: `npx zard-cli@latest create my-app` scaffolds an Angular, Nx or Analog app and configures it with a design preset in one command — see the [create page](/create) and `create` under Commands below.

### Step 2: Add components

Add one component, several at once, or every available one. Dependencies between components are resolved for you: asking for a component pulls in whatever it needs.

```
npx zard-cli add button card dialog
```

### Step 3: Import and use

Import the components in your standalone components and start using them in your templates.

app.component.ts

```
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';

@Component({
  selector: 'app-root',
  imports: [ZardButtonComponent],
  template: `
    <z-button>Click me</z-button>
  `,
})
export class AppComponent {}
```

## Project types

The type you pick decides where the components live, which files get configured, and how Tailwind is wired into the build. These are not cosmetic differences — each one breaks a step if the plain Angular flow is applied to it.

| Type | Tailwind | TypeScript paths | Providers |
| --- | --- | --- | --- |
| `angular` | .postcssrc.json at the root | `tsconfig.json` | src/app/app.config.ts |
| `angular-library` | none — the consuming app owns the build | `tsconfig.json` | none |
| `nx` | .postcssrc.json inside the app | `tsconfig.base.json` | apps/<app>/src/app/app.config.ts |
| `nx-library` | none — the consuming app owns the build | `tsconfig.base.json` | none |
| `analog` | plugin in vite.config.ts | `tsconfig.json` | src/app/app.config.ts |

A few consequences worth knowing:

- **Nx keeps its paths in tsconfig.base.json.** The root `tsconfig.json` of an Nx workspace is not extended by any project, so an alias written there resolves in the editor and breaks in the build.
- **The Nx PostCSS config goes inside the application.** At the workspace root it would configure every app at once.
- **Analog builds with Vite** , so Tailwind is a Vite plugin there. A `.postcssrc.json` would never be read.
- **Libraries ship the theme as a package asset** , declared in `ng-package.json` so it lands at the package root. They register no providers — the application that consumes the library does that.

When a workspace declares more than one compatible project, init asks which one should receive the components. Projects that only exist to run end-to-end tests are left out.

## Commands

### init

Initialize your project and install dependencies.

Terminal

```
npx zard-cli init
```

**Options:**

`-y, --yes` — Skip the confirmation prompt
`-c, --cwd <cwd>` — Working directory, defaults to the current one
`-t, --type <type>` — Project type: `angular` , `angular-library` , `nx` , `nx-library` or `analog`
`-p, --project <name>` — Which workspace project to configure, when more than one is compatible
`--css <path>` — The global stylesheet that receives the theme (in a library, the file init creates)
`--app-config <path>` — The app.config.ts that receives provideZard(); ignored for libraries
`--base-color <color>` — Theme base color: `neutral` , `stone` , `zinc` , `gray` , `slate` , `mauve` , `olive` , `mist` or `taupe`
`--components-alias <alias>` , `--utils-alias <alias>` — Import aliases, defaults to `@/shared/components` and `@/shared/utils`
`--rtl` — The project reads right to left: records `"rtl": true` and sets `dir="rtl"` on `<html>` in `index.html` . `--no-rtl` is the default
`--preset <code>` — Apply a design preset (style, base color, theme, fonts, icons, radius, menu). Build one at [zardui.com/create](/create)
`--pointer` — Use the pointer cursor on buttons. Only with `--preset`

**What it does:**

- writes `components.json` with your answers
- installs the runtime dependencies and the Tailwind packages your project type needs
- registers `provideZard()` in your app config (applications only)
- wires Tailwind into the build — PostCSS or the Vite plugin, depending on the type (applications only)
- writes the theme tokens into the stylesheet you pointed it at
- maps the import alias in the right `tsconfig`
- copies the shared `core` and `utils` helpers every component depends on

In a library there is no build to wire and no app config to register providers in, so those two steps are skipped and one is added: the theme stylesheet is declared as an asset of the package, so it ships with it. Wiring Tailwind and calling `provideZard()` then belong to the application that consumes the library — the CLI says so at the end of the run.

Running it again on a configured project asks for confirmation first, and then overwrites what it wrote before.

**Non-interactive use:**

Outside a TTY — CI, pipes — there is nobody to answer the questions, so `--yes` is required and `--type` takes the place of the first one. Without it the workspace decides, which is a guess; pass it when it matters. Init refuses to run headless without `--yes` , because it overwrites your global CSS.

Terminal

```
npx zard-cli init --yes --type nx --project web
```

**With a preset:** `--preset` configures a project that already exists with a whole design in one go — the style, base color, theme and chart colors, fonts, icon library, radius and menu look. Any of the five project types accepts it, libraries included. It writes the same `components.json` and theme tokens as a plain init, plus the font packages with their imports, the icon library's `ng-icons` package and the `preset` key. It cannot be combined with `--base-color` , since the preset already chooses it.

Terminal

```
npx zard-cli init --preset Z6F9MtstG --pointer
```

A preset code starts with `Z` and is built on the [create page](/create) . The CLI decodes it locally and rejects a malformed code, or one that comes from another tool, before it touches a single file. Components you add afterwards are installed with the preset's icon library; components already in the project keep their current look until you add them again with `--overwrite` .

### add

Add components to your project, resolving their dependencies.

Terminal

```
npx zard-cli add [components...]
```

**Options:**

`-y, --yes` — Skip the confirmation prompt
`-o, --overwrite` — Overwrite existing files
`-c, --cwd <cwd>` — Working directory, defaults to the current one
`-a, --all` — Add every available component
`-p, --path <path>` — Write the components somewhere other than the configured alias

**Examples:**

```
npx zard-cli add button
```

Several at once:

Terminal

```
npx zard-cli add button card dialog
```

Everything:

Terminal

```
npx zard-cli add --all
```

With no arguments, a searchable list opens — pick with `space` and confirm with `enter` . Headless, add needs the component names or `--all` , since there is no list to pick from.

Terminal

```
npx zard-cli add
```

**Dark mode:** adding `dark-mode` also injects the theme script into your `index.html` and registers the initializer, so the chosen theme is applied before the first paint instead of flashing. It asks where the file is, suggesting the right path for your project type — at the root for Analog, under the app for Nx. This step needs an interactive terminal.

Terminal

```
npx zard-cli add dark-mode
```

### create

Create a new project with the framework's own generator, already configured with a design preset. It is the one-command alternative to creating the project yourself and then running `init` .

Terminal

```
npx zard-cli create [name]
```

**Options:**

`[name]` — The name of the project and of the directory it is created in: lowercase letters, digits and dashes, starting with a letter
`--template <template>` — The project to scaffold: `angular` , `nx` or `analog`
`--preset <code>` — The design preset. Build one at [zardui.com/create](/create)
`--pointer` — Use the pointer cursor on buttons
`--rtl` — The project reads right to left. `--no-rtl` is the default
`--package-manager <manager>` — `npm` , `pnpm` , `yarn` or `bun` . Defaults to the one that ran the CLI, else npm
`-c, --cwd <cwd>` — The directory the project is created in, defaults to the current one
`-y, --yes` — Skip confirmations and use the default design when no preset is given

**What it does:**

- scaffolds the project: `ng new` for Angular, `create-nx-workspace` plus the Angular application generator for Nx, `create-analog` for Analog — every prompt answered by a flag, with plain CSS styles
- runs `init --preset` on the new project, as the type that matches the template
- installs `button` , so there is a component to start from

`create` only creates applications. For a library, or a project that already exists, use `init --preset` .

**Interactive:** with no flags, the command asks for the template first — the cursor starts on the first item, it is never chosen for you — then the name, then the preset. The preset question lists the default design and a curated set; `Custom…` prints the link to the create page so you can design one and paste its code.

Terminal

```
npx zard-cli create
```

Whatever you pass as a flag is not asked again, so a command copied from the create page runs without a single question:

Terminal

```
npx zard-cli create my-app --template nx --preset Z6F9MtstG --pointer --rtl --package-manager pnpm
```

**Non-interactive use:** outside a terminal — CI, pipes — nobody can be asked, so the name and `--template` are always required, and the preset must come from `--preset` or from `--yes` , which accepts the default design. Errors name the flag or the preset that is wrong.

Terminal

```
npx zard-cli create my-app --template angular --yes
```

**Safe by design:** every flag, the preset, the project name and the registry are checked before anything is written. A name that already exists in the target directory is refused — `create` never writes into an existing directory — and an unreachable registry stops it before the scaffold starts, so a failure leaves no half-created project. If configuring fails after the scaffold, the project is kept and the message tells you how to resume with `init --preset` .

**Right to left:** `--rtl` sets `dir="rtl"` on `<html>` and nothing else. `lang` stays `"en"` , because direction does not say which language the content is in — set it yourself to the right one ( `ar` , `he` , `fa` …).

### apply

Apply a design preset to a project that is already initialized, without running init again. It never prompts and never touches components.

Terminal

```
npx zard-cli apply --preset <code> [--only theme|font]
```

**Options:**

`--preset <code>` — The preset to apply (required)
`--only <parts>` — Apply only part of it: `theme` or `font` , comma-separated for both. Defaults to all of it
`--pointer` — Add the pointer cursor rule for buttons to the theme
`--no-pointer` — Remove it
`-c, --cwd <cwd>` — Working directory, defaults to the current one

- **Full preset** (no `--only` ) — theme tokens, fonts, icon library and the `style` , `icons` , `menuColor` , `menuAppearance` , `menuAccent` and `preset` keys of `components.json`
- **theme** — the base color, theme and chart colors, radius, menu look and base layer in your stylesheet, and the matching keys in `components.json`
- **font** — the font packages, their imports and `--font-sans` / `--font-heading`

Terminal

```
npx zard-cli apply --preset Z6F9MtstG
npx zard-cli apply --preset Z6F9MtstG --only theme
npx zard-cli apply --preset Z6F9MtstG --only font
```

Rules of your own below the theme block in the stylesheet survive, and so do the aliases and every other key of `components.json` . Components already in your project keep their current style and icons; add them again with `--overwrite` to follow the preset.

### Global options

`-v, --version` — Print the version
`--debug` — Verbose logging, including stack traces on failure. Can also be turned on with the `ZARD_DEBUG` environment variable.

Terminal

```
npx zard-cli --version
npx zard-cli init --debug
```

## Configuration

The CLI stores configuration in `components.json` in your project root. This file is created automatically when you run `npx zard-cli init` , and the [components.json page](/docs/components-json) documents every field.

components.json

```
{
  "$schema": "https://zardui.com/schema.json",
  "style": "css",
  "icons": "lucide",
  "rtl": false,
  "projectType": "angular",
  "appConfigFile": "src/app/app.config.ts",
  "packageManager": "npm",
  "tailwind": {
    "css": "src/styles.css",
    "baseColor": "neutral"
  },
  "baseUrl": "src/app",
  "aliases": {
    "components": "@/shared/components",
    "utils": "@/shared/utils",
    "core": "@/shared/core",
    "services": "@/shared/services"
  }
}
```

### TypeScript path mappings

The CLI maps the import alias for you, in whichever tsconfig your project type actually extends — `tsconfig.base.json` on Nx, `tsconfig.json` elsewhere:

tsconfig.json

```
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/app/*"]
    }
  }
}
```

No `baseUrl` is written: the option became an error in TypeScript 6, and since 4.1 paths resolve relative to the tsconfig itself without it. Projects that already declare it are respected, with the mapping written relative to it.

This is what lets you import components and utilities through clean paths:

example.component.ts

```
import { ZardButtonComponent } from '@/shared/components/button';
import { mergeClasses } from '@/shared/utils/merge-classes';
```

### Custom registry

An optional `registryUrl` points the CLI at a registry other than the official one — for teams publishing their own component set.

components.json

```
{
  "registryUrl": "https://registry.acme.dev/r"
}
```

## Update

Update components in your project while preserving your customizations.

Coming Soon

The ZardUI team is actively working on an intelligent update system that will automatically update your components without compromising the custom rules and modifications you've implemented. This is an extremely complex solution that requires careful design to ensure your customizations remain intact. We appreciate your patience as we develop this feature to provide the best possible experience.

### Planned Features

- 🔄Smart detection of component changes Automatically identify which components have updates available
- 🛡️Preservation of user customizations Keep your custom modifications safe during updates
- 📊Conflict resolution with clear options Visual diff and merge tools to handle conflicts intelligently
- 🎯Selective component updates Choose which components to update and which to skip
- 📝Detailed changelog for each update See exactly what changed in each component version

### What to Expect

When the update command becomes available, it will intelligently analyze your components, detect differences from the latest versions, and offer safe update options that respect your modifications. The system will provide clear visual diffs and allow you to review changes before applying them.

Stay updated:

- [Changelog](/docs/changelog)
- [GitHub Repository](https://github.com/zard-ui/zardui)
