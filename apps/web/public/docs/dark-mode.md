---
title: Dark Mode
description: Complete dark mode system in ZardUI using TailwindCSS v4 custom variants and the ZardDarkMode service for seamless theme switching.
---

# Dark Mode

Complete dark mode system in ZardUI using TailwindCSS v4 custom variants and the ZardDarkMode service for seamless theme switching.

Dark mode in ZardUI is a single Angular service — `ZardDarkMode` — paired with the TailwindCSS v4 `@custom-variant dark` variant. Install it with a single CLI command or wire it up by hand; both paths are documented below.

## How it works

There is no theme provider to wrap your app in and no context to thread through components. The service owns a single piece of state — the theme preference — and writes the result of that state onto the root `<html>` element. TailwindCSS does the rest.

### The service applies the theme

Every time the preference changes, `updateThemeMode` toggles the `.dark` class and sets the `data-theme` attribute on the `<html>` element.

### TailwindCSS resolves the variant

`@custom-variant dark (&:is(.dark *))` in `src/styles.css` tells TailwindCSS to resolve every `dark:` utility against that class, so components restyle themselves without a single line of extra code.

### System preference stays live

When the mode is set to `system` the service subscribes to `(prefers-color-scheme: dark)` through Angular's `MediaMatcher` and follows the operating system as it changes — no reload required.

## Installation

Let the CLI wire everything up for you, or follow the manual steps when your project does not match the default structure.

## Command

### Run the CLI

Add the dark mode service to your project.

```
npx zard-cli@latest add dark-mode
```

### Answer the prompt

The CLI asks where your index.html lives because it needs to inject the theme script before Angular bootstraps. Press enter to accept the default.

```bash
Terminal
```

```
✔ Installed 1 component

Dark mode requires additional configuration.

✔ Where is your index.html file? … src/index.html
✔ Successfully inserted theme script before </head> tag.
✔ Dark mode configured

Done!
```

### Review what the CLI changed

The command is not just a file copy — it wires the service into your app.

```bash
What the command touches
```

```
your-app/
├── components.json                          # read — aliases.services resolves the target folder
└── src/
    ├── index.html                           # updated — inline theme script added before </head>
    └── app/
        └── shared/
            ├── core/
            │   └── provider/
            │       └── providezard.ts       # updated — provideAppInitializer added as first provider
            └── services/
                ├── dark-mode.ts             # created — the ZardDarkMode service
                └── index.ts                 # created — barrel export
```

### Add a theme toggle

Inject the service in any component and let users switch themes.

[See the usage example](/docs/dark-mode#usage)

## Working with the CLI

`zard-cli add dark-mode` is the only entry in the registry that also edits files you already own. It is worth knowing exactly what it does before you run it.

### Prerequisites

The command expects a project that has already been initialized with `zard-cli init` — that is, a `components.json` at the root of the project and a `shared/core/provider/providezard.ts` file. Without the config the command stops with a `Configuration not found` error. Read more about the [CLI](/docs/cli) and the [components.json](/docs/components-json) file.

### What the command changes

Unlike a component, dark mode is not a plain file copy. Four things happen:

- `dark-mode.ts` and `index.ts` are created in your services directory.
- An inline `<script>` is injected right before `</head>` in the `index.html` you point it at.
- `provideAppInitializer(() => inject(ZardDarkMode).init())` becomes the first provider inside `makeEnvironmentProviders([...])` in `shared/core/provider/providezard.ts` — together with the `inject` and `provideAppInitializer` imports from `@angular/core` and the `ZardDarkMode` import.
- If `providezard.ts` does not exist, the CLI warns and skips that step. Run `zard-cli init` first, or follow the Manual tab.

### Options

`-y, --yes` — Skip the confirmation prompt. The `index.html` question is still asked, because the CLI cannot guess that path for you.
`-o, --overwrite` — Overwrite an existing `dark-mode.ts` instead of leaving it untouched. Use it to pull in a newer version of the service.
`-p, --path <path>` — Write the service somewhere other than the folder resolved from your `components.json` aliases.
`-c, --cwd <cwd>` — Run against another working directory, handy in a monorepo.
`-a, --all` — Add every component in the registry, dark mode included.

### Running it twice is safe

Both edits are idempotent. The theme script is not injected again when `localStorage.theme` is already present in the `index.html` file, and the provider is not duplicated when `ZardDarkMode` already appears in `providezard.ts` itself.

### Where the service is written

The registry entry declares `basePath: 'services'` so the destination comes from the `aliases.services` entry of your `components.json` — which defaults to `@/shared/services` when you have not customized it. The same alias is used for the import statement added to `providezard.ts` so a custom alias stays consistent on both ends.

### When to prefer the manual installation

- The project has no `providezard.ts` — the provider step would be skipped anyway.
- The folder structure is customized beyond what the aliases can express.
- You are in a monorepo where `index.html` lives outside the default path and you would rather edit it yourself.

**Note:** if you leave the `index.html` question blank, the CLI logs `Skipping dark mode script injection` and returns without touching the file. The service still works, but the first paint happens before the theme is resolved — expect a flash of the wrong theme on load until you add the script yourself.

## Usage

`ZardDarkMode` is provided in root, so a plain `inject()` is all you need. Everything it exposes is a signal, which means templates update on their own.

src/app/shared/components/theme-switcher/theme-switcher.component.ts

```
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { EDarkModes, ZardDarkMode } from '@/shared/services/dark-mode';

@Component({
  selector: 'app-theme-switcher',
  template: `
    <button (click)="darkMode.toggleTheme()">Toggle light / dark</button>
    <button (click)="darkMode.toggleTheme(EDarkModes.SYSTEM)">Follow the system</button>

    <p>Preference: {{ darkMode.currentTheme() }}</p>
    <p>Applied theme: {{ darkMode.themeMode() }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSwitcherComponent {
  protected readonly darkMode = inject(ZardDarkMode);
  protected readonly EDarkModes = EDarkModes;
}
```

### Switching themes

Calling `toggleTheme()` with no argument flips between light and dark. Pass a value — `EDarkModes.LIGHT` / `EDarkModes.DARK` / `EDarkModes.SYSTEM` — to set a specific mode instead. That is exactly what the three buttons in the demo below do.

### Preference versus applied theme

This is the one distinction worth internalizing. `currentTheme()` returns the preference the user picked — `'light'` / `'dark'` / `'system'` — as a read-only signal, so nothing outside the service can mutate it.

`themeMode()` returns the theme actually applied to the document, which is only ever `'light'` or `'dark'` and never `'system'` because it has already resolved the system mode against `prefers-color-scheme` for you. Use the first one to render the selected state of a theme picker, and the second one to decide whether to show a sun or a moon.

Preference vs. applied theme

```
// The user picked "system" and the operating system is currently in dark mode.

darkMode.currentTheme(); // 'system' — the preference stored in localStorage.theme
darkMode.themeMode(); //    'dark'   — the theme actually applied to the <html> element
```

### Persistence and initialization

The preference is written to `localStorage` under the `theme` key on every change, which is the same key the inline script reads on the next load. `init()` reads that value back and starts listening to the media query — it is already called for you by the `provideAppInitializer` registered during installation, so you rarely call it by hand. The service is also SSR-safe: on the server every method returns early instead of touching `document` or `localStorage` at all.

### A toggle in a header component

The header of this documentation site is built exactly like this — a ghost button that calls `toggleTheme()` and swaps its icon based on the value of `themeMode()` at that moment.

src/app/shared/components/header/header.component.ts

```
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMoon, lucideSun } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardDarkMode } from '@/shared/services/dark-mode';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [NgIcon, ZardButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideSun, lucideMoon })],
})
export class HeaderComponent {
  protected readonly darkMode = inject(ZardDarkMode);

  toggleTheme(): void {
    this.darkMode.toggleTheme();
  }
}
```

src/app/shared/components/header/header.component.html

```
<button z-button zType="ghost" zSize="sm" (click)="toggleTheme()">
  @if (darkMode.themeMode() === 'dark') {
    <ng-icon name="lucideSun" class="size-4.5!" />
  } @else {
    <ng-icon name="lucideMoon" class="size-4.5!" />
  }
  <span class="sr-only">Toggle theme</span>
</button>
```

## Interactive Demo

Test the dark mode system in action and see how components react to theme changes.

### Theme Control

Current theme: **system**

#### Card Example

This card automatically changes with the theme.

#### Muted Background

Background with responsive opacity.

#### Primary Colors

Primary colors adapted to theme.
