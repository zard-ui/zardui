import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardIconComponent } from '@zard/components/icon/icon.component';

interface NavTab {
  label: string;
  path: string;
}

@Component({
  selector: 'z-hero-nav-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, ZardButtonComponent, ZardIconComponent],
  template: `
    <div class="container-wrapper hidden scroll-mt-24 md:flex">
      <div class="container flex items-center justify-between gap-4 py-4">
        <div class="flex flex-1 items-center overflow-hidden">
          <div dir="ltr" class="relative max-w-[96%] md:max-w-150 lg:max-w-none">
            <div class="scrollbar-hide size-full overflow-x-auto">
              <div class="inline-flex min-w-full">
                <div class="flex items-center">
                  @for (tab of tabs(); track tab.path) {
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
          <label class="sr-only" for="theme-selector">Theme</label>
          <button z-button zType="secondary" zSize="sm" id="theme-selector" class="gap-2">
            <span class="font-medium">Theme:</span>
            <span>Neutral</span>
            <z-icon zType="chevron-down" class="opacity-50" />
          </button>
          <button z-button zType="secondary" zSize="sm" class="hidden size-8! sm:flex" aria-label="Copy Code">
            <z-icon zType="copy" />
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
  readonly tabs = signal<NavTab[]>([
    { label: 'Examples', path: '/' },
    { label: 'Dashboard', path: '/examples/dashboard' },
    { label: 'Tasks', path: '/examples/tasks' },
    { label: 'Playground', path: '/examples/playground' },
    { label: 'Authentication', path: '/examples/authentication' },
  ]);
}
