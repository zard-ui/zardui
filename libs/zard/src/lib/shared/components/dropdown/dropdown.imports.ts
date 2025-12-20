import { ZardDropdownMenuItemComponent } from '@/shared/components/dropdown/dropdown-item.component';
import { ZardDropdownMenuLabelComponent } from '@/shared/components/dropdown/dropdown-label.component';
import { ZardDropdownMenuContentComponent } from '@/shared/components/dropdown/dropdown-menu-content.component';
import { ZardDropdownDirective } from '@/shared/components/dropdown/dropdown-trigger.directive';
import { ZardDropdownMenuComponent } from '@/shared/components/dropdown/dropdown.component';

export const ZardDropdownImports = [
  ZardDropdownMenuComponent,
  ZardDropdownMenuItemComponent,
  ZardDropdownMenuLabelComponent,
  ZardDropdownMenuContentComponent,
  ZardDropdownDirective,
] as const;
