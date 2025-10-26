```angular-ts showLineNumbers copyButton
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

```