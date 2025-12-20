import { NgModule } from '@angular/core';

import { ZardContextMenuDirective } from './context-menu.directive';
import { ZardMenuContentDirective } from './menu-content.directive';
import { ZardMenuItemDirective } from './menu-item.directive';
import { ZardMenuDirective } from './menu.directive';

const MENU_COMPONENTS = [ZardContextMenuDirective, ZardMenuContentDirective, ZardMenuItemDirective, ZardMenuDirective];

@NgModule({
  imports: [MENU_COMPONENTS],
  exports: [MENU_COMPONENTS],
})
export class ZardMenuModule {}
