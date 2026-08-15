import { ZardContextMenuDirective } from '@/shared/components/navigation-menu/context-menu.directive';
import { ZardNavigationMenuContentDirective } from '@/shared/components/navigation-menu/navigation-menu-content.directive';
import { ZardNavigationMenuIndicatorComponent } from '@/shared/components/navigation-menu/navigation-menu-indicator.component';
import { ZardNavigationMenuItemDirective } from '@/shared/components/navigation-menu/navigation-menu-item.directive';
import { ZardNavigationMenuLabelComponent } from '@/shared/components/navigation-menu/navigation-menu-label.component';
import { ZardNavigationMenuLinkDirective } from '@/shared/components/navigation-menu/navigation-menu-link.directive';
import { ZardNavigationMenuListDirective } from '@/shared/components/navigation-menu/navigation-menu-list.directive';
import { ZardNavigationMenuShortcutComponent } from '@/shared/components/navigation-menu/navigation-menu-shortcut.component';
import { ZardNavigationMenuTriggerDirective } from '@/shared/components/navigation-menu/navigation-menu-trigger.directive';
import { ZardNavigationMenuViewportComponent } from '@/shared/components/navigation-menu/navigation-menu-viewport.component';
import { ZardNavigationMenuComponent } from '@/shared/components/navigation-menu/navigation-menu.component';

export const ZardNavigationMenuImports = [
  ZardNavigationMenuComponent,
  ZardNavigationMenuListDirective,
  ZardNavigationMenuItemDirective,
  ZardNavigationMenuTriggerDirective,
  ZardNavigationMenuContentDirective,
  ZardNavigationMenuLinkDirective,
  ZardNavigationMenuIndicatorComponent,
  ZardNavigationMenuViewportComponent,
  ZardNavigationMenuLabelComponent,
  ZardNavigationMenuShortcutComponent,
  ZardContextMenuDirective,
] as const;
