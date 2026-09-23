import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMoreHorizontal } from '@ng-icons/lucide';

import { ZardDropdownImports } from '@zard/components/dropdown/dropdown.imports';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';
import { ZardSidebarService } from '@zard/components/sidebar/sidebar.service';

export interface Sidebar06NavItem {
  readonly title: string;
  readonly url: string;
  readonly isActive?: boolean;
}

export interface Sidebar06NavGroup {
  readonly title: string;
  readonly url: string;
  readonly items: readonly Sidebar06NavItem[];
}

@Component({
  selector: 'lib-sidebar-06-nav-main',
  standalone: true,
  imports: [...ZardSidebarImports, ...ZardDropdownImports, NgIcon],
  viewProviders: [provideIcons({ lucideMoreHorizontal })],
  templateUrl: './sidebar-06-nav-main.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Sidebar06NavMainComponent {
  readonly items = input<readonly Sidebar06NavGroup[]>([]);

  protected readonly sidebar = inject(ZardSidebarService);
}
