import { Component, computed, signal } from '@angular/core';

import { ZardSelectItemComponent } from '../../select/select-item.component';
import { ZardSelectComponent } from '../../select/select.component';
import { ZardCalendarComponent, type ZardCalendarVariants } from '../calendar.component';

@Component({
  standalone: true,
  imports: [ZardCalendarComponent, ZardSelectComponent, ZardSelectItemComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center gap-4">
        <label class="text-sm font-medium">Size:</label>
        <z-select [value]="selectedSize() || 'default'" [label]="sizeLabel()" (selectionChange)="onSizeChange($event)" class="min-w-[120px]">
          <z-select-item value="sm">Small</z-select-item>
          <z-select-item value="default">Default</z-select-item>
          <z-select-item value="lg">Large</z-select-item>
        </z-select>
      </div>

      <div class="flex justify-center">
        <z-calendar [zSize]="selectedSize()" (dateChange)="onDateChange($event)" />
      </div>
    </div>
  `,
})
export class ZardDemoCalendarSizesComponent {
  readonly selectedSize = signal<ZardCalendarVariants['zSize']>('default');

  readonly sizeLabel = computed(() => {
    switch (this.selectedSize()) {
      case 'sm':
        return 'Small';
      case 'lg':
        return 'Large';
      case 'default':
      default:
        return 'Default';
    }
  });

  onSizeChange(size: string) {
    const validSize = size as ZardCalendarVariants['zSize'];
    if (validSize === 'sm' || validSize === 'default' || validSize === 'lg') {
      this.selectedSize.set(validSize);
    }
  }

  onDateChange(date: Date) {
    console.log('Selected date:', date);
  }
}
