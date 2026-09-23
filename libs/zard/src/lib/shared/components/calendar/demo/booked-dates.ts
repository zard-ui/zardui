import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardCalendarComponent } from '../calendar.component';

const FIRST_BOOKED_DAY = 8;
const BOOKED_DAYS_COUNT = 12;

function bookedDatesOfCurrentMonth(): Date[] {
  const today = new Date();

  return Array.from(
    { length: BOOKED_DAYS_COUNT },
    (_, index) => new Date(today.getFullYear(), today.getMonth(), FIRST_BOOKED_DAY + index),
  );
}

@Component({
  selector: 'z-demo-calendar-booked-dates',
  imports: [ZardCalendarComponent],
  template: `
    <z-calendar
      zMode="single"
      class="rounded-lg border shadow-sm [&_[data-disabled=true]_button]:line-through [&_[data-disabled=true]_button]:opacity-100"
      [zDisabledDates]="bookedDates"
      [(value)]="selectedDate"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCalendarBookedDatesComponent {
  readonly bookedDates = bookedDatesOfCurrentMonth();
  readonly selectedDate = signal<Date | null>(null);
}
