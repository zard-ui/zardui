```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardToggleGroupComponent, type ZardToggleGroupItem } from '../toggle-group.component';

@Component({
  selector: 'demo-toggle-group-default',
  imports: [ZardToggleGroupComponent],
  standalone: true,
  template: `
    <z-toggle-group
      zMode="multiple"
      [items]="items"
      [defaultValue]="['italic']"
      (valueChange)="onToggleChange($event)"
    />
  `,
})
export default class ToggleGroupDefaultComponent {
  items: ZardToggleGroupItem[] = [
    {
      value: 'bold',
      icon: 'bold',
      ariaLabel: 'Toggle bold',
    },
    {
      value: 'italic',
      icon: 'italic',
      ariaLabel: 'Toggle italic',
    },
    {
      value: 'underline',
      icon: 'underline',
      ariaLabel: 'Toggle underline',
    },
  ];

  onToggleChange(value: string | string[]) {
    console.log('Toggle group changed:', value);
  }
}

```