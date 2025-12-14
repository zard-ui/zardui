import { Component } from '@angular/core';

import { ZardCalendarComponent } from '../calendar.component';

@Component({
  selector: 'z-demo-calendar-expand-year-selection-range',
  imports: [ZardCalendarComponent],
  standalone: true,
  template: `
    <div class="space-y-8">
      <div>
        <h3 class="mb-3 text-sm font-medium">Date of Birth</h3>
        <z-calendar [minDate]="minDate" [maxDate]="maxDate" (dateChange)="onDateChange($event)" />
      </div>
    </div>
  `,
})
export class ZardDemoCalendarExpandYearSelectionRangeComponent {
  minDate = new Date(1950, 1, 1);
  maxDate = new Date();

  onDateChange(date: Date | Date[]) {
    console.log('Selected date:', date);
  }
}
