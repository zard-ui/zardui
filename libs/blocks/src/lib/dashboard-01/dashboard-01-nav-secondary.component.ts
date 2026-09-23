import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleHelp, lucideSearch, lucideSettings } from '@ng-icons/lucide';

import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

import type { Dashboard01NavItem } from './dashboard-01-nav-main.component';

@Component({
  selector: 'lib-dashboard-01-nav-secondary',
  standalone: true,
  imports: [...ZardSidebarImports, NgIcon],
  viewProviders: [provideIcons({ lucideCircleHelp, lucideSearch, lucideSettings })],
  templateUrl: './dashboard-01-nav-secondary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Dashboard01NavSecondaryComponent {
  readonly items = input<readonly Dashboard01NavItem[]>([]);
  readonly class = input<string>('');
}
