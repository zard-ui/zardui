```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';

import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';
import { zardTextAlignStartIcon, zardTextAlignCenterIcon, zardTextAlignEndIcon } from '@/shared/core';

@Component({
  selector: 'demo-toggle-group-single',
  imports: [ZardToggleGroupComponent],
  template: `
    <z-toggle-group zMode="single" [items]="items" defaultValue="center" (valueChange)="onToggleChange($event)" />
  `,
  viewProviders: [
    provideIcons({
      textAlignStart: zardTextAlignStartIcon,
      textAlignCenter: zardTextAlignCenterIcon,
      textAlignEnd: zardTextAlignEndIcon,
    }),
  ],
})
export default class ToggleGroupSingleComponent {
  items: ZardToggleGroupItem[] = [
    {
      value: 'left',
      icon: 'text-align-start',
      ariaLabel: 'Text align start',
    },
    {
      value: 'center',
      icon: 'text-align-center',
      ariaLabel: 'Text align center',
    },
    {
      value: 'right',
      icon: 'text-align-end',
      ariaLabel: 'Text align end',
    },
  ];

  onToggleChange(value: string | string[]) {
    console.log('Selected alignment:', value);
  }
}

```