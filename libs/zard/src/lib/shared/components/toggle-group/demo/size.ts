import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

@Component({
  selector: 'z-demo-toggle-group-size',
  imports: [ZardToggleGroupComponent],
  template: `
    <div class="flex flex-col gap-4">
      <z-toggle-group
        zDefaultValue="top"
        zMode="single"
        zSize="sm"
        zType="outline"
        [zItems]="items"
        (valueChange)="onToggleChange($event)"
      />
      <z-toggle-group
        zDefaultValue="top"
        zMode="single"
        zType="outline"
        [zItems]="items"
        (valueChange)="onToggleChange($event)"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoToggleGroupSizeComponent {
  items: ZardToggleGroupItem[] = [
    {
      value: 'top',
      label: 'Top',
      ariaLabel: 'Toggle top',
    },
    {
      value: 'bottom',
      label: 'Bottom',
      ariaLabel: 'Toggle bottom',
    },
    {
      value: 'left',
      label: 'Left',
      ariaLabel: 'Toggle left',
    },
    {
      value: 'right',
      label: 'Right',
      ariaLabel: 'Toggle right',
    },
  ];

  onToggleChange(value: string | string[]) {
    console.log('Selected:', value);
  }
}
