import { Component } from '@angular/core';

import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

@Component({
  selector: 'demo-toggle-group-spacing',
  imports: [ZardToggleGroupComponent],
  template: `
    <z-toggle-group
      zDefaultValue="top"
      zMode="single"
      zSize="sm"
      zType="outline"
      [zItems]="items"
      [zSpacing]="2"
      (valueChange)="onToggleChange($event)"
    />
  `,
})
export default class ToggleGroupSpacingComponent {
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
