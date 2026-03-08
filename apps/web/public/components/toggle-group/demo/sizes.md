```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';

import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';
import { ZardIconRegistry } from '@/shared/core';

@Component({
  selector: 'demo-toggle-group-sizes',
  imports: [ZardToggleGroupComponent],
  template: `
    <div class="space-y-4">
      <div>
        <h3 class="mb-2 text-sm font-medium">Small</h3>
        <z-toggle-group zMode="multiple" zSize="sm" [items]="items" (valueChange)="onToggleChange($event)" />
      </div>

      <div>
        <h3 class="mb-2 text-sm font-medium">Default</h3>
        <z-toggle-group zMode="multiple" zSize="md" [items]="items" (valueChange)="onToggleChange($event)" />
      </div>

      <div>
        <h3 class="mb-2 text-sm font-medium">Large</h3>
        <z-toggle-group zMode="multiple" zSize="lg" [items]="items" (valueChange)="onToggleChange($event)" />
      </div>
    </div>
  `,
  viewProviders: [
    provideIcons({
      bold: ZardIconRegistry.bold,
      italic: ZardIconRegistry.italic,
      underline: ZardIconRegistry.underline,
    }),
  ],
})
export default class ToggleGroupSizesComponent {
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

```