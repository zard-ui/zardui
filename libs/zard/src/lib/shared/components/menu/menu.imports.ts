import { ZardContextMenuDirective } from '@/shared/components/menu/context-menu.directive';
import { ZardMenuContentDirective } from '@/shared/components/menu/menu-content.directive';
import { ZardMenuItemDirective } from '@/shared/components/menu/menu-item.directive';
import { ZardMenuDirective } from '@/shared/components/menu/menu.directive';

export const ZardMenuImports = [
  ZardContextMenuDirective,
  ZardMenuContentDirective,
  ZardMenuItemDirective,
  ZardMenuDirective,
] as const;
