## Usage in Header Component

### (or any component you want to use to trigger the theme)

The header uses the service to implement the theme toggle button, allowing users to switch between light and dark mode.

```typescript expandable="true"
// header.component.ts
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { DarkModeOptions, EDarkModes, ZardDarkMode } from '@zard/services/dark-mode';

@Component({
  selector: 'z-header',
  templateUrl: './header.component.html',
  imports: [
    RouterModule,
    ZardButtonComponent,
    ZardButtonGroupComponent,
    ZardIconComponent,
    /* other imports */
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly darkModeService = inject(ZardDarkMode);

  readonly EDarkModes = EDarkModes;
  readonly currentTheme = this.darkModeService.theme;

  activateTheme(theme: DarkModeOptions): void {
    this.darkModeService.activateTheme(theme);
  }
}
```

## Button Template

```html expandable="true"
<!-- header.component.html -->
@let theme = currentTheme();
<z-button-group>
  <button
    z-button
    zType="ghost"
    zSize="sm"
    [disabled]="theme === EDarkModes.SYSTEM"
    [aria-pressed]="theme === EDarkModes.SYSTEM"
    (click)="activateTheme(EDarkModes.SYSTEM)"
  >
    <z-icon zType="sun-moon" />
    <span class="sr-only">Use system theme</span>
  </button>
  <button
    z-button
    zType="ghost"
    zSize="sm"
    [disabled]="theme === EDarkModes.LIGHT"
    [aria-pressed]="theme === EDarkModes.LIGHT"
    (click)="activateTheme(EDarkModes.LIGHT)"
  >
    <z-icon zType="sun" />
    <span class="sr-only">Light theme</span>
  </button>
  <button
    z-button
    zType="ghost"
    zSize="sm"
    [disabled]="theme === EDarkModes.DARK"
    [aria-pressed]="theme === EDarkModes.DARK"
    (click)="activateTheme(EDarkModes.DARK)"
  >
    <z-icon zType="moon" />
    <span class="sr-only">Dark theme</span>
  </button>
</z-button-group>
```
