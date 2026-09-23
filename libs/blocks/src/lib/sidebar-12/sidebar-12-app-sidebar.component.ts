import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';

import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

import { Sidebar12CalendarsComponent, type Sidebar12Calendar } from './sidebar-12-calendars.component';
import { Sidebar12DatePickerComponent } from './sidebar-12-date-picker.component';
import { Sidebar12NavUserComponent, type Sidebar12User } from './sidebar-12-nav-user.component';

@Component({
  selector: 'lib-sidebar-12-app-sidebar',
  standalone: true,
  imports: [
    ...ZardSidebarImports,
    Sidebar12NavUserComponent,
    Sidebar12DatePickerComponent,
    Sidebar12CalendarsComponent,
    NgIcon,
  ],
  viewProviders: [provideIcons({ lucidePlus })],
  templateUrl: './sidebar-12-app-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Sidebar12AppSidebarComponent {
  // This is sample data.
  protected readonly user: Sidebar12User = {
    name: 'zard ui',
    email: 'm@example.com',
    avatar: 'https://github.com/zard-ui.png',
  };

  protected readonly calendars: readonly Sidebar12Calendar[] = [
    { name: 'My Calendars', items: ['Personal', 'Work', 'Family'] },
    { name: 'Favorites', items: ['Holidays', 'Birthdays'] },
    { name: 'Other', items: ['Travel', 'Reminders', 'Deadlines'] },
  ];
}
