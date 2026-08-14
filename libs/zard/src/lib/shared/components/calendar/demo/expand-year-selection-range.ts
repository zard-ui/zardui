import { Component, signal } from '@angular/core';

import { ZardCalendarComponent } from '../calendar.component';

const BIRTH_YEAR_FLOOR = 1950;

@Component({
  selector: 'z-demo-calendar-expand-year-selection-range',
  imports: [ZardCalendarComponent],
  standalone: true,
  template: `
    <z-calendar
      zMode="single"
      zCaptionLayout="dropdown"
      class="rounded-lg border"
      [minDate]="minDate"
      [maxDate]="maxDate"
      [(value)]="dateOfBirth"
    />
  `,
})
export class ZardDemoCalendarExpandYearSelectionRangeComponent {
  readonly minDate = new Date(BIRTH_YEAR_FLOOR, 0, 1);
  readonly maxDate = new Date();
  readonly dateOfBirth = signal<Date | null>(null);
}
