import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ZardMenuDividerDirective } from './menu-divider.directive';
import { ZardMenuGroupComponent } from './menu-group.component';
import { ZardMenuItemDirective } from './menu-item.directive';
import { ZardMenuComponent } from './menu.component';
import { ZardSubmenuComponent } from './submenu.component';

const MENU_COMPONENTS = [ZardMenuComponent, ZardMenuItemDirective, ZardSubmenuComponent, ZardMenuGroupComponent, ZardMenuDividerDirective];

@NgModule({
  imports: [CommonModule, ...MENU_COMPONENTS],
  exports: MENU_COMPONENTS,
})
export class ZardMenuModule {}
