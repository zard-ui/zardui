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

### Command

1. **Run the CLI** — add the dark mode service to your project.

```bash
npx zard-cli@latest add dark-mode
```

```bash
pnpm dlx zard-cli@latest add dark-mode
```

```bash
yarn dlx zard-cli@latest add dark-mode
```

```bash
bunx zard-cli@latest add dark-mode
```

2. **Answer the prompt** — the CLI asks where your `index.html` lives because it needs to inject the theme script before Angular bootstraps. Press enter to accept the default.

```bash
✔ Installed 1 component

Dark mode requires additional configuration.

✔ Where is your index.html file? … src/index.html
✔ Successfully inserted theme script before </head> tag.
✔ Dark mode configured

Done!
```

3. **Review what the CLI changed** — the command is not just a file copy, it wires the service into your app.

```bash
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

4. **Add a theme toggle** — inject the service in any component and let users switch themes. See the Usage section below.

### Manual

1. **Add the dark variant.** This is the TailwindCSS v4 variant that makes every `dark:` utility respond to the `.dark` class on the root element.

```css
/* src/styles.css */
@custom-variant dark (&:is(.dark *));
```

2. **Create the dark mode service** in `src/app/shared/services/dark-mode.ts`. This is byte for byte the file the CLI installs.

```typescript
import { MediaMatcher } from '@angular/cdk/layout';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { afterNextRender, DestroyRef, Injectable, PLATFORM_ID, computed, inject, signal, effect } from '@angular/core';

export enum EDarkModes {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}
export type DarkModeOptions = EDarkModes.LIGHT | EDarkModes.DARK | EDarkModes.SYSTEM;

@Injectable({
  providedIn: 'root',
})
export class ZardDarkMode {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly mediaMatcher = inject(MediaMatcher);

  private static readonly STORAGE_KEY = 'theme';
  private handleThemeChange = (event: MediaQueryListEvent) => this.systemDark.set(event.matches);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly themeSignal = signal<DarkModeOptions>(EDarkModes.SYSTEM);
  private _query?: MediaQueryList;
  private readonly initialized = signal(false);
  private readonly systemDark = signal(false);
  readonly themeMode = computed<EDarkModes.LIGHT | EDarkModes.DARK>(() => {
    const activeTheme = this.themeSignal();
    if (activeTheme === EDarkModes.SYSTEM) {
      return this.systemDark() ? EDarkModes.DARK : EDarkModes.LIGHT;
    }
    return activeTheme;
  });

  constructor() {
    if (this.isBrowser) {
      effect(() => {
        if (!this.initialized()) {
          return;
        }
        const theme = this.themeSignal();
        const isDarkMode = this.isDarkModeActive(theme);
        this.updateThemeMode(isDarkMode, theme);
      });

      afterNextRender({
        write: () => {
          // Only initialize if init() wasn't already called synchronously (e.g., in tests)
          if (!this.initialized()) {
            this.ensureQueryInitialized();
            this.initializeTheme();
          }
        },
      });
    }
  }

  init() {
    if (!this.initialized() && this.isBrowser) {
      this.ensureQueryInitialized();
      this.initializeTheme();
    }
  }

  toggleTheme(targetMode?: DarkModeOptions): void {
    if (!this.isBrowser) {
      return;
    }

    if (targetMode) {
      this.applyTheme(targetMode);
    } else {
      const next = this.themeMode() === EDarkModes.DARK ? EDarkModes.LIGHT : EDarkModes.DARK;
      this.applyTheme(next);
    }
  }

  /**
   * Returns a ReadonlySignal<"light" | "dark" | "system"> that cannot be mutated externally.
   * Call currentTheme() to access the value or use it directly in templates where signals are supported.
   * @example service.currentTheme() // returns "light", "dark", or "system"
   */
  get currentTheme() {
    return this.themeSignal.asReadonly();
  }

  private ensureQueryInitialized(): void {
    if (!this._query) {
      this._query = this.mediaMatcher.matchMedia('(prefers-color-scheme: dark)');
      this.systemDark.set(this._query.matches);
      this.destroyRef.onDestroy(() => this.handleSystemChanges(false));
    }
  }

  private get query(): MediaQueryList {
    if (!this.isBrowser || !this._query) {
      throw new Error('MediaQueryList not available: either running on server or not initialized');
    }
    return this._query;
  }

  private initializeTheme(): void {
    const storedTheme = this.getStoredTheme();
    if (storedTheme) {
      this.themeSignal.set(storedTheme);
    }

    if (!storedTheme || storedTheme === EDarkModes.SYSTEM) {
      this.handleSystemChanges();
    }
    this.initialized.set(true);

    const theme = this.themeSignal();
    this.updateThemeMode(this.isDarkModeActive(theme), theme);
  }

  private applyTheme(theme: DarkModeOptions): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      localStorage.setItem(ZardDarkMode.STORAGE_KEY, theme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
    this.themeSignal.set(theme);

    if (theme === EDarkModes.SYSTEM) {
      if (this.query) {
        this.systemDark.set(this.query.matches);
      } else {
        this.ensureQueryInitialized();
      }
      this.handleSystemChanges();
    } else {
      this.handleSystemChanges(false);
    }
  }

  private getStoredTheme(): DarkModeOptions | undefined {
    if (!this.isBrowser) {
      return undefined;
    }

    try {
      const value = localStorage.getItem(ZardDarkMode.STORAGE_KEY);
      if (value === EDarkModes.LIGHT || value === EDarkModes.DARK || value === EDarkModes.SYSTEM) {
        return value;
      }
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error);
    }
    return undefined;
  }

  private updateThemeMode(isDarkMode: boolean, themeMode: EDarkModes): void {
    const html = this.document.documentElement;
    html.classList.toggle('dark', isDarkMode);
    html.setAttribute('data-theme', themeMode);
  }

  private isDarkModeActive(currentTheme: DarkModeOptions): boolean {
    if (!this.isBrowser) {
      return false;
    }

    return currentTheme === EDarkModes.DARK || (currentTheme === EDarkModes.SYSTEM && this.systemDark());
  }

  private handleSystemChanges(addListener = true): void {
    if (!this._query) {
      return;
    }

    try {
      if (addListener) {
        this.query.addEventListener('change', this.handleThemeChange);
      } else {
        this.query.removeEventListener('change', this.handleThemeChange);
      }
    } catch (error) {
      console.warn('Failed to manage media query event listener:', error);
    }
  }
}
```

Add the barrel export in `src/app/shared/services/index.ts`:

```typescript
export * from './dark-mode';
```

3. **Prevent the flash of incorrect theme.** Add this script immediately before `</head>` in `src/index.html`. It runs before Angular bootstraps, reads `localStorage.theme`, falls back to `prefers-color-scheme` when the value is `system` or missing, and applies `.dark` and `data-theme` to the `<html>` element — so the first paint already uses the right theme.

```html
<script>
  (function () {
    const html = document.documentElement;

    try {
      const theme = localStorage.theme;
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;

      const isSystem = theme === 'system' || !('theme' in localStorage);
      const isDark = theme === 'dark' || (isSystem && prefersDark);
      html.classList.add('scheme-light-dark');
      html.classList.toggle('dark', isDark);
      html.setAttribute('data-theme', theme ?? 'system');
    } catch (_) {}
  })();
</script>
```

4. **Initialize the service.** Register `provideAppInitializer` as the first provider so the theme is resolved before the first component renders.

```typescript
// src/app/shared/core/provider/providezard.ts
import { inject, makeEnvironmentProviders, provideAppInitializer, type EnvironmentProviders } from '@angular/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardDarkMode } from '@/shared/services/dark-mode';

import { ZardDebounceEventManagerPlugin } from './event-manager-plugins/zard-debounce-event-manager-plugin';
import { ZardEventManagerPlugin } from './event-manager-plugins/zard-event-manager-plugin';

export function provideZard(): EnvironmentProviders {
  const eventManagerPlugins = [
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: ZardEventManagerPlugin,
      multi: true,
    },
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: ZardDebounceEventManagerPlugin,
      multi: true,
    },
  ];

  return makeEnvironmentProviders([provideAppInitializer(() => inject(ZardDarkMode).init()), ...eventManagerPlugins]);
}
```

If you do not use `provideZard()`, add the same initializer to `appConfig.providers` instead:

```typescript
// src/app/app.config.ts
import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';

import { ZardDarkMode } from '@/shared/services/dark-mode';

export const appConfig: ApplicationConfig = {
  providers: [provideAppInitializer(() => inject(ZardDarkMode).init())],
};
```

5. **Add a theme toggle.** Inject the service wherever you want to expose the switch — a header is the usual place.

```typescript
// src/app/shared/components/header/header.component.ts
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

```html
<!-- src/app/shared/components/header/header.component.html -->
<button z-button zType="ghost" zSize="sm" (click)="toggleTheme()">
  @if (darkMode.themeMode() === 'dark') {
  <ng-icon name="lucideSun" class="size-4.5!" />
  } @else {
  <ng-icon name="lucideMoon" class="size-4.5!" />
  }
  <span class="sr-only">Toggle theme</span>
</button>
```

6. **That's it.** Your app now switches between light, dark and system themes.

## Working with the CLI

`zard-cli add dark-mode` is the only entry in the registry that also edits files you already own. It is worth knowing exactly what it does before you run it.

### Prerequisites

The command expects a project that has already been initialized with `zard-cli init` — that is, a `components.json` at the root of the project and a `shared/core/provider/providezard.ts` file. Without the config the command stops with a `Configuration not found` error.

### What the command changes

Unlike a component, dark mode is not a plain file copy. Four things happen:

- `dark-mode.ts` and `index.ts` are created in your services directory.
- An inline `<script>` is injected right before `</head>` in the `index.html` you point it at.
- `provideAppInitializer(() => inject(ZardDarkMode).init())` becomes the first provider inside `makeEnvironmentProviders([...])` in `shared/core/provider/providezard.ts` — together with the `inject` and `provideAppInitializer` imports from `@angular/core` and the `ZardDarkMode` import.
- If `providezard.ts` does not exist, the CLI warns and skips that step. Run `zard-cli init` first, or follow the manual installation.

### Options

- `-y, --yes` — Skip the confirmation prompt. The `index.html` question is still asked, because the CLI cannot guess that path for you.
- `-o, --overwrite` — Overwrite an existing `dark-mode.ts` instead of leaving it untouched. Use it to pull in a newer version of the service.
- `-p, --path <path>` — Write the service somewhere other than the folder resolved from your `components.json` aliases.
- `-c, --cwd <cwd>` — Run against another working directory, handy in a monorepo.
- `-a, --all` — Add every component in the registry, dark mode included.

### Running it twice is safe

Both edits are idempotent. The theme script is not injected again when `localStorage.theme` is already present in the `index.html` file, and the provider is not duplicated when `ZardDarkMode` already appears in `providezard.ts` itself.

### Where the service is written

The registry entry declares `basePath: 'services'` so the destination comes from the `aliases.services` entry of your `components.json` — which defaults to `@/shared/services` when you have not customized it. The same alias is used for the import statement added to `providezard.ts` so a custom alias stays consistent on both ends.

### When to prefer the manual installation

- The project has no `providezard.ts` — the provider step would be skipped anyway.
- The folder structure is customized beyond what the aliases can express.
- You are in a monorepo where `index.html` lives outside the default path and you would rather edit it yourself.

> **Note:** if you leave the `index.html` question blank, the CLI logs `Skipping dark mode script injection` and returns without touching the file. The service still works, but the first paint happens before the theme is resolved — expect a flash of the wrong theme on load until you add the script yourself.

## Usage

`ZardDarkMode` is provided in root, so a plain `inject()` is all you need. Everything it exposes is a signal, which means templates update on their own.

```typescript
// src/app/shared/components/theme-switcher/theme-switcher.component.ts
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

Calling `toggleTheme()` with no argument flips between light and dark. Pass a value — `EDarkModes.LIGHT` / `EDarkModes.DARK` / `EDarkModes.SYSTEM` — to set a specific mode instead. That is exactly what the three buttons in the interactive demo do.

### Preference versus applied theme

This is the one distinction worth internalizing. `currentTheme()` returns the preference the user picked — `'light'` / `'dark'` / `'system'` — as a read-only signal, so nothing outside the service can mutate it.

`themeMode()` returns the theme actually applied to the document, which is only ever `'light'` or `'dark'` and never `'system'` because it has already resolved the system mode against `prefers-color-scheme` for you. Use the first one to render the selected state of a theme picker, and the second one to decide whether to show a sun or a moon.

```typescript
// The user picked "system" and the operating system is currently in dark mode.

darkMode.currentTheme(); // 'system' — the preference stored in localStorage.theme
darkMode.themeMode(); //    'dark'   — the theme actually applied to the <html> element
```

### Persistence and initialization

The preference is written to `localStorage` under the `theme` key on every change, which is the same key the inline script reads on the next load. `init()` reads that value back and starts listening to the media query — it is already called for you by the `provideAppInitializer` registered during installation, so you rarely call it by hand. The service is also SSR-safe: on the server every method returns early instead of touching `document` or `localStorage` at all.

## Interactive Demo

Test the dark mode system in action and see how components react to theme changes.

### Theme Control

Three buttons switch between system, light and dark, and three cards show how `bg-background`, `bg-muted/50` and `bg-primary` react to the change.
