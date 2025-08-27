import { Injectable } from '@angular/core';

import { ZardMenuDirective } from './menu.directive';

@Injectable({
  providedIn: 'root',
})
export class ZardMenuManagerService {
  private activeHoverMenu: ZardMenuDirective | null = null;

  registerHoverMenu(menu: ZardMenuDirective): void {
    if (this.activeHoverMenu && this.activeHoverMenu !== menu) {
      this.activeHoverMenu.close();
    }
    this.activeHoverMenu = menu;
  }

  unregisterHoverMenu(menu: ZardMenuDirective): void {
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
