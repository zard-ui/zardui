import { NgModule } from '@angular/core';

import { ZardMenuContentDirective } from './menu-content.directive';
import { ZardMenuItemDirective } from './menu-item.directive';
import { ZardMenuDirective } from './menu.directive';

const MENU_COMPONENTS = [ZardMenuContentDirective, ZardMenuItemDirective, ZardMenuDirective];

@NgModule({
  imports: [MENU_COMPONENTS],
  exports: [MENU_COMPONENTS],
})
export class ZardMenuModule {}
