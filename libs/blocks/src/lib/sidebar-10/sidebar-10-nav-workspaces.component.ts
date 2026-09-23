import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideMoreHorizontal, lucidePlus } from '@ng-icons/lucide';

import { ZardCollapsibleImports } from '@zard/components/collapsible/collapsible.imports';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

export interface Sidebar10Page {
  readonly name: string;
  readonly emoji: string;
}

export interface Sidebar10Workspace {
  readonly name: string;
  readonly emoji: string;
  readonly pages: readonly Sidebar10Page[];
}

@Component({
  selector: 'lib-sidebar-10-nav-workspaces',
  standalone: true,
  imports: [...ZardSidebarImports, ...ZardCollapsibleImports, NgIcon],
  viewProviders: [provideIcons({ lucideChevronRight, lucideMoreHorizontal, lucidePlus })],
  templateUrl: './sidebar-10-nav-workspaces.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Sidebar10NavWorkspacesComponent {
  readonly workspaces = input<readonly Sidebar10Workspace[]>([]);
}
