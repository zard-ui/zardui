```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardToggleGroupComponent, ZardToggleGroupItem } from '../toggle-group.component';

@Component({
  selector: 'demo-toggle-group-with-text',
  standalone: true,
  imports: [ZardToggleGroupComponent],
  template: ` <z-toggle-group zMode="multiple" [items]="items" [defaultValue]="['italic']" (valueChange)="onToggleChange($event)"></z-toggle-group> `,
})
export default class ToggleGroupWithTextComponent {
  items: ZardToggleGroupItem[] = [
    {
      value: 'bold',
      icon: 'icon-bold',
      label: 'Bold',
      ariaLabel: 'Toggle bold',
    },
    {
      value: 'italic',
      icon: 'icon-italic',
      label: 'Italic',
      ariaLabel: 'Toggle italic',
    },
    {
      value: 'underline',
      icon: 'icon-underline',
      label: 'Underline',
      ariaLabel: 'Toggle underline',
    },
  ];

  onToggleChange(value: string | string[]) {
    console.log('Selected formatting:', value);
  }
}

```