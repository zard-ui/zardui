import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { environment } from '@doc/env/environment';
import { SIDEBAR_PATHS, HEADER_PATHS } from '@doc/shared/constants/routes.constant';

import { ZardBadgeComponent } from '../../../../../../../libs/zard/badge/badge.component';
import { ZardButtonComponent } from '../../../../../../../libs/zard/button/button.component';

@Component({
  selector: 'z-mobile-nav',
  templateUrl: './mobile-nav.component.html',
  standalone: true,
  imports: [RouterModule, ZardButtonComponent, ZardBadgeComponent],
})
export class MobileMenuComponent {
  readonly mainMenu = [{ name: 'Home', path: '/', available: true }, ...HEADER_PATHS];
  readonly sidebarPaths = SIDEBAR_PATHS;
  readonly appVersion = environment.appVersion;
  sidebarState = signal<boolean>(false);

  toggleMenu(): void {
    this.sidebarState.set(!this.sidebarState());
  }

  closeMenu(): void {
    this.sidebarState.set(false);
  }

  isAvailable(available: boolean): void {
    if (available) {
      this.closeMenu();
    }
  }
}
