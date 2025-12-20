```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDividerComponent } from '@/shared/components/divider';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';
import { ZardMenuImports } from '@/shared/components/menu';

@Component({
  selector: 'z-dropdown-demo',
  imports: [ZardDropdownImports, ZardButtonComponent, ZardDividerComponent, ZardMenuImports],
  template: `
    <button type="button" z-button zType="outline" z-dropdown [zDropdownMenu]="menu">Open</button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-56">
      <z-menu-label>My Account</z-menu-label>

      <z-dropdown-menu-item (click)="onProfile()">
        Profile
        <z-menu-shortcut>⇧⌘P</z-menu-shortcut>
      </z-dropdown-menu-item>

      <z-dropdown-menu-item (click)="onBilling()">
        Billing
        <z-menu-shortcut>⌘B</z-menu-shortcut>
      </z-dropdown-menu-item>

      <z-dropdown-menu-item (click)="onSettings()">
        Settings
        <z-menu-shortcut>⌘S</z-menu-shortcut>
      </z-dropdown-menu-item>

      <z-dropdown-menu-item (click)="onKeyboardShortcuts()">
        Keyboard shortcuts
        <z-menu-shortcut>⌘K</z-menu-shortcut>
      </z-dropdown-menu-item>

      <z-divider zSpacing="sm" class="-mx-1" />

      <z-dropdown-menu-item (click)="onTeam()">Team</z-dropdown-menu-item>

      <z-dropdown-menu-item (click)="onNewTeam()">
        New Team
        <z-menu-shortcut>⌘+T</z-menu-shortcut>
      </z-dropdown-menu-item>

      <z-divider zSpacing="sm" class="-mx-1" />

      <z-dropdown-menu-item (click)="onGitHub()">GitHub</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="onSupport()">Support</z-dropdown-menu-item>
      <z-dropdown-menu-item disabled="true">API</z-dropdown-menu-item>

      <z-divider zSpacing="sm" class="-mx-1" />

      <z-dropdown-menu-item (click)="onLogout()">
        Log out
        <z-menu-shortcut>⇧⌘Q</z-menu-shortcut>
      </z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
})
export class ZardDropdownDemoComponent {
  onProfile() {
    console.log('Profile clicked');
  }

  onBilling() {
    console.log('Billing clicked');
  }

  onSettings() {
    console.log('Settings clicked');
  }

  onKeyboardShortcuts() {
    console.log('Keyboard shortcuts clicked');
  }

  onTeam() {
    console.log('Team clicked');
  }

  onNewTeam() {
    console.log('New Team clicked');
  }

  onGitHub() {
    console.log('GitHub clicked');
  }

  onSupport() {
    console.log('Support clicked');
  }

  onLogout() {
    console.log('Log out clicked');
  }
}

```