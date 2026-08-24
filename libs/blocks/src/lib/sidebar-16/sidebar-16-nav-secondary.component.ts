import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLifeBuoy, lucideSend } from '@ng-icons/lucide';

import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

export interface Sidebar16SecondaryItem {
  readonly title: string;
  readonly url: string;
  readonly icon: string;
}

@Component({
  selector: 'lib-sidebar-16-nav-secondary',
  standalone: true,
  imports: [...ZardSidebarImports, NgIcon],
  viewProviders: [provideIcons({ lucideLifeBuoy, lucideSend })],
  templateUrl: './sidebar-16-nav-secondary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Sidebar16NavSecondaryComponent {
  readonly items = input<readonly Sidebar16SecondaryItem[]>([]);
  readonly class = input<string>('');
}
