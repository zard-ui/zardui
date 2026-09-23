import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHouse, lucideInbox, lucideSearch, lucideSparkles } from '@ng-icons/lucide';

import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

export interface Sidebar15NavItem {
  readonly title: string;
  readonly url: string;
  readonly icon: string;
  readonly isActive?: boolean;
  readonly badge?: string;
}

@Component({
  selector: 'lib-sidebar-15-nav-main',
  standalone: true,
  imports: [...ZardSidebarImports, NgIcon],
  viewProviders: [provideIcons({ lucideHouse, lucideInbox, lucideSearch, lucideSparkles })],
  templateUrl: './sidebar-15-nav-main.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Sidebar15NavMainComponent {
  readonly items = input<readonly Sidebar15NavItem[]>([]);
}
