import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';

@Component({
  selector: 'z-dropdown-destructive-demo',
  imports: [ZardDropdownImports, ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" z-dropdown [zDropdownMenu]="menu">Project</button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-48">
      <z-dropdown-menu-item (click)="log('Rename')">Rename</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Duplicate')">Duplicate</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item zType="destructive" (click)="log('Delete')">Delete</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
})
export class ZardDropdownDestructiveDemoComponent {
  log(item: string) {
    console.log(`${item} clicked`);
  }
}
