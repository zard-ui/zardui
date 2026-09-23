import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBell, lucideCreditCard, lucideEllipsisVertical, lucideLogOut, lucideUserCircle } from '@ng-icons/lucide';

import { ZardAvatarComponent } from '@zard/components/avatar/avatar.component';
import type { ZardDropdownSide } from '@zard/components/dropdown/dropdown-positions';
import { ZardDropdownImports } from '@zard/components/dropdown/dropdown.imports';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';
import { ZardSidebarService } from '@zard/components/sidebar/sidebar.service';

export interface Dashboard01User {
  readonly name: string;
  readonly email: string;
  readonly avatar: string;
}

@Component({
  selector: 'lib-dashboard-01-nav-user',
  standalone: true,
  imports: [...ZardSidebarImports, ...ZardDropdownImports, ZardAvatarComponent, NgIcon],
  viewProviders: [
    provideIcons({
      lucideBell,
      lucideCreditCard,
      lucideEllipsisVertical,
      lucideLogOut,
      lucideUserCircle,
    }),
  ],
  templateUrl: './dashboard-01-nav-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard01NavUserComponent {
  private readonly sidebar = inject(ZardSidebarService);
  /** shadcn opens these menus to the side of the sidebar on desktop and below the trigger on mobile. */
  protected readonly menuSide = computed<ZardDropdownSide>(() => (this.sidebar.isMobile() ? 'bottom' : 'right'));

  readonly user = input.required<Dashboard01User>();
}
