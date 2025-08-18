import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { RouterModule } from '@angular/router';
import { Component, effect, signal } from '@angular/core';
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
  readonly sidebarPaths = SIDEBAR_PATHS;
  readonly appVersion = environment.appVersion;
  sidebarState = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.toggleOverflow();
    });
  }

  toggleOverflow(): void {
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
