import { Component } from '@angular/core';

import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

@Component({
  selector: 'demo-toggle-group-outline',
  imports: [ZardToggleGroupComponent],
  template: `
    <z-toggle-group
      zDefaultValue="all"
      zMode="single"
      zType="outline"
      [zItems]="items"
      (valueChange)="onToggleChange($event)"
    />
  `,
})
export default class ToggleGroupOutlineComponent {
  items: ZardToggleGroupItem[] = [
    {
      value: 'all',
      label: 'All',
      ariaLabel: 'Toggle all',
    },
    {
      value: 'missed',
      label: 'Missed',
      ariaLabel: 'Toggle missed',
    },
  ];

  onToggleChange(value: string | string[]) {
    console.log('Selected:', value);
  }
}
