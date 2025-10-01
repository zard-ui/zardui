import { isPlatformBrowser } from '@angular/common';
import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { RouterModule } from '@angular/router';
import { Component, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { SIDEBAR_PATHS } from '@zard/shared/constants/routes.constant';
import { environment } from '@zard/env/environment';

@Component({
  selector: 'z-mobile-nav',
  templateUrl: './mobile-nav.component.html',
  standalone: true,
  imports: [RouterModule, ZardButtonComponent, ZardBadgeComponent],
})
export class MobileMenuComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly sidebarPaths = SIDEBAR_PATHS;
  readonly appVersion = environment.appVersion;
  sidebarState = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.toggleOverflow();
    });
  }

  toggleOverflow(): void {
    if (!this.isBrowser) return;

    const html = document.documentElement;
    if (this.sidebarState()) {
      html.classList.add('overflow-hidden');
    } else {
      html.classList.remove('overflow-hidden');
    }
  }

  isAvailable(available: boolean): void {
    if (available) {
      this.sidebarState.set(false);
    }
  }
}
