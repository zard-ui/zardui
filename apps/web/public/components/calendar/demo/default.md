```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardCalendarComponent } from '../calendar.component';

@Component({
  standalone: true,
  imports: [ZardCalendarComponent],
  template: ` <z-calendar (dateChange)="onDateChange($event)" /> `,
})
export class ZardDemoCalendarDefaultComponent {
  onDateChange(date: Date | Date[]) {
    console.log('Selected date:', date);
  }
}

```