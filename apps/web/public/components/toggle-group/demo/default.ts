import { Component } from '@angular/core';

import { ToggleGroupValue, ZardToggleGroupComponent } from '../toggle-group.component';

@Component({
  selector: 'demo-toggle-group-default',
  standalone: true,
  imports: [ZardToggleGroupComponent],
  template: ` <z-toggle-group [zValue]="toggleItems" (onChange)="onToggleChange($event)"></z-toggle-group> `,
})
export default class ToggleGroupDefaultDemo {
  toggleItems: ToggleGroupValue[] = [
    {
      value: 'bold',
      checked: false,
      content: '<div class="icon-bold"></div>',
    },
    {
      value: 'italic',
      checked: true,
      content: '<div class="icon-italic"></div>',
    },
    {
      value: 'underline',
      checked: false,
      content: '<div class="icon-underline"></div>',
    },
  ];

  onToggleChange(value: ToggleGroupValue[]) {
    console.log('Toggle group changed:', value);
    this.toggleItems = value;
  }
}
