export { ZardContextMenuDirective } from './context-menu.directive';
export { ZardDropdownMenuItemComponent } from '@/shared/components/dropdown/dropdown-item.component';
export { ZardDropdownMenuContentComponent } from '@/shared/components/dropdown/dropdown-menu-content.component';
export {
  ZardDropdownMenuCheckboxItemComponent,
  ZardDropdownMenuGroupComponent,
  ZardDropdownMenuLabelComponent,
  ZardDropdownMenuRadioGroupComponent,
  ZardDropdownMenuRadioItemComponent,
  ZardDropdownMenuSeparatorComponent,
  ZardDropdownMenuShortcutComponent,
} from '@/shared/components/dropdown/dropdown-primitives.component';
export {
  ZardDropdownMenuSubContentComponent,
  ZardDropdownMenuSubTriggerComponent,
} from '@/shared/components/dropdown/dropdown-submenu.component';

import { ZardDropdownMenuItemComponent } from '@/shared/components/dropdown/dropdown-item.component';
import { ZardDropdownMenuContentComponent } from '@/shared/components/dropdown/dropdown-menu-content.component';
import {
  ZardDropdownMenuCheckboxItemComponent,
  ZardDropdownMenuGroupComponent,
  ZardDropdownMenuLabelComponent,
  ZardDropdownMenuRadioGroupComponent,
  ZardDropdownMenuRadioItemComponent,
  ZardDropdownMenuSeparatorComponent,
  ZardDropdownMenuShortcutComponent,
} from '@/shared/components/dropdown/dropdown-primitives.component';
import {
  ZardDropdownMenuSubContentComponent,
  ZardDropdownMenuSubTriggerComponent,
} from '@/shared/components/dropdown/dropdown-submenu.component';

import { ZardContextMenuDirective } from './context-menu.directive';

/** The trigger plus every menu primitive the content is built from. */
export const ZardContextMenuImports = [
  ZardContextMenuDirective,
  ZardDropdownMenuContentComponent,
  ZardDropdownMenuItemComponent,
  ZardDropdownMenuGroupComponent,
  ZardDropdownMenuLabelComponent,
  ZardDropdownMenuSeparatorComponent,
  ZardDropdownMenuShortcutComponent,
  ZardDropdownMenuCheckboxItemComponent,
  ZardDropdownMenuRadioGroupComponent,
  ZardDropdownMenuRadioItemComponent,
  ZardDropdownMenuSubTriggerComponent,
  ZardDropdownMenuSubContentComponent,
] as const;
