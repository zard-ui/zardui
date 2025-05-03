import { Component } from '@angular/core';

import { CalendarComponent } from '../calendar.component';

@Component({
  standalone: true,
  imports: [CalendarComponent],
  template: ` <z-calendar [defaultView]="'month'" [config]="{ firstDayOfWeek: 1, locale: 'en-US' }" (dateSelected)="onDateSelected($event)"></z-calendar> `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
})
export class ZardDemoCalendarDefaultComponent {
  onDateSelected(dates: Date[]): void {
    console.log('Selected dates:', dates);
  }
}
