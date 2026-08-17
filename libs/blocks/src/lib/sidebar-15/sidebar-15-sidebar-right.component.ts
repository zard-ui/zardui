import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';

import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

import { Sidebar15CalendarsComponent, type Sidebar15Calendar } from './sidebar-15-calendars.component';
import { Sidebar15DatePickerComponent } from './sidebar-15-date-picker.component';
import { Sidebar15NavUserComponent, type Sidebar15User } from './sidebar-15-nav-user.component';

@Component({
  selector: 'lib-sidebar-15-sidebar-right',
  standalone: true,
  imports: [
    ...ZardSidebarImports,
    Sidebar15NavUserComponent,
    Sidebar15DatePickerComponent,
    Sidebar15CalendarsComponent,
    NgIcon,
  ],
  viewProviders: [provideIcons({ lucidePlus })],
  templateUrl: './sidebar-15-sidebar-right.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Sidebar15SidebarRightComponent {
  // This is sample data.
  protected readonly user: Sidebar15User = {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: 'https://github.com/shadcn.png',
  };

  protected readonly calendars: readonly Sidebar15Calendar[] = [
    { name: 'My Calendars', items: ['Personal', 'Work', 'Family'] },
    { name: 'Favorites', items: ['Holidays', 'Birthdays'] },
    { name: 'Other', items: ['Travel', 'Reminders', 'Deadlines'] },
  ];
}
