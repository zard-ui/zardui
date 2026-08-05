```angular-ts title="src/app/shared/components/theme-switcher/theme-switcher.component.ts" showLineNumbers copyButton
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

```typescript title="Preference vs. applied theme" copyButton
// The user picked "system" and the operating system is currently in dark mode.

darkMode.currentTheme(); // 'system' — the preference stored in localStorage.theme
darkMode.themeMode(); //    'dark'   — the theme actually applied to the <html> element
```
