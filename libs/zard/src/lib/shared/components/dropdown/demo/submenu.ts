import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';
import { ZardMenuImports } from '@/shared/components/menu';

@Component({
  selector: 'z-dropdown-submenu-demo',
  imports: [ZardDropdownImports, ZardButtonComponent, ZardMenuImports, NgIcon],
  template: `
    <button type="button" z-button zType="outline" z-dropdown [zDropdownMenu]="menu">Open</button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-item (click)="log('Back')">Back</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Forward')">Forward</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Reload')">Reload</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <button type="button" z-menu-item z-menu [zMenuTriggerFor]="moreToolsMenu" zPlacement="rightTop">
        More Tools
        <ng-icon name="lucideChevronRight" class="ml-auto size-4" />
      </button>
    </z-dropdown-menu-content>

    <ng-template #moreToolsMenu>
      <div z-menu-content class="w-48">
        <button type="button" z-menu-item (click)="log('Save Page As')">Save Page As...</button>
        <button type="button" z-menu-item (click)="log('Create Shortcut')">Create Shortcut...</button>
        <button type="button" z-menu-item (click)="log('Developer Tools')">Developer Tools</button>
      </div>
    </ng-template>
  `,
  viewProviders: [provideIcons({ lucideChevronRight })],
})
export class ZardDropdownSubmenuDemoComponent {
  log(item: string) {
    console.log(`${item} clicked`);
  }
}
