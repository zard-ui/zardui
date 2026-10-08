import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBell, lucideMail, lucideMessageSquare } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';

@Component({
  selector: 'z-demo-dropdown-checkboxes-icons',
  imports: [ZardDropdownImports, ZardButtonComponent, NgIcon],
  template: `
    <button type="button" z-button zType="outline" z-dropdown [zDropdownMenu]="menu">Notifications</button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-64">
      <z-dropdown-menu-label>Notification Preferences</z-dropdown-menu-label>
      <z-dropdown-menu-checkbox-item [(zChecked)]="email">
        <ng-icon name="lucideMail" class="mr-2 size-4" />
        Email notifications
      </z-dropdown-menu-checkbox-item>
      <z-dropdown-menu-checkbox-item [(zChecked)]="sms">
        <ng-icon name="lucideMessageSquare" class="mr-2 size-4" />
        SMS notifications
      </z-dropdown-menu-checkbox-item>
      <z-dropdown-menu-checkbox-item [(zChecked)]="push">
        <ng-icon name="lucideBell" class="mr-2 size-4" />
        Push notifications
      </z-dropdown-menu-checkbox-item>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideMail, lucideMessageSquare, lucideBell })],
})
export class ZardDemoDropdownCheckboxesIconsComponent {
  email = true;
  sms = false;
  push = true;
}
