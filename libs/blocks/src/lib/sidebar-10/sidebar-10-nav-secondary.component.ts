import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBlocks,
  lucideCalendar,
  lucideMessageCircleQuestion,
  lucideSettings2,
  lucideTrash2,
} from '@ng-icons/lucide';

import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

export interface Sidebar10SecondaryItem {
  readonly title: string;
  readonly url: string;
  readonly icon: string;
  readonly badge?: string;
}

@Component({
  selector: 'lib-sidebar-10-nav-secondary',
  standalone: true,
  imports: [...ZardSidebarImports, NgIcon],
  viewProviders: [
    provideIcons({ lucideBlocks, lucideCalendar, lucideMessageCircleQuestion, lucideSettings2, lucideTrash2 }),
  ],
  templateUrl: './sidebar-10-nav-secondary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Sidebar10NavSecondaryComponent {
  readonly items = input<readonly Sidebar10SecondaryItem[]>([]);
  readonly class = input<string>('');
}
