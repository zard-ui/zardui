import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowDown,
  lucideArrowUp,
  lucideBell,
  lucideCopy,
  lucideCornerUpLeft,
  lucideCornerUpRight,
  lucideFileText,
  lucideGalleryVerticalEnd,
  lucideLineChart,
  lucideLink,
  lucideMoreHorizontal,
  lucideSettings2,
  lucideStar,
  lucideTrash,
  lucideTrash2,
} from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardPopoverImports } from '@zard/components/popover/popover.imports';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

interface ActionItem {
  readonly label: string;
  readonly icon: string;
}

@Component({
  selector: 'lib-sidebar-10-nav-actions',
  standalone: true,
  imports: [...ZardSidebarImports, ...ZardPopoverImports, ZardButtonComponent, NgIcon],
  viewProviders: [
    provideIcons({
      lucideArrowDown,
      lucideArrowUp,
      lucideBell,
      lucideCopy,
      lucideCornerUpLeft,
      lucideCornerUpRight,
      lucideFileText,
      lucideGalleryVerticalEnd,
      lucideLineChart,
      lucideLink,
      lucideMoreHorizontal,
      lucideSettings2,
      lucideStar,
      lucideTrash,
      lucideTrash2,
    }),
  ],
  templateUrl: './sidebar-10-nav-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar10NavActionsComponent {
  // This is sample data.
  protected readonly groups: readonly (readonly ActionItem[])[] = [
    [
      { label: 'Customize Page', icon: 'lucideSettings2' },
      { label: 'Turn into wiki', icon: 'lucideFileText' },
    ],
    [
      { label: 'Copy Link', icon: 'lucideLink' },
      { label: 'Duplicate', icon: 'lucideCopy' },
      { label: 'Move to', icon: 'lucideCornerUpRight' },
      { label: 'Move to Trash', icon: 'lucideTrash2' },
    ],
    [
      { label: 'Undo', icon: 'lucideCornerUpLeft' },
      { label: 'View analytics', icon: 'lucideLineChart' },
      { label: 'Version History', icon: 'lucideGalleryVerticalEnd' },
      { label: 'Show delete pages', icon: 'lucideTrash' },
      { label: 'Notifications', icon: 'lucideBell' },
    ],
    [
      { label: 'Import', icon: 'lucideArrowUp' },
      { label: 'Export', icon: 'lucideArrowDown' },
    ],
  ];
}
