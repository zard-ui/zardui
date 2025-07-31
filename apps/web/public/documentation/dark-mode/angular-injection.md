# Angular Dependency Injection

Use Angular's dependency injection to access the DarkMode service:

## Component Injection

```typescript
import { Component, inject } from '@angular/core';
import { DarkModeService } from '../services/darkmode.service';

@Component({
  selector: 'app-my-component',
  template: `
    <div>
      <p>Current theme: {{ getCurrentTheme() }}</p>
      <button (click)="toggleTheme()">Toggle Theme</button>
    </div>
  `
})
export class MyComponent {
  private darkModeService = inject(DarkModeService);

  toggleTheme(): void {
    this.darkModeService.toggleTheme();
  }

  getCurrentTheme(): 'light' | 'dark' {
    return this.darkModeService.getCurrentTheme();
  }
}
```

## Constructor Injection (Alternative)

```typescript
import { Component } from '@angular/core';
import { DarkModeService } from '../services/darkmode.service';

@Component({
  selector: 'app-my-component',
  template: `<!-- template -->`
})
export class MyComponent {
  constructor(private darkModeService: DarkModeService) {}

  toggleTheme(): void {
    this.darkModeService.toggleTheme();
  }
}
```

## Service in Standalone Components

```typescript
import { Component, inject } from '@angular/core';
import { DarkModeService } from '../services/darkmode.service';

@Component({
  selector: 'app-standalone',
  template: `<!-- template -->`,
  standalone: true
})
export class StandaloneComponent {
  protected darkModeService = inject(DarkModeService);
}
```

## Injection in Directives

```typescript
import { Directive, inject, OnInit } from '@angular/core';
import { DarkModeService } from '../services/darkmode.service';

@Directive({
  selector: '[appThemeAware]',
  standalone: true
})
export class ThemeAwareDirective implements OnInit {
  private darkModeService = inject(DarkModeService);

  ngOnInit(): void {
    const theme = this.darkModeService.getCurrentTheme();
    // Apply theme-specific logic
  }
}
```

## Best Practices

1. **Use inject() function** in modern Angular (v14+)
2. **Make service protected/public** if used in template
3. **Cache theme state** in component if needed frequently
4. **Initialize in ngOnInit** for theme-dependent logic