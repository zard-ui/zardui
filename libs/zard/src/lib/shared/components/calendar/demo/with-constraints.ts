import { Component } from '@angular/core';

import { ZardCalendarComponent } from '../calendar.component';

const DAYS_IN_FUTURE = 30;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

@Component({
  selector: 'z-demo-calendar-with-constraints',
  imports: [ZardCalendarComponent],
  standalone: true,
  template: `
    <div class="flex flex-wrap items-start gap-8">
      <div class="flex flex-col gap-3">
        <h3 class="text-sm font-medium">With Min/Max Date</h3>
        <z-calendar zMode="single" class="rounded-lg border" [minDate]="minDate" [maxDate]="maxDate" />
        <p class="text-muted-foreground text-sm">
          Available dates: {{ minDate.toLocaleDateString() }} - {{ maxDate.toLocaleDateString() }}
        </p>
      </div>

      <div class="flex flex-col gap-3">
        <h3 class="text-sm font-medium">Disabled</h3>
        <z-calendar zMode="single" class="rounded-lg border" [disabled]="true" />
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
}
