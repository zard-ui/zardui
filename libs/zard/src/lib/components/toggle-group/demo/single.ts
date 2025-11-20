import { Component } from '@angular/core';

import { ZardToggleGroupComponent, type ZardToggleGroupItem } from '../toggle-group.component';

@Component({
  selector: 'demo-toggle-group-single',
  imports: [ZardToggleGroupComponent],
  standalone: true,
  template: `
    <z-toggle-group zMode="single" [items]="items" defaultValue="center" (valueChange)="onToggleChange($event)" />
  `,
})
export default class ToggleGroupSingleComponent {
  items: ZardToggleGroupItem[] = [
    {
      value: 'left',
      icon: 'text-align-start',
      ariaLabel: 'Text align start',
    },
    {
      value: 'center',
      icon: 'text-align-center',
      ariaLabel: 'Text align center',
    },
    {
      value: 'right',
      icon: 'text-align-end',
      ariaLabel: 'Text align end',
    },
  ];

  onToggleChange(value: string | string[]) {
    console.log('Selected alignment:', value);
  }
}
