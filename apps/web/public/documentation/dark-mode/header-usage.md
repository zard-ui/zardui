```angular-ts title="src/app/shared/components/header/header.component.ts" showLineNumbers copyButton
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

```angular-html title="src/app/shared/components/header/header.component.html" showLineNumbers copyButton
<button z-button zType="ghost" zSize="sm" (click)="toggleTheme()">
  @if (darkMode.themeMode() === 'dark') {
    <ng-icon name="lucideSun" class="size-4.5!" />
  } @else {
    <ng-icon name="lucideMoon" class="size-4.5!" />
  }
  <span class="sr-only">Toggle theme</span>
</button>
```
