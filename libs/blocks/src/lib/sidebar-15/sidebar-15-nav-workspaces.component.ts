import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideMoreHorizontal, lucidePlus } from '@ng-icons/lucide';

import { ZardCollapsibleImports } from '@zard/components/collapsible/collapsible.imports';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

export interface Sidebar15Page {
  readonly name: string;
  readonly emoji: string;
}

export interface Sidebar15Workspace {
  readonly name: string;
  readonly emoji: string;
  readonly pages: readonly Sidebar15Page[];
}

@Component({
  selector: 'lib-sidebar-15-nav-workspaces',
  standalone: true,
  imports: [...ZardSidebarImports, ...ZardCollapsibleImports, NgIcon],
  viewProviders: [provideIcons({ lucideChevronRight, lucideMoreHorizontal, lucidePlus })],
  templateUrl: './sidebar-15-nav-workspaces.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Sidebar15NavWorkspacesComponent {
  readonly workspaces = input<readonly Sidebar15Workspace[]>([]);
}
