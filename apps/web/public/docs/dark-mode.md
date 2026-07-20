---
title: Dark Mode
description: Complete dark mode system in ZardUI using TailwindCSS v4 custom variants and ZardDarkMode service for seamless theme switching.
---

# Dark Mode

Complete dark mode system in ZardUI using TailwindCSS v4 custom variants and ZardDarkMode service for seamless theme switching.

ZardUI implements a robust dark mode system using `@custom-variant dark` from TailwindCSS v4 combined with an Angular `Dark Mode Service` for state management and persistence.

## Current Implementation

The current system works by applying the `.dark` class to the root HTML element, activating all dark style variations defined in the components.

## Dark Mode Service

The core of the system is an Angular service that manages theme state, persistence, and CSS class application. To install it, use CLI:

```
npx zard-cli add dark-mode
```

It will also update **index.html** to set appropriate dark mode theme before Angular is initialized and rendered.

## Usage in Application

The service is initialized within **index.html** . The HeaderComponent contains an example of how to use the service for toggle control.

### Usage in Header Component (or any component you want to use to trigger the theme)

The header uses the service to implement the theme toggle button, allowing users to switch between light and dark mode.

```
// header.component.ts
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { DarkModeOptions, EDarkModes, ZardDarkMode } from '@zard/services/dark-mode';

@Component({
  selector: 'z-header',
  templateUrl: './header.component.html',
  imports: [
    RouterModule,
    ZardButtonComponent,
    ZardIconComponent,
    /* other imports */
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly darkModeService = inject(ZardDarkMode);

  toggleTheme(): void {
    this.darkModeService.toggleTheme();
  }
}
```

### Button Template

```
<!-- header.component.html -->
<button z-button zType="ghost" zSize="sm" (click)="toggleTheme()">
  <z-icon zType="dark-mode" class="size-4.5" />
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
