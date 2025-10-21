import { Component } from '@angular/core';

import { ZardToggleGroupComponent, ZardToggleGroupItem } from '../toggle-group.component';
import { Bold, Italic, Underline } from 'lucide-angular';

@Component({
  selector: 'demo-toggle-group-sizes',
  standalone: true,
  imports: [ZardToggleGroupComponent],
  template: `
    <div class="space-y-4">
      <div>
        <h3 class="text-sm font-medium mb-2">Small</h3>
        <z-toggle-group zMode="multiple" zSize="sm" [items]="items" (valueChange)="onToggleChange($event)"></z-toggle-group>
      </div>

      <div>
        <h3 class="text-sm font-medium mb-2">Default</h3>
        <z-toggle-group zMode="multiple" zSize="md" [items]="items" (valueChange)="onToggleChange($event)"></z-toggle-group>
      </div>

      <div>
        <h3 class="text-sm font-medium mb-2">Large</h3>
        <z-toggle-group zMode="multiple" zSize="lg" [items]="items" (valueChange)="onToggleChange($event)"></z-toggle-group>
      </div>
    </div>
  `,
})
export default class ToggleGroupSizesComponent {
  items: ZardToggleGroupItem[] = [
    {
      value: 'bold',
      icon: Bold,
      ariaLabel: 'Toggle bold',
    },
    {
      value: 'italic',
      icon: Italic,
      ariaLabel: 'Toggle italic',
    },
    {
      value: 'underline',
      icon: Underline,
      ariaLabel: 'Toggle underline',
    },
  ];

  onToggleChange(value: string | string[]) {
    console.log('Selected formatting:', value);
  }
}
