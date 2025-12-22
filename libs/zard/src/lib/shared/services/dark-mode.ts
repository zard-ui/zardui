import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Injectable, type OnDestroy, PLATFORM_ID, computed, inject, signal } from '@angular/core';

export enum EDarkModes {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}
export type DarkModeOptions = EDarkModes.LIGHT | EDarkModes.DARK | EDarkModes.SYSTEM;

@Injectable({
  providedIn: 'root',
})
export class ZardDarkMode implements OnDestroy {
  private readonly document = inject(DOCUMENT);

  private static readonly STORAGE_KEY = 'darkMode';
  private handleThemeChange = (event: MediaQueryListEvent) => this.updateThemeMode(event.matches);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly themeSignal = signal<DarkModeOptions>(EDarkModes.SYSTEM);
  private darkModeQuery?: MediaQueryList;

  constructor() {
    if (this.isBrowser) {
      this.darkModeQuery = this.getDarkModeQuery();
      this.initializeTheme();
    }
  }

  readonly theme = this.themeSignal.asReadonly();

  readonly themeMode = computed(() => {
    if (this.themeSignal() === EDarkModes.SYSTEM) {
      return this.isDarkMode() ? EDarkModes.DARK : EDarkModes.LIGHT;
    }
    return this.themeSignal();
  });

  ngOnDestroy(): void {
    this.handleSystemChanges(false);
  }

  toggleTheme(targetMode?: DarkModeOptions): void {
    if (!this.isBrowser) {
      return;
    }

    if (targetMode) {
      this.applyTheme(targetMode);
    } else {
      const next = this.themeMode() === EDarkModes.DARK ? EDarkModes.LIGHT : EDarkModes.DARK;
      this.applyTheme(next);
    }
  }

  getCurrentTheme(): DarkModeOptions {
    return this.themeSignal();
  }

  private applyTheme(theme: DarkModeOptions): void {
    if (!this.isBrowser) {
      return;
    }

    localStorage.setItem(ZardDarkMode.STORAGE_KEY, theme);
    this.themeSignal.set(theme);
    // whenever we apply theme call listener removal
    this.handleSystemChanges(false);

    this.updateThemeMode(this.isDarkMode());
    if (theme === EDarkModes.SYSTEM) {
      this.handleSystemChanges(true);
    }
  }

  private getStoredTheme(): DarkModeOptions | undefined {
    if (!this.isBrowser) {
      return undefined;
    }

    const value = localStorage.getItem(ZardDarkMode.STORAGE_KEY);
    if (value === EDarkModes.LIGHT || value === EDarkModes.DARK || value === EDarkModes.SYSTEM) {
      return value;
    }
    return undefined;
  }

  private initializeTheme(): void {
    const storedTheme = this.getStoredTheme();
    if (storedTheme) {
      this.themeSignal.set(storedTheme);
    }

    // Initialize theme based on current system preferences if no stored theme or if system mode
    if (!storedTheme || storedTheme === EDarkModes.SYSTEM) {
      this.updateThemeMode(this.isDarkMode());
      // Start listening for system changes if we're using system mode (either explicitly or by default)
      this.handleSystemChanges(true);
    } else {
      this.updateThemeMode(storedTheme === EDarkModes.DARK);
    }
  }

  private getThemeMode(isDarkMode: boolean): EDarkModes.LIGHT | EDarkModes.DARK {
    return isDarkMode ? EDarkModes.DARK : EDarkModes.LIGHT;
  }

  private updateThemeMode(isDarkMode: boolean): void {
    const themeMode = this.getThemeMode(isDarkMode);
    const html = this.document.documentElement;
    html.classList.toggle('dark', isDarkMode);
    html.setAttribute('data-theme', themeMode);
    html.style.colorScheme = themeMode;
  }

  private getDarkModeQuery(): MediaQueryList | undefined {
    if (!this.isBrowser) {
      return;
    }
    return this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)');
  }

  private isDarkMode(): boolean {
    if (!this.isBrowser) {
      return false;
    }

    const isSystemDarkMode = this.darkModeQuery?.matches ?? false;
    const stored = this.themeSignal();
    return stored === EDarkModes.DARK || (stored === EDarkModes.SYSTEM && isSystemDarkMode);
  }

  private handleSystemChanges(addListener: boolean): void {
    if (addListener) {
      this.darkModeQuery?.addEventListener('change', this.handleThemeChange);
    } else {
      this.darkModeQuery?.removeEventListener('change', this.handleThemeChange);
    }
  }
}
