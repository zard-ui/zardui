import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideLink, lucideMoreHorizontal, lucideStarOff, lucideTrash2 } from '@ng-icons/lucide';

import { ZardDropdownImports } from '@zard/components/dropdown/dropdown.imports';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

export interface Sidebar15Favorite {
  readonly name: string;
  readonly url: string;
  readonly emoji: string;
}

@Component({
  selector: 'lib-sidebar-15-nav-favorites',
  standalone: true,
  imports: [...ZardSidebarImports, ...ZardDropdownImports, NgIcon],
  viewProviders: [provideIcons({ lucideArrowUpRight, lucideLink, lucideMoreHorizontal, lucideStarOff, lucideTrash2 })],
  templateUrl: './sidebar-15-nav-favorites.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Sidebar15NavFavoritesComponent {
  readonly favorites = input<readonly Sidebar15Favorite[]>([]);
}
