import { Component } from '@angular/core';

import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

@Component({
  selector: 'z-demo-toggle-group-sizes',
  imports: [ZardToggleGroupComponent],
  template: `
    <div class="space-y-4">
      <div>
        <z-toggle-group
          zDefaultValue="top"
          zMode="single"
          zSize="sm"
          [zItems]="items"
          zType="outline"
          (valueChange)="onToggleChange($event)"
        />
      </div>
      <div>
        <z-toggle-group
          zDefaultValue="top"
          zMode="single"
          zSize="lg"
          [zItems]="items"
          zType="outline"
          (valueChange)="onToggleChange($event)"
        />
      </div>
    </div>
  `,
})
export class ZardDemoToggleGroupSizesComponent {
  items: ZardToggleGroupItem[] = [
    {
      value: 'top',
      label: 'Top',
      ariaLabel: 'Toggle top',
    },
    {
      value: 'bottom',
      label: 'Bottom',
      ariaLabel: 'Toggle bottom',
    },
    {
      value: 'left',
      label: 'Left',
      ariaLabel: 'Toggle left',
    },
    {
      value: 'right',
      label: 'Right',
      ariaLabel: 'Toggle right',
    },
  ];

  onToggleChange(value: string | string[]) {
    console.log('Selected:', value);
  }
}
