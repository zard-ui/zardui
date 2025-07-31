# Reactive Theming with Signals

Implement reactive theme changes using Angular signals:

## Signal-Based Theme State

```typescript
import { Component, inject, signal, effect } from '@angular/core';
import { DarkModeService } from '../services/darkmode.service';

@Component({
  selector: 'app-reactive-theme',
  template: `
    <div class="p-6">
      <h2>Current Theme: {{ currentTheme() }}</h2>
      <p>Theme changed {{ changeCount() }} times</p>
      
      <!-- Reactive content based on theme -->
      @if (isDarkMode()) {
        <div class="bg-gray-800 text-white p-4 rounded">
          <h3>Dark Mode Active</h3>
          <p>Enjoying the dark side! 🌙</p>
        </div>
      } @else {
        <div class="bg-white text-gray-900 p-4 rounded border">
          <h3>Light Mode Active</h3>
          <p>Bright and beautiful! ☀️</p>
        </div>
      }
      
      <button 
        (click)="toggleTheme()" 
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Switch to {{ isDarkMode() ? 'Light' : 'Dark' }} Mode
      </button>
    </div>
  `
})
export class ReactiveThemeComponent {
  private darkModeService = inject(DarkModeService);
  
  // Reactive signals
  currentTheme = signal<'light' | 'dark'>('light');
  changeCount = signal(0);
  isDarkMode = signal(false);

  constructor() {
    // Initialize signals
    this.updateThemeState();
    
    // React to theme changes
    effect(() => {
      const theme = this.currentTheme();
      this.isDarkMode.set(theme === 'dark');
      console.log(`Theme changed to: ${theme}`);
    });
  }

  toggleTheme(): void {
    this.darkModeService.toggleTheme();
    this.updateThemeState();
    this.changeCount.update(count => count + 1);
  }

  private updateThemeState(): void {
    const theme = this.darkModeService.getCurrentTheme();
    this.currentTheme.set(theme);
  }
}
```

## Computed Theme Properties

```typescript
import { Component, inject, signal, computed } from '@angular/core';
import { DarkModeService } from '../services/darkmode.service';

@Component({
  selector: 'app-computed-theme',
  template: `
    <div [class]="themeClasses()">
      <h1 [style]="headingStyle()">{{ themeLabel() }}</h1>
      <p>Background opacity: {{ backgroundOpacity() }}%</p>
    </div>
  `
})
export class ComputedThemeComponent {
  private darkModeService = inject(DarkModeService);
  
  currentTheme = signal<'light' | 'dark'>('light');
  
  // Computed properties that react to theme changes
  themeClasses = computed(() => {
    const isDark = this.currentTheme() === 'dark';
    return {
      'bg-gray-900 text-white': isDark,
      'bg-white text-gray-900': !isDark,
      'p-6 rounded-lg transition-all duration-300': true
    };
  });
  
  themeLabel = computed(() => {
    return `${this.currentTheme().charAt(0).toUpperCase() + this.currentTheme().slice(1)} Mode`;
  });
  
  backgroundOpacity = computed(() => {
    return this.currentTheme() === 'dark' ? 95 : 100;
  });
  
  headingStyle = computed(() => {
    const isDark = this.currentTheme() === 'dark';
    return {
      color: isDark ? '#60a5fa' : '#3b82f6',
      fontSize: '2rem',
      fontWeight: 'bold'
    };
  });

  constructor() {
    this.updateTheme();
  }

  private updateTheme(): void {
    this.currentTheme.set(this.darkModeService.getCurrentTheme());
  }

  toggleTheme(): void {
    this.darkModeService.toggleTheme();
    this.updateTheme();
  }
}
```

## Observable Pattern (Alternative)

```typescript
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DarkModeService } from '../services/darkmode.service';

@Component({
  selector: 'app-observable-theme',
  template: `
    <div>
      <h2>Theme: {{ currentTheme$ | async }}</h2>
    </div>
  `
})
export class ObservableThemeComponent implements OnInit, OnDestroy {
  private darkModeService = inject(DarkModeService);
  private destroy$ = new Subject<void>();
  
  currentTheme$ = new BehaviorSubject<'light' | 'dark'>('light');

  ngOnInit(): void {
    // Initialize theme
    const initialTheme = this.darkModeService.getCurrentTheme();
    this.currentTheme$.next(initialTheme);
    
    // Listen for storage changes (theme changes in other tabs)
    window.addEventListener('storage', this.handleStorageChange.bind(this));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    window.removeEventListener('storage', this.handleStorageChange.bind(this));
  }

  private handleStorageChange(event: StorageEvent): void {
    if (event.key === 'theme') {
      const newTheme = event.newValue as 'light' | 'dark';
      if (newTheme) {
        this.currentTheme$.next(newTheme);
      }
    }
  }

  toggleTheme(): void {
    this.darkModeService.toggleTheme();
    this.currentTheme$.next(this.darkModeService.getCurrentTheme());
  }
}
```

## Benefits of Reactive Theming

1. **Automatic updates**: Components react immediately to theme changes
2. **Performance**: Only re-render when theme actually changes
3. **Type safety**: Full TypeScript support with proper typing
4. **Computed values**: Derive complex styles and classes reactively
5. **Effects**: Trigger side effects when theme changes