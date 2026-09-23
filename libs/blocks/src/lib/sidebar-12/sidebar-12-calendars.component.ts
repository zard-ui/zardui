import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronRight } from '@ng-icons/lucide';

import { ZardCollapsibleImports } from '@zard/components/collapsible/collapsible.imports';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

export interface Sidebar12Calendar {
  readonly name: string;
  readonly items: readonly string[];
}

@Component({
  selector: 'lib-sidebar-12-calendars',
  standalone: true,
  imports: [...ZardSidebarImports, ...ZardCollapsibleImports, NgIcon],
  viewProviders: [provideIcons({ lucideCheck, lucideChevronRight })],
  templateUrl: './sidebar-12-calendars.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Sidebar12CalendarsComponent {
  readonly calendars = input<readonly Sidebar12Calendar[]>([]);
}
