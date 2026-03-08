import { Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';

import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';
import { ZardIconRegistry } from '@/shared/core';

@Component({
  selector: 'demo-toggle-group-default',
  imports: [ZardToggleGroupComponent],
  template: `
    <z-toggle-group
      zMode="multiple"
      [items]="items"
      [defaultValue]="['italic']"
      (valueChange)="onToggleChange($event)"
    />
  `,
  viewProviders: [
    provideIcons({
      bold: ZardIconRegistry.bold,
      italic: ZardIconRegistry.italic,
      underline: ZardIconRegistry.underline,
    }),
  ],
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
