import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';

@Component({
  selector: 'z-dropdown-checkboxes-demo',
  imports: [ZardDropdownImports, ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" z-dropdown [zDropdownMenu]="menu">View options</button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-checkbox-item [(zChecked)]="statusBar">Status Bar</z-dropdown-menu-checkbox-item>
      <z-dropdown-menu-checkbox-item [(zChecked)]="activityBar">Activity Bar</z-dropdown-menu-checkbox-item>
      <z-dropdown-menu-checkbox-item [(zChecked)]="panel">Panel</z-dropdown-menu-checkbox-item>
    </z-dropdown-menu-content>
  `,
})
export class ZardDropdownCheckboxesDemoComponent {
  statusBar = true;
  activityBar = false;
  panel = false;
}
