import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChartBar,
  lucideCirclePlus,
  lucideFolder,
  lucideLayoutDashboard,
  lucideListTodo,
  lucideMail,
  lucideUsers,
} from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

export interface Dashboard01NavItem {
  readonly title: string;
  readonly url: string;
  readonly icon: string;
}

@Component({
  selector: 'lib-dashboard-01-nav-main',
  standalone: true,
  imports: [...ZardSidebarImports, ZardButtonComponent, NgIcon],
  viewProviders: [
    provideIcons({
      lucideChartBar,
      lucideCirclePlus,
      lucideFolder,
      lucideLayoutDashboard,
      lucideListTodo,
      lucideMail,
      lucideUsers,
    }),
  ],
  templateUrl: './dashboard-01-nav-main.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Dashboard01NavMainComponent {
  readonly items = input<readonly Dashboard01NavItem[]>([]);
}
