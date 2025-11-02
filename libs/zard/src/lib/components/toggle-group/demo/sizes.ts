import { Component } from '@angular/core';

import { ZardToggleGroupComponent, type ZardToggleGroupItem } from '../toggle-group.component';

@Component({
  selector: 'demo-toggle-group-sizes',
  standalone: true,
  imports: [ZardToggleGroupComponent],
  template: `
    <div class="space-y-4">
      <div>
        <h3 class="mb-2 text-sm font-medium">Small</h3>
        <z-toggle-group
          zMode="multiple"
          zSize="sm"
          [items]="items"
          (valueChange)="onToggleChange($event)"
        ></z-toggle-group>
      </div>

      <div>
        <h3 class="mb-2 text-sm font-medium">Default</h3>
        <z-toggle-group
          zMode="multiple"
          zSize="md"
          [items]="items"
          (valueChange)="onToggleChange($event)"
        ></z-toggle-group>
      </div>

      <div>
        <h3 class="mb-2 text-sm font-medium">Large</h3>
        <z-toggle-group
          zMode="multiple"
          zSize="lg"
          [items]="items"
          (valueChange)="onToggleChange($event)"
        ></z-toggle-group>
      </div>
    </div>
  `,
})
export default class ToggleGroupSizesComponent {
  items: ZardToggleGroupItem[] = [
    {
      value: 'bold',
      icon: 'bold',
      ariaLabel: 'Toggle bold',
    },
    {
      value: 'italic',
      icon: 'italic',
      ariaLabel: 'Toggle italic',
    },
    {
      value: 'underline',
      icon: 'underline',
      ariaLabel: 'Toggle underline',
    },
  ];

  onToggleChange(value: string | string[]) {
    console.log('Selected formatting:', value);
  }
}
