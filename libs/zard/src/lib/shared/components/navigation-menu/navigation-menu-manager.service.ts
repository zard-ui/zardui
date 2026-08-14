import { Injectable } from '@angular/core';

import type { ZardNavigationMenuTriggerDirective } from './navigation-menu-trigger.directive';

/**
 * Global guard for hover triggers running in overlay mode — opening one closes the previous.
 * Triggers sharing a viewport are coordinated by `ZardNavigationMenuService` instead, which is
 * scoped to each root.
 */
@Injectable({
  providedIn: 'root',
})
export class ZardNavigationMenuManagerService {
  private activeHoverMenu: ZardNavigationMenuTriggerDirective | null = null;

  registerHoverMenu(menu: ZardNavigationMenuTriggerDirective): void {
    if (this.activeHoverMenu && this.activeHoverMenu !== menu) {
      this.activeHoverMenu.close();
    }
    this.activeHoverMenu = menu;
  }

  unregisterHoverMenu(menu: ZardNavigationMenuTriggerDirective): void {
    if (this.activeHoverMenu === menu) {
      this.activeHoverMenu = null;
    }
  }

  closeActiveMenu(): void {
    if (this.activeHoverMenu) {
      this.activeHoverMenu.close();
      this.activeHoverMenu = null;
    }
  }
}
