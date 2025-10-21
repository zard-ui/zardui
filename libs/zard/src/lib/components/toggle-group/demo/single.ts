import { Component } from '@angular/core';

import { ZardToggleGroupComponent, ZardToggleGroupItem } from '../toggle-group.component';

@Component({
  selector: 'demo-toggle-group-single',
  standalone: true,
  imports: [ZardToggleGroupComponent],
  template: ` <z-toggle-group zMode="single" [items]="items" defaultValue="center" (valueChange)="onToggleChange($event)"></z-toggle-group> `,
})
export default class ToggleGroupSingleComponent {
  items: ZardToggleGroupItem[] = [
    {
      value: 'left',
      icon: 'TextAlignStart',
      ariaLabel: 'Text align start',
    },
    {
      value: 'center',
      icon: 'TextAlignCenter',
      ariaLabel: 'Text align center',
    },
    {
      value: 'right',
      icon: 'TextAlignEnd',
      ariaLabel: 'Text align end',
    },
  ];

  onToggleChange(value: string | string[]) {
    console.log('Selected alignment:', value);
  }
}
