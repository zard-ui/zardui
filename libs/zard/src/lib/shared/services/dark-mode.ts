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

  private static readonly STORAGE_KEY = 'theme';
  private handleThemeChange = (event: MediaQueryListEvent) => this.updateThemeMode(event.matches);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly themeSignal = signal<DarkModeOptions>(EDarkModes.SYSTEM);
  private darkModeQuery?: MediaQueryList;

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

    this.darkModeQuery ??= this.getDarkModeQuery();
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
    const stored = localStorage.getItem(ZardDarkMode.STORAGE_KEY);
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
