import { Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';

import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';
import { zardBoldIcon, zardItalicIcon, zardUnderlineIcon } from '@/shared/core';

@Component({
  selector: 'demo-toggle-group-outline',
  imports: [ZardToggleGroupComponent],
  template: `
    <z-toggle-group zMode="multiple" zType="outline" [items]="items" (valueChange)="onToggleChange($event)" />
  `,
  viewProviders: [provideIcons({ bold: zardBoldIcon, italic: zardItalicIcon, underline: zardUnderlineIcon })],
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
