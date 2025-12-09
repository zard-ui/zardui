## Usage in Header Component

### (or any component you want to use to trigger the theme)

The header uses the service to implement the theme toggle button, allowing users to switch between light and dark mode.

```typescript expandable="true"
// header.component.ts
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { AppearanceOptions, EAppearanceModes, ZardAppearance } from '@shared/components/core/services/appearance';

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
  private readonly appearanceService = inject(ZardAppearance);

  readonly EAppearanceModes = EAppearanceModes;
  readonly currentTheme = this.appearanceService.theme;

  activateTheme(theme: AppearanceOptions): void {
    this.appearanceService.activateAppearance(theme);
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
    [disabled]="theme === EAppearanceModes.SYSTEM"
    [aria-pressed]="theme === EAppearanceModes.SYSTEM"
    (click)="activateTheme(EAppearanceModes.SYSTEM)"
  >
    <z-icon zType="sun-moon" />
    <span class="sr-only">Use system theme</span>
  </button>
  <button
    z-button
    zType="ghost"
    zSize="sm"
    [disabled]="theme === EAppearanceModes.LIGHT"
    [aria-pressed]="theme === EAppearanceModes.LIGHT"
    (click)="activateTheme(EAppearanceModes.LIGHT)"
  >
    <z-icon zType="sun" />
    <span class="sr-only">Light theme</span>
  </button>
  <button
    z-button
    zType="ghost"
    zSize="sm"
    [disabled]="theme === EAppearanceModes.DARK"
    [aria-pressed]="theme === EAppearanceModes.DARK"
    (click)="activateTheme(EAppearanceModes.DARK)"
  >
    <z-icon zType="moon" />
    <span class="sr-only">Dark theme</span>
  </button>
</z-button-group>
```
