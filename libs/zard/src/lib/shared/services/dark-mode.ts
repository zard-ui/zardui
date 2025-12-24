import { MediaMatcher } from '@angular/cdk/layout';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';

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
  private readonly query = inject(MediaMatcher).matchMedia('(prefers-color-scheme: dark)');

  private static readonly STORAGE_KEY = 'theme';
  private handleThemeChange = (event: MediaQueryListEvent) => this.updateThemeMode(event.matches);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly themeSignal = signal<DarkModeOptions>(EDarkModes.SYSTEM);

  readonly themeMode = computed(() => {
    const currentTheme = this.themeSignal();
    if (currentTheme === EDarkModes.SYSTEM) {
      return this.isDarkModeActive(currentTheme) ? EDarkModes.DARK : EDarkModes.LIGHT;
    }
    return currentTheme;
  });

  constructor() {
    if (this.isBrowser) {
      this.destroyRef.onDestroy(() => this.handleSystemChanges(false));
    }
  }

  init() {
    if (this.isBrowser) {
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

  private initializeTheme(): void {
    const storedTheme = this.getStoredTheme();
    if (storedTheme) {
      this.themeSignal.set(storedTheme);
    }

    if (!storedTheme || storedTheme === EDarkModes.SYSTEM) {
      this.updateThemeMode(this.isDarkModeActive(EDarkModes.SYSTEM));
      this.handleSystemChanges();
    } else {
      this.updateThemeMode(storedTheme === EDarkModes.DARK);
    }
  }

  private applyTheme(theme: DarkModeOptions): void {
    if (!this.isBrowser) {
      return;
    }

    localStorage.setItem(ZardDarkMode.STORAGE_KEY, theme);
    this.themeSignal.set(theme);

    this.updateThemeMode(this.isDarkModeActive(theme));

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

    const value = localStorage.getItem(ZardDarkMode.STORAGE_KEY);
    if (value === EDarkModes.LIGHT || value === EDarkModes.DARK || value === EDarkModes.SYSTEM) {
      return value;
    }
    return undefined;
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

  private isDarkModeActive(currentTheme: DarkModeOptions): boolean {
    if (!this.isBrowser) {
      return false;
    }

    return currentTheme === EDarkModes.DARK || (currentTheme === EDarkModes.SYSTEM && this.query.matches);
  }

  private handleSystemChanges(addListener = true): void {
    if (addListener) {
      this.query.addEventListener('change', this.handleThemeChange);
    } else {
      this.query.removeEventListener('change', this.handleThemeChange);
    }
  }
}
