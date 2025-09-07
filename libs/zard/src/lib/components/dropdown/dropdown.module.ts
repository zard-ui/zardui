import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';

import { ZardDropdownMenuContentComponent } from './dropdown-menu-content.component';
import { ZardDropdownMenuShortcutComponent } from './dropdown-shortcut.component';
import { ZardDropdownMenuLabelComponent } from './dropdown-label.component';
import { ZardDropdownMenuItemComponent } from './dropdown-item.component';
import { ZardDropdownDirective } from './dropdown-trigger.directive';
import { ZardDropdownMenuComponent } from './dropdown.component';

const DROPDOWN_COMPONENTS = [
  ZardDropdownMenuComponent,
  ZardDropdownMenuItemComponent,
  ZardDropdownMenuLabelComponent,
  ZardDropdownMenuShortcutComponent,
  ZardDropdownMenuContentComponent,
  ZardDropdownDirective,
];

@NgModule({
  imports: [OverlayModule, ...DROPDOWN_COMPONENTS],
  exports: [...DROPDOWN_COMPONENTS],
})
export class ZardDropdownModule {}
