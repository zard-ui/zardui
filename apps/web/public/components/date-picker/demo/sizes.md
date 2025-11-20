```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardDatePickerComponent } from '../date-picker.component';

@Component({
  selector: 'zard-demo-date-picker-sizes',
  imports: [ZardDatePickerComponent],
  standalone: true,
  template: `
    <div class="flex flex-col gap-4">
      <div class="space-y-2">
        <h4 class="text-sm font-medium">Small</h4>
        <z-date-picker
          zSize="sm"
          [value]="selectedDateSm()"
          placeholder="Pick a date"
          (dateChange)="onDateChangeSm($event)"
        />
      </div>

      <div class="space-y-2">
        <h4 class="text-sm font-medium">Default</h4>
        <z-date-picker
          zSize="default"
          [value]="selectedDateDefault()"
          placeholder="Pick a date"
          (dateChange)="onDateChangeDefault($event)"
        />
      </div>

      <div class="space-y-2">
        <h4 class="text-sm font-medium">Large</h4>
        <z-date-picker
          zSize="lg"
          [value]="selectedDateLg()"
          placeholder="Pick a date"
          (dateChange)="onDateChangeLg($event)"
        />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDatePickerSizesComponent {
  readonly selectedDateSm = signal<Date | null>(null);
  readonly selectedDateDefault = signal<Date | null>(null);
  readonly selectedDateLg = signal<Date | null>(null);

  onDateChangeSm(date: Date | null) {
    this.selectedDateSm.set(date);
    console.log('Selected date (sm):', date);
  }

  onDateChangeDefault(date: Date | null) {
    this.selectedDateDefault.set(date);
    console.log('Selected date (default):', date);
  }

  onDateChangeLg(date: Date | null) {
    this.selectedDateLg.set(date);
    console.log('Selected date (lg):', date);
  }
}

```