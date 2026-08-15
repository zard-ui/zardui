---
title: components.json
description: Configuration for your project.
---

# components.json

Configuration for your project.

The `components.json` file holds configuration for your project.

We use it to understand how your project is set up and how to generate components customized for your project.

#### Note: The components.json file is optional

It is **only required if you're using the CLI** to add components to your project. If you're using the copy and paste method, you don't need this file.

You can create a `components.json` file in your project by running the following command:

```
npx zard-cli init
```

See the CLI section for more information.

## $schema

The `$schema` property provides JSON schema validation for your `components.json` file. This enables autocompletion and validation in your IDE.

```
{
  "$schema": "https://zardui.com/schema.json"
}
```

## Style

The style for your components. Currently, **Zard/ui only supports the "css" style** .

```
{
  "style": "css"
}
```

## Icons

The `icons` property names the icon set the components are written against. Every component draws through `ng-icons` , which stays the dependency either way — this picks which of its packages comes along ( `@ng-icons/lucide` ) and which names the components import.

**Supported values:**`lucide`

components.json

```
{
  "icons": "lucide"
}
```

Lucide is the only set supported today, so this is the only value the CLI accepts — writing anything else makes `add` reject the file. The property exists ahead of the sets that will follow: the registry already publishes, for every component, which icons it draws, so supporting another one is a matter of translating names rather than rewriting components.

A `components.json` written before this property existed is read as `lucide` .

## RTL

The `rtl` property declares that the project reads right to left. It defaults to `false` .

components.json

```
{
  "rtl": false
}
```

Turning it on does not change what the CLI installs yet — the components are the same either way. It is the place where that preference will live once they ship right-to-left variants, and it is in the file now so that a project can record the intent before then.

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

This is used to generate the default color palette for your components. **This cannot be changed after initialization.** (but if u want u can change manually, all the themes exist into the [theming page](/docs/theming) )

Currently supported base colors:

```
{
  "tailwind": {
    "baseColor": "gray" | "neutral" | "slate" | "stone" | "zinc"
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
