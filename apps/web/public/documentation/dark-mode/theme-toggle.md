# Creating a Theme Toggle

Build a theme toggle button like the one used in ZardUI:

## Basic Toggle Button

```typescript
import { Component, inject } from '@angular/core';
import { DarkModeService } from '../services/darkmode.service';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button 
      (click)="toggleTheme()" 
      class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      [attr.aria-label]="getCurrentTheme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      @if (getCurrentTheme() === 'dark') {
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <!-- Sun icon for light mode -->
          <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
        </svg>
      } @else {
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <!-- Moon icon for dark mode -->
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
        </svg>
      }
    </button>
  `,
  standalone: true
})
export class ThemeToggleComponent {
  private darkModeService = inject(DarkModeService);

  toggleTheme(): void {
    this.darkModeService.toggleTheme();
  }

  getCurrentTheme(): 'light' | 'dark' {
    return this.darkModeService.getCurrentTheme();
  }
}
```

## Advanced Toggle with Animation

```typescript
@Component({
  selector: 'app-animated-toggle',
  template: `
    <button 
      (click)="toggleTheme()" 
      class="relative p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-all duration-300 hover:scale-105"
    >
      <div class="relative w-6 h-6">
        <!-- Sun icon -->
        <svg 
          class="absolute inset-0 w-6 h-6 text-yellow-500 transition-all duration-300"
          [class.opacity-100]="getCurrentTheme() === 'light'"
          [class.opacity-0]="getCurrentTheme() === 'dark'"
          [class.rotate-0]="getCurrentTheme() === 'light'"
          [class.rotate-180]="getCurrentTheme() === 'dark'"
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
        </svg>
        
        <!-- Moon icon -->
        <svg 
          class="absolute inset-0 w-6 h-6 text-blue-400 transition-all duration-300"
          [class.opacity-0]="getCurrentTheme() === 'light'"
          [class.opacity-100]="getCurrentTheme() === 'dark'"
          [class.rotate-180]="getCurrentTheme() === 'light'"
          [class.rotate-0]="getCurrentTheme() === 'dark'"
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
        </svg>
      </div>
    </button>
  `,
  standalone: true
})
export class AnimatedThemeToggleComponent {
  private darkModeService = inject(DarkModeService);

  toggleTheme(): void {
    this.darkModeService.toggleTheme();
  }

  getCurrentTheme(): 'light' | 'dark' {
    return this.darkModeService.getCurrentTheme();
  }
}
```

## Usage in Templates

```html
<!-- In your header component -->
<header class="flex items-center justify-between p-4">
  <h1>My App</h1>
  <app-theme-toggle></app-theme-toggle>
</header>
```