import { ChangeDetectionStrategy, Component, input } from '@angular/core';

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

import { ZardDropdownImports } from '@zard/components/dropdown/dropdown.imports';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

export interface Sidebar07Project {
  readonly name: string;
  readonly url: string;
  readonly icon: string;
}

@Component({
  selector: 'lib-sidebar-07-nav-projects',
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
  templateUrl: './sidebar-07-nav-projects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Sidebar07NavProjectsComponent {
  readonly projects = input<readonly Sidebar07Project[]>([]);
}
