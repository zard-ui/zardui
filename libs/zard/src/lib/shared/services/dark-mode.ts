import { MediaMatcher } from '@angular/cdk/layout';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';

export enum EDarkModes {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}
export type DarkModeOptions = EDarkModes.LIGHT | EDarkModes.DARK | EDarkModes.SYSTEM;

@Injectable({
  providedIn: 'root',
})
export class ZardDarkMode {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  private static readonly STORAGE_KEY = 'theme';
  private handleThemeChange = (event: MediaQueryListEvent) => this.updateThemeMode(event.matches, EDarkModes.SYSTEM);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly themeSignal = signal<DarkModeOptions>(EDarkModes.SYSTEM);
  private _query?: MediaQueryList;
  private initialized = false;

  constructor() {
    if (this.isBrowser) {
      this._query = inject(MediaMatcher).matchMedia('(prefers-color-scheme: dark)');
      this.destroyRef.onDestroy(() => this.handleSystemChanges(false));

      effect(() => {
        const theme = this.themeSignal();
        const isDarkMode = this.isDarkModeActive(theme);
        this.updateThemeMode(isDarkMode, theme);
      });
    }
  }

  readonly themeMode = computed(() => {
    const currentTheme = this.themeSignal();
    if (currentTheme === EDarkModes.SYSTEM) {
      return this.isDarkModeActive(currentTheme) ? EDarkModes.DARK : EDarkModes.LIGHT;
    }
    return currentTheme;
  });

  init() {
    if (!this.initialized && this.isBrowser) {
      this.initializeTheme();
    }
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

  /**
   * Returns a ReadonlySignal<"light" | "dark" | "system"> that cannot be mutated externally.
   * Call currentTheme() to access the value or use it directly in templates where signals are supported.
   * @example service.currentTheme() // returns "light", "dark", or "system"
   */
  get currentTheme() {
    return this.themeSignal.asReadonly();
  }

  private get query(): MediaQueryList {
    if (!this.isBrowser || !this._query) {
      throw new Error('Cannot access media query on server');
    }
    return this._query;
  }

  private initializeTheme(): void {
    const storedTheme = this.getStoredTheme();
    if (storedTheme) {
      this.themeSignal.set(storedTheme);
    }

    if (!storedTheme || storedTheme === EDarkModes.SYSTEM) {
      this.handleSystemChanges();
    }
    this.initialized = true;
  }

  private applyTheme(theme: DarkModeOptions): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      localStorage.setItem(ZardDarkMode.STORAGE_KEY, theme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
    this.themeSignal.set(theme);

    if (theme === EDarkModes.SYSTEM) {
      this.handleSystemChanges();
    } else {
      this.handleSystemChanges(false);
    }
  }

  private getStoredTheme(): DarkModeOptions | undefined {
    if (!this.isBrowser) {
      return undefined;
    }

    try {
      const value = localStorage.getItem(ZardDarkMode.STORAGE_KEY);
      if (value === EDarkModes.LIGHT || value === EDarkModes.DARK || value === EDarkModes.SYSTEM) {
        return value;
      }
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error);
    }
    return undefined;
  }

  private updateThemeMode(isDarkMode: boolean, themeMode: EDarkModes): void {
    const html = this.document.documentElement;
    html.classList.toggle('dark', isDarkMode);
    html.setAttribute('data-theme', themeMode);
  }

  private isDarkModeActive(currentTheme: DarkModeOptions): boolean {
    if (!this.isBrowser) {
      return false;
    }

    return currentTheme === EDarkModes.DARK || (currentTheme === EDarkModes.SYSTEM && this.query.matches);
  }

  private handleSystemChanges(addListener = true): void {
    try {
      if (addListener) {
        this.query.addEventListener('change', this.handleThemeChange);
      } else {
        this.query.removeEventListener('change', this.handleThemeChange);
      }
    } catch (error) {
      console.warn('Failed to manage media query event listener:', error);
    }
  }
}
