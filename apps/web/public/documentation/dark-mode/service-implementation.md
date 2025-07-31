# DarkMode Service Implementation

Here's the complete implementation of the ZardUI DarkMode service:

```typescript
import { Injectable } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private readonly STORAGE_KEY = 'theme';
  private readonly DARK_CLASS = 'dark';

  /**
   * Initialize theme on app startup
   */
  initTheme(): void {
    const savedTheme = this.getSavedTheme();
    const theme = savedTheme || this.getSystemTheme();
    this.applyTheme(theme);
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): void {
    const currentTheme = this.getCurrentTheme();
    const newTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  /**
   * Set specific theme
   */
  setTheme(theme: Theme): void {
    this.applyTheme(theme);
    this.saveTheme(theme);
  }

  /**
   * Get current theme
   */
  getCurrentTheme(): Theme {
    return document.documentElement.classList.contains(this.DARK_CLASS) 
      ? 'dark' 
      : 'light';
  }

  /**
   * Get system theme preference
   */
  getSystemTheme(): Theme {
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  }

  private applyTheme(theme: Theme): void {
    const html = document.documentElement;
    
    if (theme === 'dark') {
      html.classList.add(this.DARK_CLASS);
    } else {
      html.classList.remove(this.DARK_CLASS);
    }
  }

  private saveTheme(theme: Theme): void {
    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  private getSavedTheme(): Theme | null {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved === 'dark' || saved === 'light' ? saved : null;
  }
}
```

## Key Implementation Details

- **Singleton Pattern**: Uses `providedIn: 'root'` for app-wide access
- **DOM Manipulation**: Efficiently manages `.dark` class on `<html>`
- **Storage Management**: Persists user preference
- **Type Safety**: Strong typing with Theme type
- **Error Handling**: Graceful fallback to system theme