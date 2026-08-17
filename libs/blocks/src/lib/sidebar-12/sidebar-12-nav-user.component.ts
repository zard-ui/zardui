import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBadgeCheck,
  lucideBell,
  lucideChevronsUpDown,
  lucideCreditCard,
  lucideLogOut,
  lucideSparkles,
} from '@ng-icons/lucide';

import { ZardAvatarComponent } from '@zard/components/avatar/avatar.component';
import { ZardDropdownImports } from '@zard/components/dropdown/dropdown.imports';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

export interface Sidebar12User {
  readonly name: string;
  readonly email: string;
  readonly avatar: string;
}

@Component({
  selector: 'lib-sidebar-12-nav-user',
  standalone: true,
  imports: [...ZardSidebarImports, ...ZardDropdownImports, ZardAvatarComponent, NgIcon],
  viewProviders: [
    provideIcons({
      lucideBadgeCheck,
      lucideBell,
      lucideChevronsUpDown,
      lucideCreditCard,
      lucideLogOut,
      lucideSparkles,
    }),
  ],
  templateUrl: './sidebar-12-nav-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar12NavUserComponent {
  readonly user = input.required<Sidebar12User>();
}
