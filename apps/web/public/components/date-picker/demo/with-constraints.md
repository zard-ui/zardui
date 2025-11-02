```angular-ts showLineNumbers
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardDatePickerComponent } from '../date-picker.component';

@Component({
  selector: 'zard-demo-date-picker-with-constraints',
  standalone: true,
  imports: [ZardDatePickerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-4">
      <div class="space-y-2">
        <h4 class="text-sm font-medium">Date Range Constraints</h4>
        <p class="text-sm text-muted-foreground">Selectable dates are limited to the next 30 days</p>
        <z-date-picker [value]="selectedDateRange()" placeholder="Pick a date within range" [minDate]="minDate()" [maxDate]="maxDate()" (dateChange)="onDateChangeRange($event)" />
      </div>

      <div class="space-y-2">
        <h4 class="text-sm font-medium">Disabled</h4>
        <z-date-picker placeholder="Disabled date picker" [disabled]="true" />
      </div>

      <div class="space-y-2">
        <h4 class="text-sm font-medium">With Initial Value</h4>
        <z-date-picker [value]="selectedDateInitial()" placeholder="Pick a date" (dateChange)="onDateChangeInitial($event)" />
      </div>
    </div>
  `,
})
export class ZardDemoDatePickerWithConstraintsComponent {
  readonly minDate = signal(new Date());
  readonly maxDate = signal(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // 30 days from now

  selectedDateRange = signal<Date | null>(null);
  selectedDateInitial = signal<Date | null>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // 7 days from now

  onDateChangeRange(date: Date | null) {
    this.selectedDateRange.set(date);
    console.log('Selected date (range):', date);
  }

  onDateChangeInitial(date: Date | null) {
    this.selectedDateInitial.set(date);
    console.log('Selected date (initial):', date);
  }
}

```
