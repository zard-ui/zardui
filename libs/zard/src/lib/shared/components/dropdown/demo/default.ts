import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';

@Component({
  selector: 'z-dropdown-demo',
  imports: [ZardDropdownImports, ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" z-dropdown [zDropdownMenu]="menu">Open menu</button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-48">
      <z-dropdown-menu-item (click)="log('Profile')">Profile</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Billing')">Billing</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Team')">Team</z-dropdown-menu-item>
      <z-dropdown-menu-item [disabled]="true">Subscription</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
})
export class ZardDropdownDemoComponent {
  log(item: string) {
    console.log(`${item} clicked`);
  }
}
