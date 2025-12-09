import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Injectable, type OnDestroy, PLATFORM_ID, computed, inject, signal } from '@angular/core';

export enum EAppearanceModes {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}
export type AppearanceOptions = EAppearanceModes.LIGHT | EAppearanceModes.DARK | EAppearanceModes.SYSTEM;

@Injectable({
  providedIn: 'root',
})
export class ZardAppearance implements OnDestroy {
  private readonly document = inject(DOCUMENT);

  private static readonly STORAGE_KEY = 'theme';
  private handleAppearanceChange = (event: MediaQueryListEvent) => this.updateAppearanceMode(event.matches);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly appearanceSignal = signal<AppearanceOptions>(EAppearanceModes.SYSTEM);
  private darkModeQuery?: MediaQueryList;

  readonly theme = computed(() => this.appearanceSignal());

  readonly themeMode = computed(() => {
    if (this.appearanceSignal() === EAppearanceModes.SYSTEM) {
      return this.isDarkMode() ? EAppearanceModes.DARK : EAppearanceModes.LIGHT;
    }
    return this.appearanceSignal();
  });

  ngOnDestroy(): void {
    this.handleSystemChanges(false);
  }

  init(): void {
    if (!this.isBrowser) {
      return;
    }

    this.applyAppearance(this.getStoredAppearance() ?? EAppearanceModes.SYSTEM);
  }

  toggleAppearance(): void {
    const currentAppearance = this.getCurrentAppearance();
    if (!this.isBrowser) {
      return;
    }

    if (currentAppearance === EAppearanceModes.SYSTEM) {
      this.applyAppearance(EAppearanceModes.LIGHT);
    } else if (currentAppearance === EAppearanceModes.LIGHT) {
      this.applyAppearance(EAppearanceModes.DARK);
    } else {
      this.applyAppearance(EAppearanceModes.SYSTEM);
    }
  }

  activateAppearance(theme: AppearanceOptions): void {
    if (!this.isBrowser) {
      return;
    }

    this.applyAppearance(theme);
  }

  getCurrentAppearance(): AppearanceOptions {
    return this.appearanceSignal();
  }

  private applyAppearance(theme: AppearanceOptions): void {
    if (!this.isBrowser) {
      return;
    }

    localStorage.setItem(ZardAppearance.STORAGE_KEY, theme);
    this.appearanceSignal.set(theme);
    // whenever we apply theme call listener removal
    this.handleSystemChanges(false);

    this.darkModeQuery ??= this.getDarkModeQuery();
    this.updateAppearanceMode(this.isDarkMode());
    if (theme === EAppearanceModes.SYSTEM) {
      this.handleSystemChanges(true);
    }
  }

  private getStoredAppearance(): AppearanceOptions | undefined {
    if (!this.isBrowser) {
      return undefined;
    }

    const value = localStorage.getItem(ZardAppearance.STORAGE_KEY);
    if (value === EAppearanceModes.LIGHT || value === EAppearanceModes.DARK || value === EAppearanceModes.SYSTEM) {
      return value;
    }
    return undefined;
  }

  private getAppearanceMode(isDarkMode: boolean): EAppearanceModes.LIGHT | EAppearanceModes.DARK {
    return isDarkMode ? EAppearanceModes.DARK : EAppearanceModes.LIGHT;
  }

  private updateAppearanceMode(isDarkMode: boolean): void {
    const themeMode = this.getAppearanceMode(isDarkMode);
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
    const stored = localStorage.getItem(ZardAppearance.STORAGE_KEY);
    return stored === EAppearanceModes.DARK || (stored === EAppearanceModes.SYSTEM && isSystemDarkMode);
  }

  private handleSystemChanges(addListener: boolean): void {
    if (addListener) {
      this.darkModeQuery?.addEventListener('change', this.handleAppearanceChange);
    } else {
      this.darkModeQuery?.removeEventListener('change', this.handleAppearanceChange);
    }
  }
}
