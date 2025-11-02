```angular-ts showLineNumbers
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardDatePickerComponent } from '../date-picker.component';

@Component({
  selector: 'zard-demo-date-picker-variants',
  standalone: true,
  imports: [ZardDatePickerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-4">
      <div class="space-y-2">
        <h4 class="text-sm font-medium">Default</h4>
        <z-date-picker zType="default" [value]="selectedDateDefault()" placeholder="Pick a date" (dateChange)="onDateChangeDefault($event)" />
      </div>

      <div class="space-y-2">
        <h4 class="text-sm font-medium">Outline</h4>
        <z-date-picker zType="outline" [value]="selectedDateOutline()" placeholder="Pick a date" (dateChange)="onDateChangeOutline($event)" />
      </div>

      <div class="space-y-2">
        <h4 class="text-sm font-medium">Ghost</h4>
        <z-date-picker zType="ghost" [value]="selectedDateGhost()" placeholder="Pick a date" (dateChange)="onDateChangeGhost($event)" />
      </div>
    </div>
  `,
})
export class ZardDemoDatePickerVariantsComponent {
  selectedDateDefault = signal<Date | null>(null);
  selectedDateOutline = signal<Date | null>(null);
  selectedDateGhost = signal<Date | null>(null);

  onDateChangeDefault(date: Date | null) {
    this.selectedDateDefault.set(date);
    console.log('Selected date (default):', date);
  }

  onDateChangeOutline(date: Date | null) {
    this.selectedDateOutline.set(date);
    console.log('Selected date (outline):', date);
  }

  onDateChangeGhost(date: Date | null) {
    this.selectedDateGhost.set(date);
    console.log('Selected date (ghost):', date);
  }
}

```
