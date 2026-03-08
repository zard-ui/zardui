```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';

import { ZardIconRegistry } from '@/shared/core';

import { ZardToggleGroupComponent, type ZardToggleGroupItem } from '../toggle-group.component';

@Component({
  selector: 'demo-toggle-group-with-text',
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
export default class ToggleGroupWithTextComponent {
  items: ZardToggleGroupItem[] = [
    {
      value: 'bold',
      icon: 'bold',
      label: 'Bold',
      ariaLabel: 'Toggle bold',
    },
    {
      value: 'italic',
      icon: 'italic',
      label: 'Italic',
      ariaLabel: 'Toggle italic',
    },
    {
      value: 'underline',
      icon: 'underline',
      label: 'Underline',
      ariaLabel: 'Toggle underline',
    },
  ];

  onToggleChange(value: string | string[]) {
    console.log('Selected formatting:', value);
  }
}

```