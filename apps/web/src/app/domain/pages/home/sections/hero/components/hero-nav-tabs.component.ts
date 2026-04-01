import { Component, ChangeDetectionStrategy, DestroyRef, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCopy, lucideX } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardSelectImports } from '@zard/components/select';

import { THEME_PRESETS } from '../../../../themes/data/theme-presets';
import { ThemeGeneratorService } from '../../../../themes/services/theme-generator.service';

interface NavTab {
  label: string;
  path: string;
}

@Component({
  selector: 'z-hero-nav-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, ZardButtonComponent, NgIcon, ...ZardSelectImports],
  viewProviders: [provideIcons({ lucideCheck, lucideX, lucideCopy })],
  template: `
    <div class="container-wrapper hidden scroll-mt-24 md:flex">
      <div class="container flex items-center justify-between gap-4 py-4">
        <div class="flex flex-1 items-center overflow-hidden">
          <div dir="ltr" class="relative max-w-[96%] md:max-w-150 lg:max-w-none">
            <div class="scrollbar-hide size-full overflow-x-auto">
              <div class="inline-flex min-w-full">
                <div class="flex items-center">
                  @for (tab of tabs; track tab.path) {
                    <a
                      class="text-muted-foreground hover:text-primary flex h-7 items-center justify-center px-4 text-center text-base font-medium transition-colors"
                      [routerLink]="tab.path"
                      routerLinkActive="text-primary!"
                      [routerLinkActiveOptions]="{ exact: tab.path === '/' }"
                    >
                      {{ tab.label }}
                    </a>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mr-4 hidden items-center gap-2 md:flex">
          <z-select
            zSize="sm"
            id="theme-selector"
            class="w-36"
            [zValue]="themeService.activePreset() ?? 'Neutral'"
            (zSelectionChange)="themeService.applyPreset($event.toString())"
          >
            @for (preset of presets; track preset.name) {
              <z-select-item [zValue]="preset.name">{{ preset.name }}</z-select-item>
            }
          </z-select>
          <button
            type="button"
            z-button
            zType="secondary"
            zSize="icon"
            class="hidden sm:flex"
            [attr.aria-label]="copyError() ? 'Copy failed' : copied() ? 'Copied!' : 'Copy theme CSS'"
            (click)="copyThemeCss()"
          >
            <ng-icon [name]="copyError() ? 'lucideX' : copied() ? 'lucideCheck' : 'lucideCopy'" />
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .scrollbar-hide {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
  `,
})
export class HeroNavTabsComponent {
  protected readonly themeService = inject(ThemeGeneratorService);
  protected readonly copied = signal(false);
  protected readonly copyError = signal(false);
  private readonly destroyRef = inject(DestroyRef);
  private copyTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private destroyed = false;

  readonly presets = THEME_PRESETS;

  readonly tabs: NavTab[] = [
    { label: 'Examples', path: '/' },
    { label: 'Dashboard', path: '/examples/dashboard' },
    { label: 'Tasks', path: '/examples/tasks' },
    { label: 'Playground', path: '/examples/playground' },
    { label: 'Authentication', path: '/examples/authentication' },
  ];

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
      if (this.copyTimeoutId) {
        clearTimeout(this.copyTimeoutId);
      }
    });
  }

  protected copyThemeCss(): void {
    this.themeService
      .copyToClipboard()
      .then(success => this.setFeedbackState(success))
      .catch(() => this.setFeedbackState(false));
  }

  private setFeedbackState(isSuccess: boolean): void {
    if (this.destroyed) return;

    if (this.copyTimeoutId) {
      clearTimeout(this.copyTimeoutId);
    }
    this.copied.set(false);
    this.copyError.set(false);
    if (isSuccess) {
      this.copied.set(true);
      this.copyTimeoutId = setTimeout(() => this.copied.set(false), 2000);
    } else {
      this.copyError.set(true);
      this.copyTimeoutId = setTimeout(() => this.copyError.set(false), 2000);
    }
  }
}
