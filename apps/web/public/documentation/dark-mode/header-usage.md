# Usage in Header Component

The header uses the service to implement the theme toggle button, allowing users to switch between light and dark mode.

```typescript
// header.component.ts
import { Component, inject } from '@angular/core';
import { DarkModeService } from '@zard/shared/services/darkmode.service';

@Component({
  selector: 'z-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [RouterModule, ZardButtonComponent /* other imports */],
})
export class HeaderComponent {
  private readonly darkmodeService = inject(DarkModeService);

  toggleTheme(): void {
    this.darkmodeService.toggleTheme();
  }

  getCurrentTheme(): 'light' | 'dark' {
    return this.darkmodeService.getCurrentTheme();
  }
}
```

## Button Template

```html
<!-- header.component.html -->
<z-button (click)="toggleTheme()" variant="ghost" size="icon" [attr.aria-label]="getCurrentTheme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'">
  @if (getCurrentTheme() === 'dark') {
  <svg><!-- sun icon --></svg>
  } @else {
  <svg><!-- moon icon --></svg>
  }
</z-button>
```
