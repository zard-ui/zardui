import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideLink, lucideMoreHorizontal, lucideStarOff, lucideTrash2 } from '@ng-icons/lucide';

import type { ZardDropdownAlign, ZardDropdownSide } from '@zard/components/dropdown/dropdown-positions';
import { ZardDropdownImports } from '@zard/components/dropdown/dropdown.imports';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';
import { ZardSidebarService } from '@zard/components/sidebar/sidebar.service';

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
  private readonly sidebar = inject(ZardSidebarService);
  /** shadcn opens these menus to the side of the sidebar on desktop and below the trigger on mobile. */
  protected readonly menuSide = computed<ZardDropdownSide>(() => (this.sidebar.isMobile() ? 'bottom' : 'right'));
  protected readonly menuAlign = computed<ZardDropdownAlign>(() => (this.sidebar.isMobile() ? 'end' : 'start'));

  readonly favorites = input<readonly Sidebar15Favorite[]>([]);
}
