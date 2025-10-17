import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private readonly storageKey = 'theme';
  private readonly themeSignal = signal<'light' | 'dark'>('light');

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
    return this.themeSignal();
  }

  get theme() {
    return this.themeSignal.asReadonly();
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    const html = document.documentElement;
    const isDark = theme === 'dark';

    html.classList.toggle('dark', isDark);
    html.setAttribute('data-theme', theme);
    html.style.colorScheme = theme;
    localStorage.setItem(this.storageKey, theme);

    this.themeSignal.set(theme);
  }
}
