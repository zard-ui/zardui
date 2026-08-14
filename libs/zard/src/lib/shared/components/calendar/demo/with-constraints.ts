import { Component } from '@angular/core';

import { ZardCalendarComponent } from '../calendar.component';

const DAYS_IN_FUTURE = 30;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

@Component({
  selector: 'z-demo-calendar-with-constraints',
  imports: [ZardCalendarComponent],
  standalone: true,
  template: `
    <div class="flex flex-wrap items-start justify-center gap-6">
      <z-calendar zMode="single" class="rounded-lg border" [minDate]="minDate" [maxDate]="maxDate" />

      <z-calendar zMode="single" class="rounded-lg border" [disabled]="true" />
    </div>
  `,
})
export class ZardDemoCalendarWithConstraintsComponent {
  readonly minDate = new Date();
  readonly maxDate = new Date(Date.now() + DAYS_IN_FUTURE * MILLISECONDS_PER_DAY);

  constructor() {
    this.minDate.setHours(0, 0, 0, 0);
    this.maxDate.setHours(23, 59, 59, 999);
  }
}
