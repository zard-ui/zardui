import { Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideTextAlignCenter, lucideTextAlignEnd, lucideTextAlignStart } from '@ng-icons/lucide';

import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

@Component({
  selector: 'demo-toggle-group-single',
  imports: [ZardToggleGroupComponent],
  template: `
    <z-toggle-group zMode="single" [items]="items" defaultValue="center" (valueChange)="onToggleChange($event)" />
  `,
  viewProviders: [
    provideIcons({
      lucideTextAlignStart,
      lucideTextAlignCenter,
      lucideTextAlignEnd,
    }),
  ],
})
export default class ToggleGroupSingleComponent {
  items: ZardToggleGroupItem[] = [
    {
      value: 'left',
      icon: 'lucideTextAlignStart',
      ariaLabel: 'Text align start',
    },
    {
      value: 'center',
      icon: 'lucideTextAlignCenter',
      ariaLabel: 'Text align center',
    },
    {
      value: 'right',
      icon: 'lucideTextAlignEnd',
      ariaLabel: 'Text align end',
    },
  ];

  onToggleChange(value: string | string[]) {
    console.log('Selected alignment:', value);
  }
}
