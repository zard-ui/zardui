import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';

@Component({
  selector: 'z-dropdown-radio-group-demo',
  imports: [ZardDropdownImports, ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" z-dropdown [zDropdownMenu]="menu">Panel position</button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-label>Panel Position</z-dropdown-menu-label>
      <z-dropdown-menu-radio-group [(zValue)]="selected">
        @for (position of positions; track position.value) {
          <z-dropdown-menu-radio-item [zValue]="position.value">
            {{ position.label }}
          </z-dropdown-menu-radio-item>
        }
      </z-dropdown-menu-radio-group>
    </z-dropdown-menu-content>
  `,
})
export class ZardDropdownRadioGroupDemoComponent {
  selected = 'bottom';
  positions = [
    { value: 'top', label: 'Top' },
    { value: 'bottom', label: 'Bottom' },
    { value: 'right', label: 'Right' },
  ];
}
