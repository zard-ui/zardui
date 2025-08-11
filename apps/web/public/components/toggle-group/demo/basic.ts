import { Component } from '@angular/core';
import { ZardToggleGroupComponent, ToggleGroupValue } from '../toggle-group.component';

@Component({
  selector: 'demo-toggle-group-basic',
  standalone: true,
  imports: [ZardToggleGroupComponent],
  template: ` <z-toggle-group [zValue]="formatting" (onChange)="onToggleChange($event)"></z-toggle-group> `,
})
export default class ToggleGroupBasicDemo {
  formatting: ToggleGroupValue[] = [
    {
      value: 'bold',
      checked: false,
      content: '<div class="icon-bold"></div> Bold',
    },
    {
      value: 'italic',
      checked: true,
      content: '<div class="icon-italic"></div> Italic',
    },
    {
      value: 'underline',
      checked: false,
      content: '<div class="icon-underline"></div> Underline',
    },
  ];

  onToggleChange(value: ToggleGroupValue[]) {
    console.log(
      'Selected formatting:',
      value.filter(item => item.checked),
    );
    this.formatting = value;
  }
}
