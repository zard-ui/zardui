import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private readonly storageKey = 'theme';
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  initTheme(): void {
    if (!this.isBrowser) return;

    const savedTheme = localStorage.getItem(this.storageKey);
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);

    this.applyTheme(isDark ? 'dark' : 'light');
  }

  toggleTheme(): void {
    if (!this.isBrowser) return;

    const currentTheme = this.getCurrentTheme();
    this.applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  }

  getCurrentTheme(): 'light' | 'dark' {
    if (!this.isBrowser) return 'light';
    return (localStorage.getItem(this.storageKey) as 'light' | 'dark') || 'light';
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    if (!this.isBrowser) return;

    const html = document.documentElement;
    const isDark = theme === 'dark';

    html.classList.toggle('dark', isDark);
    html.setAttribute('data-theme', theme);
    html.style.colorScheme = theme;
    localStorage.setItem(this.storageKey, theme);
  }
}
