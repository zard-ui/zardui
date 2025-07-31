# Step 2: Add the DarkMode Service

Create a new service file `src/app/services/darkmode.service.ts`:

```typescript
import { Injectable } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private readonly STORAGE_KEY = 'theme';
  private readonly DARK_CLASS = 'dark';

  initTheme(): void {
    const savedTheme = this.getSavedTheme();
    const theme = savedTheme || this.getSystemTheme();
    this.applyTheme(theme);
  }

  toggleTheme(): void {
    const currentTheme = this.getCurrentTheme();
    const newTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    this.applyTheme(theme);
    this.saveTheme(theme);
  }

  getCurrentTheme(): Theme {
    return document.documentElement.classList.contains(this.DARK_CLASS) 
      ? 'dark' 
      : 'light';
  }

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

## Alternative: Copy from ZardUI

You can also copy the service directly from the ZardUI project:

```bash
cp node_modules/@zard/services/darkmode.service.ts src/app/services/
```

The service is framework-agnostic and will work in any Angular project.