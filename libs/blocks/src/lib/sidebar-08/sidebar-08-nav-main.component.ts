import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBookOpen, lucideBot, lucideChevronRight, lucideSettings2, lucideSquareTerminal } from '@ng-icons/lucide';

import { ZardCollapsibleImports } from '@zard/components/collapsible/collapsible.imports';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

export interface Sidebar08NavSubItem {
  readonly title: string;
  readonly url: string;
}

export interface Sidebar08NavItem {
  readonly title: string;
  readonly url: string;
  readonly icon: string;
  readonly isActive?: boolean;
  readonly items: readonly Sidebar08NavSubItem[];
}

@Component({
  selector: 'lib-sidebar-08-nav-main',
  standalone: true,
  imports: [...ZardSidebarImports, ...ZardCollapsibleImports, NgIcon],
  viewProviders: [
    provideIcons({ lucideBookOpen, lucideBot, lucideChevronRight, lucideSettings2, lucideSquareTerminal }),
  ],
  templateUrl: './sidebar-08-nav-main.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Sidebar08NavMainComponent {
  readonly items = input<readonly Sidebar08NavItem[]>([]);
}
