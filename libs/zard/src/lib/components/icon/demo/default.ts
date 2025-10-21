import { Component } from '@angular/core';
import { House, Settings, User, Search, Bell, Mail } from 'lucide-angular';

import { ZardIconComponent } from '../icon.component';

@Component({
  standalone: true,
  imports: [ZardIconComponent],
  template: `
    <div class="flex items-center gap-4">
      <z-icon [zType]="HouseIcon" />
      <z-icon [zType]="SettingsIcon" />
      <z-icon [zType]="UserIcon" />
      <z-icon [zType]="SearchIcon" />
      <z-icon [zType]="BellIcon" />
      <z-icon [zType]="MailIcon" />
    </div>
  `,
})
export class ZardDemoIconDefaultComponent {
  readonly HouseIcon = House;
  readonly SettingsIcon = Settings;
  readonly UserIcon = User;
  readonly SearchIcon = Search;
  readonly BellIcon = Bell;
  readonly MailIcon = Mail;
}
