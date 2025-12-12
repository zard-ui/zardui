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

## Button Template

```html expandable="true"
<!-- header.component.html -->
<button z-button zType="ghost" zSize="sm" (click)="toggleTheme()">
  <z-icon zType="dark-mode" class="size-4.5" />
  <span class="sr-only">Toggle theme</span>
</button>
```
