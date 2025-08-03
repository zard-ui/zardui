```angular-ts showLineNumbers
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
      icon: 'icon-align-left',
      ariaLabel: 'Align left',
    },
    {
      value: 'center',
      icon: 'icon-align-center',
      ariaLabel: 'Align center',
    },
    {
      value: 'right',
      icon: 'icon-align-right',
      ariaLabel: 'Align right',
    },
  ];

  onToggleChange(value: string | string[]) {
    console.log('Selected alignment:', value);
  }
}

```