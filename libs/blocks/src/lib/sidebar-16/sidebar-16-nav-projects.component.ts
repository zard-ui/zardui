import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideFolder,
  lucideForward,
  lucideFrame,
  lucideMap,
  lucideMoreHorizontal,
  lucidePieChart,
  lucideTrash2,
} from '@ng-icons/lucide';

import type { ZardDropdownAlign, ZardDropdownSide } from '@zard/components/dropdown/dropdown-positions';
import { ZardDropdownImports } from '@zard/components/dropdown/dropdown.imports';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';
import { ZardSidebarService } from '@zard/components/sidebar/sidebar.service';

export interface Sidebar16Project {
  readonly name: string;
  readonly url: string;
  readonly icon: string;
}

@Component({
  selector: 'lib-sidebar-16-nav-projects',
  standalone: true,
  imports: [...ZardSidebarImports, ...ZardDropdownImports, NgIcon],
  viewProviders: [
    provideIcons({
      lucideFolder,
      lucideForward,
      lucideFrame,
      lucideMap,
      lucideMoreHorizontal,
      lucidePieChart,
      lucideTrash2,
    }),
  ],
  templateUrl: './sidebar-16-nav-projects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Sidebar16NavProjectsComponent {
  private readonly sidebar = inject(ZardSidebarService);
  /** shadcn opens these menus to the side of the sidebar on desktop and below the trigger on mobile. */
  protected readonly menuSide = computed<ZardDropdownSide>(() => (this.sidebar.isMobile() ? 'bottom' : 'right'));
  protected readonly menuAlign = computed<ZardDropdownAlign>(() => (this.sidebar.isMobile() ? 'end' : 'start'));

  readonly projects = input<readonly Sidebar16Project[]>([]);
}
