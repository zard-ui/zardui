import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';

@Component({
  selector: 'z-demo-dropdown-submenu',
  imports: [ZardDropdownImports, ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" z-dropdown [zDropdownMenu]="menu">Open</button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-item (click)="log('Back')">Back</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Forward')">Forward</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Reload')">Reload</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-sub-trigger [zSubMenu]="moreTools">More Tools</z-dropdown-menu-sub-trigger>
      <z-dropdown-menu-sub-content #moreTools="zDropdownMenuSubContent" class="w-48">
        <z-dropdown-menu-item (click)="log('Save Page As')">Save Page As...</z-dropdown-menu-item>
        <z-dropdown-menu-item (click)="log('Create Shortcut')">Create Shortcut...</z-dropdown-menu-item>
        <z-dropdown-menu-item (click)="log('Developer Tools')">Developer Tools</z-dropdown-menu-item>
      </z-dropdown-menu-sub-content>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDropdownSubmenuComponent {
  log(item: string) {
    console.log(`${item} clicked`);
  }
}
