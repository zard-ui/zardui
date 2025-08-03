```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardToggleGroupComponent, ZardToggleGroupItem } from '../toggle-group.component';

@Component({
  selector: 'demo-toggle-group-basic',
  standalone: true,
  imports: [ZardToggleGroupComponent],
  template: ` <z-toggle-group zMode="multiple" [items]="items" [defaultValue]="['italic']" (valueChange)="onToggleChange($event)"></z-toggle-group> `,
})
export default class ToggleGroupBasicComponent {
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