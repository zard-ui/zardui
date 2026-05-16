import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCreditCard, lucideKeyboard, lucideSettings, lucideUser } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';

@Component({
  selector: 'z-dropdown-icons-demo',
  imports: [ZardDropdownImports, ZardButtonComponent, NgIcon],
  template: `
    <button type="button" z-button zType="outline" z-dropdown [zDropdownMenu]="menu">Open</button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-item (click)="log('Profile')">
        <ng-icon name="lucideUser" class="mr-2 size-4" />
        Profile
      </z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Billing')">
        <ng-icon name="lucideCreditCard" class="mr-2 size-4" />
        Billing
      </z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Settings')">
        <ng-icon name="lucideSettings" class="mr-2 size-4" />
        Settings
      </z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Keyboard shortcuts')">
        <ng-icon name="lucideKeyboard" class="mr-2 size-4" />
        Keyboard shortcuts
      </z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  viewProviders: [provideIcons({ lucideUser, lucideCreditCard, lucideSettings, lucideKeyboard })],
})
export class ZardDropdownIconsDemoComponent {
  log(item: string) {
    console.log(`${item} clicked`);
  }
}
