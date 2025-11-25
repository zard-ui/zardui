import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardDividerComponent } from '../../divider/divider.component';
import { ZardDropdownModule } from '../dropdown.module';

@Component({
  selector: 'z-dropdown-demo',
  imports: [ZardDropdownModule, ZardButtonComponent, ZardDividerComponent],
  standalone: true,
  template: `
    <button type="button" z-button zType="outline" z-dropdown [zDropdownMenu]="menu">Open</button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-label>My Account</z-dropdown-menu-label>

      <z-dropdown-menu-item (click)="onProfile()">
        Profile
        <z-dropdown-menu-shortcut>⇧⌘P</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>

      <z-dropdown-menu-item (click)="onBilling()">
        Billing
        <z-dropdown-menu-shortcut>⌘B</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>

      <z-dropdown-menu-item (click)="onSettings()">
        Settings
        <z-dropdown-menu-shortcut>⌘S</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>

      <z-dropdown-menu-item (click)="onKeyboardShortcuts()">
        Keyboard shortcuts
        <z-dropdown-menu-shortcut>⌘K</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>

      <z-divider zSpacing="sm" class="-mx-1" />

      <z-dropdown-menu-item (click)="onTeam()">Team</z-dropdown-menu-item>

      <z-dropdown-menu-item (click)="onNewTeam()">
        New Team
        <z-dropdown-menu-shortcut>⌘+T</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>

      <z-divider zSpacing="sm" class="-mx-1" />

      <z-dropdown-menu-item (click)="onGitHub()">GitHub</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="onSupport()">Support</z-dropdown-menu-item>
      <z-dropdown-menu-item disabled="true">API</z-dropdown-menu-item>

      <z-divider zSpacing="sm" class="-mx-1" />

      <z-dropdown-menu-item (click)="onLogout()">
        Log out
        <z-dropdown-menu-shortcut>⇧⌘Q</z-dropdown-menu-shortcut>
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
