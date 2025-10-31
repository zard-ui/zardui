```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardCalendarComponent } from '../calendar.component';

@Component({
  selector: 'z-demo-calendar-default',
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