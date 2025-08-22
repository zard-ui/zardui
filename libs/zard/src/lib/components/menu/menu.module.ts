import { NgModule } from '@angular/core';

import { ZardDividerComponent } from '../divider/divider.component';
import { ZardMenuGroupComponent } from './menu-group.component';
import { ZardMenuItemDirective } from './menu-item.directive';
import { ZardMenuComponent } from './menu.component';
import { ZardSubmenuComponent } from './submenu.component';

const MENU_COMPONENTS = [ZardMenuComponent, ZardMenuItemDirective, ZardSubmenuComponent, ZardMenuGroupComponent, ZardDividerComponent];

@NgModule({
  imports: [...MENU_COMPONENTS],
  exports: MENU_COMPONENTS,
})
export class ZardMenuModule {}
