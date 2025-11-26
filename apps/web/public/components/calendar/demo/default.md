```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardCalendarComponent } from '@ngzard/ui/calendar';

@Component({
  selector: 'z-demo-calendar-default',
  imports: [ZardCalendarComponent],
  standalone: true,
  template: `
    <z-calendar (dateChange)="onDateChange($event)" />
  `,
})
export class ZardDemoCalendarDefaultComponent {
  onDateChange(date: Date | Date[]) {
    console.log('Selected date:', date);
  }
}

```