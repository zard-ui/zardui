import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, Injectable, OnDestroy, PLATFORM_ID, computed, inject, signal } from '@angular/core';

export enum EThemeModes {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}
export type ThemeOptions = EThemeModes.LIGHT | EThemeModes.DARK | EThemeModes.SYSTEM;

@Injectable({
  providedIn: 'root',
})
export class DarkModeService implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private handleThemeChange = (event: MediaQueryListEvent) => this.updateMode(event.matches);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly themeSignal = signal<ThemeOptions>(EThemeModes.SYSTEM);
  private darkModeQuery?: MediaQueryList;

  readonly theme = computed(() => this.themeSignal());

  ngOnDestroy(): void {
    this.handleSystemChanges(false);
  }

  initTheme(): void {
    if (!this.isBrowser) {
      return;
    }

    this.applyTheme(this.getStoredTheme() ?? EThemeModes.SYSTEM);
  }

  toggleTheme(): void {
    const currentTheme = this.getCurrentTheme();
    if (!this.isBrowser || currentTheme === EThemeModes.SYSTEM) {
      return;
    }

    this.applyTheme(currentTheme === EThemeModes.DARK ? EThemeModes.LIGHT : EThemeModes.DARK);
  }

  activateTheme(theme: ThemeOptions): void {
    if (!this.isBrowser) {
      return;
    }

    this.applyTheme(theme);
  }

  getCurrentTheme(): ThemeOptions {
    return this.themeSignal();
  }

  private applyTheme(theme: ThemeOptions): void {
    if (!this.isBrowser) {
      return;
    }

    localStorage['theme'] = theme;
    this.themeSignal.set(theme);
    // whenever we apply theme call listener removal
    this.handleSystemChanges(false);

    this.darkModeQuery ??= this.getDarkModeQuery();
    this.updateMode(this.isDarkMode());
    if (theme === EThemeModes.SYSTEM) {
      this.handleSystemChanges(true);
    }
  }

  private getStoredTheme(): ThemeOptions | undefined {
    const value = localStorage['theme'];
    if (value === EThemeModes.LIGHT || value === EThemeModes.DARK || value === EThemeModes.SYSTEM) {
      return value;
    }
    return undefined;
  }

  private getThemeMode(isDarkMode: boolean): EThemeModes.LIGHT | EThemeModes.DARK {
    return isDarkMode ? EThemeModes.DARK : EThemeModes.LIGHT;
  }

  private updateMode(isDarkMode: boolean): void {
    const themeMode = this.getThemeMode(isDarkMode);
    const html = document.documentElement;
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
    const isSystemDarkMode = this.darkModeQuery?.matches ?? false;
    return (
      localStorage['theme'] === EThemeModes.DARK || (localStorage['theme'] === EThemeModes.SYSTEM && isSystemDarkMode)
    );
  }

  private handleSystemChanges(addListener: boolean): void {
    if (addListener) {
      this.darkModeQuery?.addEventListener('change', this.handleThemeChange);
    } else {
      this.darkModeQuery?.removeEventListener('change', this.handleThemeChange);
    }
  }
}
