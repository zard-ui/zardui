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

export interface Sidebar08Project {
  readonly name: string;
  readonly url: string;
  readonly icon: string;
}

@Component({
  selector: 'lib-sidebar-08-nav-projects',
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
  templateUrl: './sidebar-08-nav-projects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Sidebar08NavProjectsComponent {
  readonly projects = input<readonly Sidebar08Project[]>([]);
}
