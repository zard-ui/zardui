import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly storageKey = 'layout-mode';
  private readonly layoutModeSignal = signal<'fixed' | 'full'>('fixed');

  initLayout(): void {
    if (!this.isBrowser) {
      return;
    }

    const savedLayout = localStorage.getItem(this.storageKey) as 'fixed' | 'full' | null;
    const layoutMode = savedLayout || 'fixed';

    this.applyLayout(layoutMode);
  }

  toggleLayout(): void {
    if (!this.isBrowser) {
      return;
    }

    const currentMode = this.getLayoutMode();
    const newMode = currentMode === 'fixed' ? 'full' : 'fixed';
    this.applyLayout(newMode);
  }

  getLayoutMode(): 'fixed' | 'full' {
    return this.layoutModeSignal();
  }

  isLayoutFixed(): boolean {
    return this.layoutModeSignal() === 'fixed';
  }

  get layoutMode() {
    return this.layoutModeSignal.asReadonly();
  }

  private applyLayout(mode: 'fixed' | 'full'): void {
    if (!this.isBrowser) {
      return;
    }

    const html = document.documentElement;

    html.classList.remove('layout-fixed', 'layout-full');

    html.classList.add(`layout-${mode}`);

    localStorage.setItem(this.storageKey, mode);
    this.layoutModeSignal.set(mode);
  }
}
