```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardDropdownDirective } from '../dropdown-trigger.directive';
import { ZardDropdownMenuContentComponent } from '../dropdown-menu-content.component';
import { ZardDropdownMenuItemComponent } from '../dropdown-item.component';
import { ZardDropdownMenuLabelComponent } from '../dropdown-label.component';
import { ZardDropdownMenuShortcutComponent } from '../dropdown-shortcut.component';
import { ZardButtonComponent } from '../../button/button.component';
import { ZardDividerComponent } from '../../divider/divider.component';

@Component({
  selector: 'z-dropdown-ng-zorro-demo',
  standalone: true,
  imports: [
    ZardDropdownDirective,
    ZardDropdownMenuContentComponent,
    ZardDropdownMenuItemComponent,
    ZardDropdownMenuLabelComponent,
    ZardDropdownMenuShortcutComponent,
    ZardButtonComponent,
    ZardDividerComponent,
  ],
  template: `
    <!-- Exemplo 1: Click -->
    <z-button z-dropdown [zDropdownMenu]="clickMenu" zType="outline">
      Click me
    </z-button>

    <z-dropdown-menu-content #clickMenu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-label>My Account</z-dropdown-menu-label>
      
      <z-dropdown-menu-item (click)="onProfile()">
        Profile
        <z-dropdown-menu-shortcut>⇧⌘P</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      
      <z-dropdown-menu-item (click)="onSettings()">
        Settings
        <z-dropdown-menu-shortcut>⌘S</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      
      <z-divider zSpacing="sm" class="-mx-1"></z-divider>
      
      <z-dropdown-menu-item variant="destructive" (click)="onLogout()">
        Log out
        <z-dropdown-menu-shortcut>⇧⌘Q</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
    </z-dropdown-menu-content>

    <br><br>

    <!-- Exemplo 2: Hover -->
    <z-button z-dropdown [zDropdownMenu]="hoverMenu" zTrigger="hover" zType="default">
      Hover me
    </z-button>

    <z-dropdown-menu-content #hoverMenu="zDropdownMenuContent" class="w-48">
      <z-dropdown-menu-item (click)="onEdit()">Edit</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="onDuplicate()">Duplicate</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="onDelete()">Delete</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
})
export class ZardDropdownNgZorroStyleDemoComponent {
  onProfile() {
    console.log('Profile clicked');
  }

  onSettings() {
    console.log('Settings clicked');
  }

  onLogout() {
    console.log('Log out clicked');
  }

  onEdit() {
    console.log('Edit clicked');
  }

  onDuplicate() {
    console.log('Duplicate clicked');
  }

  onDelete() {
    console.log('Delete clicked');
  }
}
```