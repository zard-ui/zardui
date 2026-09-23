---
title: Monorepo
description: Installing zard/ui into an Nx workspace: which files the aliases and Tailwind belong in, and how a library differs from an application.
---

# Monorepo

Installing zard/ui into an Nx workspace: which files the aliases and Tailwind belong in, and how a library differs from an application.

## What changes in a workspace

A single-app project has one of everything: one `tsconfig.json` , one global CSS file, one build. A workspace has one of each per project, plus a set of files at the root that every project inherits — and the two are not interchangeable. Writing to the wrong one is how a path alias ends up resolving in the editor and failing in the build.

That is the whole reason the project type is the first question the [CLI](/docs/cli) asks. It is not a label: it decides which file receives the aliases, where the Tailwind configuration is written, and whether there is an application to register providers in at all.

### Aliases go to tsconfig.base.json

Nx keeps the shared TypeScript configuration in `tsconfig.base.json` , and that is the file each project extends. The `tsconfig.json` at the root is not inherited by any project, so a path mapping written there never reaches the compiler. The editor resolves it anyway — it reads the root config — which is exactly what makes the failure confusing: the import looks fine until the build says it cannot find the module.

### PostCSS goes inside the app

The Angular build looks for a `.postcssrc.json` starting from the CSS file it is processing and walking up to the workspace root. Both the project directory and the root would be found — but the root configures every app in the workspace at once, including the ones that never asked for Tailwind. So the file is written inside the project that uses it, and the apps next door are left alone.

## Nx application

The `nx` type is for an application living inside the workspace — the case where the components are used, not published. Pick it in the wizard, or answer ahead of time with the flags.

```
npx zard-cli@latest init --type nx --project web
```

Every path in the report is relative to the workspace root, and each one belongs to the app that was chosen — except the aliases, which are shared by construction.

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
```

### The alias

The mapping points at the app's source root, so the components installed there are reachable from anywhere in the workspace under the prefix you configured. The prefix comes from the alias you chose — pick `@app/components` and the key is `@app/*` , not a fixed `@/*` .

tsconfig.base.json

```
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./apps/web/src/app/*"]
    }
  }
}
```

### Tailwind

Written next to the app's `project.json` , never at the workspace root. Running `init` again rewrites it on purpose: it is the way to fix a file left over from an earlier setup.

apps/web/.postcssrc.json

```
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

## Nx library

The `nx-library` type is for a library in `libs/` — the case where the components become part of something other teams install. A library is not a smaller application: there is no build to hook Tailwind into and no `app.config.ts` to register providers in, so those two steps do not run at all.

```
npx zard-cli@latest init --type nx-library --project ui
```

The configuration says as much: `appConfigFile` is empty, and `baseUrl` points at `src/lib` — the convention of both `ng generate library` and `nx g @nx/angular:library` , where `src/` holds the public entry point and everything it exports lives one level down.

components.json

```
{
  "$schema": "https://zardui.com/schema.json",
  "style": "css",
  "icons": "lucide",
  "rtl": false,
  "projectType": "nx-library",
  "appConfigFile": "",
  "packageManager": "npm",
  "tailwind": {
    "css": "libs/ui/src/styles.css",
    "baseColor": "neutral"
  },
  "baseUrl": "libs/ui/src/lib",
  "aliases": {
    "components": "@/shared/components",
    "utils": "@/shared/utils",
    "core": "@/shared/core",
    "services": "@/shared/services"
  }
}
```

### The theme ships with the library

The theme tokens are still written, but into the library instead of an app — and a loose `.css` file is not reachable from the entry point, so ng-packagr would leave it out of the package. Declaring it as an asset is what puts it in the published output, at the root of the package rather than under a `src/` that only means something inside the library's own repository.

libs/ui/ng-package.json

```
{
  "dest": "../../dist/libs/ui",
  "lib": {
    "entryFile": "src/index.ts"
  },
  "assets": [{ "glob": "styles.css", "input": "src", "output": "/" }]
}
```

An Nx library only gets an `ng-package.json` when it is publishable. Without one there is no package to assemble, the step is skipped with a warning, and the CSS is consumed straight from the source.

### What the consuming app still has to do

Two things belong to the application, and the library cannot do either on its behalf: registering the providers, and importing the tokens. Skip them and the components render unstyled, which reads like a broken install rather than a missing step — so `init` says so before it finishes.

One step is the library's, and it is easy to miss: `provideZard()` is installed with `core` inside the library, and `init` does not touch the public entry point. Re-export it from `src/index.ts` , or the import below has nothing to resolve to.

libs/ui/src/index.ts

```
export * from './lib/shared/core';
export * from './lib/shared/components/button';
```

apps/web/src/app/app.config.ts

```
import { ApplicationConfig } from '@angular/core';

import { provideZard } from '@acme/ui';

export const appConfig: ApplicationConfig = {
  providers: [provideZard()],
};
```

The stylesheet import resolves to the asset published at the package root. Tailwind is the application's to configure too: the library has no build of its own to run it in.

apps/web/src/styles.css

```
@import '@acme/ui/styles.css';
```

## Choosing the project

Once the type is answered, only the projects that match it are offered: applications for `nx` , libraries for `nx-library` . Offering the others would mean offering a target the following steps do not know how to configure.

Terminal

```
   ✔  project type  …  Nx

◆  Which app should receive the components?
   ❯  web       apps/web
      admin     apps/admin
      storefront  apps/storefront
   Its app.config.ts and global CSS are the ones init configures.

   ↑/↓ choose    enter confirm    esc back
```

With a single compatible project there is nothing to choose, so the question is skipped and the name appears in the header instead — the choice is still made, just not asked.

### Answering ahead of time

`--type` and `--project` are the two wizard questions given in advance. A name that is not a project of that type is refused with the list of the ones that are, rather than falling back to something you did not ask for.

Terminal

```
# Both answers up front — required in CI, where nobody can be asked.
npx zard-cli@latest init --type nx --project admin --yes
```

Without `--project` the first compatible project declared in the workspace is the default. Without a terminal to draw on — CI, a pipe — nobody can answer anything, so the workspace decides the type as well, and `--yes` becomes mandatory, because `init` overwrites the global CSS.

### e2e projects are left out

The Nx generator creates `<app>-e2e` declaring `projectType: "application"` , which put it in the menu next to the real apps — but there is no `app.config.ts` there, no global CSS and no build to configure. The suffix is the convention; a Playwright or Cypress config in the project directory catches the ones that were renamed.
