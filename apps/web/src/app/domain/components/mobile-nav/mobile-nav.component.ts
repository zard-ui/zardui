import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { RouterModule } from '@angular/router';
import { Component, signal } from '@angular/core';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { SIDEBAR_PATHS, HEADER_PATHS } from '@zard/shared/constants/routes.constant';
import { environment } from '@zard/env/environment';

@Component({
  selector: 'z-mobile-nav',
  templateUrl: './mobile-nav.component.html',
  standalone: true,
  imports: [RouterModule, ZardButtonComponent, ZardBadgeComponent],
})
export class MobileMenuComponent {
  readonly mainMenu = [
    { name: 'Home', path: '/', available: true },
    ...HEADER_PATHS,
  ];
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
