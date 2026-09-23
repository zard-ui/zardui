import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHouse, lucideInbox, lucideSearch, lucideSparkles } from '@ng-icons/lucide';

import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

export interface Sidebar10NavItem {
  readonly title: string;
  readonly url: string;
  readonly icon: string;
  readonly isActive?: boolean;
  readonly badge?: string;
}

@Component({
  selector: 'lib-sidebar-10-nav-main',
  standalone: true,
  imports: [...ZardSidebarImports, NgIcon],
  viewProviders: [provideIcons({ lucideHouse, lucideInbox, lucideSearch, lucideSparkles })],
  templateUrl: './sidebar-10-nav-main.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Sidebar10NavMainComponent {
  readonly items = input<readonly Sidebar10NavItem[]>([]);
}
