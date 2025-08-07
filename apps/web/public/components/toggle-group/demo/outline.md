```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardToggleGroupComponent, ZardToggleGroupItem } from '../toggle-group.component';

@Component({
  selector: 'demo-toggle-group-outline',
  standalone: true,
  imports: [ZardToggleGroupComponent],
  template: ` <z-toggle-group zMode="multiple" zType="outline" [items]="items" (valueChange)="onToggleChange($event)"></z-toggle-group> `,
})
export default class ToggleGroupOutlineComponent {
  items: ZardToggleGroupItem[] = [
    {
      value: 'bold',
      icon: 'icon-bold',
      ariaLabel: 'Toggle bold',
    },
    {
      value: 'italic',
      icon: 'icon-italic',
      ariaLabel: 'Toggle italic',
    },
    {
      value: 'underline',
      icon: 'icon-underline',
      ariaLabel: 'Toggle underline',
    },
  ];

  onToggleChange(value: string | string[]) {
    console.log('Selected formatting:', value);
  }
}

```