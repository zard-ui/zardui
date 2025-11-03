import { isPlatformBrowser } from '@angular/common';
import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';

export type ColorFormat = 'class' | 'hex' | 'rgb' | 'hsl' | 'oklch' | 'var';

@Injectable({
  providedIn: 'root',
})
export class ColorsService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly storageKey = 'zardui-color-format';

  readonly format = signal<ColorFormat>(this.getInitialFormat());
  readonly lastCopied = signal<string>('');
  readonly isLoading = signal<boolean>(true);

  constructor() {
    if (this.isBrowser) {
      this.isLoading.set(false);

      effect(() => {
        const currentFormat = this.format();
        try {
          localStorage.setItem(this.storageKey, currentFormat);
        } catch (error) {
          console.error('Failed to save color format to localStorage:', error);
        }
      });
    }
  }

  private getInitialFormat(): ColorFormat {
    if (!this.isBrowser) {
      return 'hsl';
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored && this.isValidFormat(stored)) {
        return stored as ColorFormat;
      }
    } catch (error) {
      console.error('Failed to load color format from localStorage:', error);
    }

    return 'hsl';
  }

  private isValidFormat(value: string): boolean {
    return ['class', 'hex', 'rgb', 'hsl', 'oklch', 'var'].includes(value);
  }

  setFormat(format: ColorFormat): void {
    this.format.set(format);
  }

  setLastCopied(value: string): void {
    this.lastCopied.set(value);
  }
}
