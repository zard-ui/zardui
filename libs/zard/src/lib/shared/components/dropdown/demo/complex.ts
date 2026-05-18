import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';

@Component({
  selector: 'z-dropdown-complex-demo',
  imports: [ZardDropdownImports, ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" z-dropdown [zDropdownMenu]="menu">Open</button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-label>My Account</z-dropdown-menu-label>
      <z-dropdown-menu-item (click)="log('Profile')">
        Profile
        <z-dropdown-menu-shortcut>⇧⌘P</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Billing')">
        Billing
        <z-dropdown-menu-shortcut>⌘B</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Settings')">
        Settings
        <z-dropdown-menu-shortcut>⌘S</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Keyboard shortcuts')">
        Keyboard shortcuts
        <z-dropdown-menu-shortcut>⌘K</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item (click)="log('Team')">Team</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('New Team')">
        New Team
        <z-dropdown-menu-shortcut>⌘+T</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item (click)="log('GitHub')">GitHub</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Support')">Support</z-dropdown-menu-item>
      <z-dropdown-menu-item [disabled]="true">API</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item (click)="log('Log out')">
        Log out
        <z-dropdown-menu-shortcut>⇧⌘Q</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
})
export class ZardDropdownComplexDemoComponent {
  log(item: string) {
    console.log(`${item} clicked`);
  }
}
