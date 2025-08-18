import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private readonly storageKey = 'theme';

  initTheme(): void {
    const savedTheme = localStorage.getItem(this.storageKey);
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);

    this.applyTheme(isDark ? 'dark' : 'light');
  }

  toggleTheme(): void {
    const currentTheme = this.getCurrentTheme();
    this.applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  }

  getCurrentTheme(): 'light' | 'dark' {
    return (localStorage.getItem(this.storageKey) as 'light' | 'dark') || 'light';
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    const html = document.documentElement;
    const isDark = theme === 'dark';

    html.classList.toggle('dark', isDark);
    html.setAttribute('data-theme', theme);
    html.style.colorScheme = theme;
    localStorage.setItem(this.storageKey, theme);
  }
}
