import { Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideBold, lucideItalic, lucideUnderline } from '@ng-icons/lucide';

import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

@Component({
  selector: 'demo-toggle-group-vertical',
  imports: [ZardToggleGroupComponent],
  template: `
    <z-toggle-group
      zMode="multiple"
      zOrientation="vertical"
      [zDefaultValue]="['bold', 'italic']"
      [zItems]="items"
      [zSpacing]="1"
      (valueChange)="onToggleChange($event)"
    />
  `,
  viewProviders: [
    provideIcons({
      lucideBold,
      lucideItalic,
      lucideUnderline,
    }),
  ],
})
export default class ToggleGroupVerticalComponent {
  items: ZardToggleGroupItem[] = [
    {
      value: 'bold',
      icon: 'lucideBold',
      ariaLabel: 'Toggle bold',
    },
    {
      value: 'italic',
      icon: 'lucideItalic',
      ariaLabel: 'Toggle italic',
    },
    {
      value: 'underline',
      icon: 'lucideUnderline',
      ariaLabel: 'Toggle underline',
    },
  ];

  onToggleChange(value: string | string[]) {
    console.log('Toggle group changed:', value);
  }
}
