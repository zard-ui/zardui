---
title: components.json
description: Configuration for your project.
---

# components.json

Configuration for your project.

The `components.json` file holds configuration for your project.

We use it to understand how your project is set up and how to generate components customized for your project.

The components.json file is optional

It is only required if you're using the CLI to add components to your project. If you're using the copy and paste method, you don't need this file.

You can create a `components.json` file in your project by running the following command:

```
npx zard-cli init
```

Starting from scratch? `npx zard-cli create my-app` scaffolds the project and writes this file for you, from a design preset.

See the CLI section for more information.

## $schema

The `$schema` property provides JSON schema validation for your `components.json` file. This enables autocompletion and validation in your IDE.

```
{
  "$schema": "https://zardui.com/schema.json"
}
```

## Style

The style of your design: the look a preset picks for spacing, radius, density and typography.

**Supported values:**`vega` , `nova` , `maia` , `lyra` , `mira` , `luma` , `sera` , `rhea` or the legacy `css` .

```
{
  "style": "nova"
}
```

The eight named styles are written by `zard-cli init --preset` , `zard-cli apply` and `zard-cli create` — pick one on the [create page](/create) . The default is `nova` .

`css` is what every project initialized before styles existed carries. It keeps working and is read as the current look, so nothing needs to change in an existing project.

For now the value is recorded, and the components the CLI installs are the same whichever style it names. Everything else a preset chooses is applied: theme, fonts, radius, menu look and icon library.

## Icons

The `icons` property names the icon set the components are written against. Every component draws through `ng-icons` , which stays the dependency either way — this picks which of its packages comes along ( `@ng-icons/lucide` ) and which names the components import.

**Supported values:**`lucide` , `tabler` , `hugeicons` , `phosphor` or `remixicon`

components.json

```
{
  "icons": "lucide"
}
```

Each value brings its own `ng-icons` package — `@ng-icons/lucide` , `@ng-icons/tabler-icons` , `@ng-icons/huge-icons` , `@ng-icons/phosphor-icons` and `@ng-icons/remixicon` — and every component you add afterwards is written with that set's names. `zard-cli init --preset` , `apply` and `create` write it from the preset; the valid values are the ones the registry publishes, and the CLI lists them if you write one it does not know.

When a set has no equivalent for an icon, the CLI reports it as missing when you add the component and keeps the lucide import, so the build still passes.

A `components.json` written before this property existed is read as `lucide` .

## RTL

The `rtl` property declares that the project reads right to left. It defaults to `false` .

components.json

```
{
  "rtl": false
}
```

The components are direction-agnostic, so the files the CLI installs are identical either way. `zard-cli init --rtl` and `zard-cli create --rtl` record `true` here and set `dir="rtl"` on `<html>` in the app's `index.html` . They leave `lang` alone — set it to your content's language ( `ar` , `he` , `fa` …) yourself.

## Menu

Three properties describe how menus, popovers and dropdowns look. They are written by `zard-cli init --preset` , `apply` and `create` , and absent from a project without a preset, which then has the defaults.

components.json

```
{
  "menuColor": "default",
  "menuAppearance": "solid",
  "menuAccent": "subtle"
}
```

- `menuColor` — `default` or `inverted` (dark in light mode and light in dark mode).
- `menuAppearance` — `solid` or `translucent` (with a backdrop blur). A translucent menu always uses the subtle accent.
- `menuAccent` — `subtle` (a neutral wash) or `bold` (the primary color) for the focused or hovered item.

## Preset

The `preset` property holds the preset code the project was last fully configured from — the short `Z…` code built on the [create page](/create) .

components.json

```
{
  "preset": "Z6F9MtstG"
}
```

It is informational: it records the design and nothing reads it to decide what to install, so a code from a newer CLI never makes `add` fail. It is written by a full `init --preset` , `create` or `apply` ; a partial `apply --only` leaves it alone.

## Project Type

The `projectType` property records the kind of project you chose when running init. The CLI uses it to know where the components live and how the build is wired: which file holds the TypeScript paths, whether Tailwind goes through PostCSS or a Vite plugin, and whether there is an application to register providers in.

**Supported values:**`angular` , `angular-library` , `nx` , `nx-library` or `analog`

components.json

```
{
  "projectType": "angular"
}
```

A `components.json` written before this property existed is read as `angular` .

## App Config File

The `appConfigFile` property specifies the path to your Angular application's configuration file. This is used by the CLI to automatically add providers like `provideZard()` when needed.

```
{
  "appConfigFile": "src/app/app.config.ts"
}
```

## Package Manager

The package manager to use for installing dependencies. This configuration helps the CLI use the correct package runner commands for your project.

**Supported values:**`npm` , `pnpm` , `yarn` , or `bun`

components.json

```
{
  "packageManager": "npm"
}
```

## Tailwind

Configuration to help the CLI understand how Tailwind CSS is set up in your project.

**Important** : Zard/ui only supports **Tailwind CSS v4** and **does not support Tailwind CSS v3** or **SCSS** .

### tailwind.css

Path to the CSS file that imports Tailwind CSS into your project.

```
{
  "tailwind": {
    "css": "src/styles.css"
  }
}
```

### tailwind.baseColor

This is used to generate the default color palette for your components. **Editing this value does not repaint the theme.** To change it afterwards run `zard-cli apply --preset <code> --only theme` , or copy the tokens by hand — all the themes exist in the [theming page](/docs/theming) .

Currently supported base colors ( `mauve` , `olive` , `mist` and `taupe` come with presets):

```
{
  "tailwind": {
    "baseColor": "neutral" | "stone" | "zinc" | "mauve" | "olive" | "mist" | "taupe" | "gray" | "slate"
  }
}
```

## Base URL

The `baseUrl` property defines the base directory for resolving aliases. This should match the `baseUrl` in your `tsconfig.json` .

When using `@/` prefix in your aliases, the CLI resolves paths relative to this base URL.

```
{
  "baseUrl": "src/app"
}
```

## Aliases

The CLI uses these values and the `paths` config from your `tsconfig.json` file to place generated components in the correct location.

Aliases use the `@/` prefix which resolves relative to your `baseUrl` configuration.

### aliases.components

Import alias for your UI components.

```
{
  "aliases": {
    "components": "@/shared/components"
  }
}
```

### aliases.utils

Import alias for your utility functions like `mergeClasses` .

```
{
  "aliases": {
    "utils": "@/shared/utils"
  }
}
```

### aliases.core

Import alias for core utilities like directives and providers (e.g., `provideZard()` ).

```
{
  "aliases": {
    "core": "@/shared/core"
  }
}
```

### aliases.services

Import alias for your Angular services.

```
{
  "aliases": {
    "services": "@/shared/services"
  }
}
```

## Current Zard/ui components.json

Here's the current `components.json` structure that Zard/ui supports:

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
