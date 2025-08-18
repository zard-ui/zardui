```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardCalendarComponent } from '../calendar.component';

const DAYS_IN_FUTURE = 30;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

@Component({
  standalone: true,
  imports: [ZardCalendarComponent],
  template: `
    <div class="space-y-8">
      <div>
        <h3 class="text-sm font-medium mb-3">With Min/Max Date</h3>
        <z-calendar [minDate]="minDate" [maxDate]="maxDate" (dateChange)="onDateChange($event)" />
        <p class="text-sm text-muted-foreground mt-2">Available dates: {{ minDate.toLocaleDateString() }} - {{ maxDate.toLocaleDateString() }}</p>
      </div>

      <div>
        <h3 class="text-sm font-medium mb-3">Disabled</h3>
        <z-calendar [disabled]="true" />
      </div>
    </div>
  `,
})
export class ZardDemoCalendarWithConstraintsComponent {
  minDate = new Date();
  maxDate = new Date(Date.now() + DAYS_IN_FUTURE * MILLISECONDS_PER_DAY);

  constructor() {
    // Set min date to today
    this.minDate.setHours(0, 0, 0, 0);

    // Set max date to 30 days from now
    this.maxDate.setHours(23, 59, 59, 999);
  }

  onDateChange(date: Date) {
    console.log('Selected date:', date);
  }
}

```