import { Component } from '@angular/core';

import { ZardToggleGroupComponent, ZardToggleGroupItem } from '@ngzard/ui/toggle-group';

@Component({
  selector: 'demo-toggle-group-outline',
  imports: [ZardToggleGroupComponent],
  standalone: true,
  template: `
    <z-toggle-group zMode="multiple" zType="outline" [items]="items" (valueChange)="onToggleChange($event)" />
  `,
})
export default class ToggleGroupOutlineComponent {
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
    console.log('Selected formatting:', value);
  }
}
