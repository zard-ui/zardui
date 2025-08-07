import { Component } from '@angular/core';
import { ZardToggleGroupComponent, ToggleGroupValue } from '../toggle-group.component';

@Component({
  selector: 'demo-toggle-group-sizes',
  standalone: true,
  imports: [ZardToggleGroupComponent],
  template: `
    <div class="space-y-4">
      <div>
        <h3 class="text-sm font-medium mb-2">Small</h3>
        <z-toggle-group [zValue]="items" zSize="sm"></z-toggle-group>
      </div>

      <div>
        <h3 class="text-sm font-medium mb-2">Medium (Default)</h3>
        <z-toggle-group [zValue]="items" zSize="md"></z-toggle-group>
      </div>

      <div>
        <h3 class="text-sm font-medium mb-2">Large</h3>
        <z-toggle-group [zValue]="items" zSize="lg"></z-toggle-group>
      </div>
    </div>
  `,
})
export default class ToggleGroupSizesDemo {
  items: ToggleGroupValue[] = [
    {
      value: 'left',
      checked: false,
      content: '<div class="icon-align-left"></div>',
    },
    {
      value: 'center',
      checked: true,
      content: '<div class="icon-align-center"></div>',
    },
    {
      value: 'right',
      checked: false,
      content: '<div class="icon-align-right"></div>',
    },
  ];
}
