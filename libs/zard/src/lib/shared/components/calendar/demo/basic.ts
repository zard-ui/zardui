import { Component } from '@angular/core';

import { ZardCalendarComponent } from '../calendar.component';

@Component({
  selector: 'z-demo-calendar-basic',
  imports: [ZardCalendarComponent],
  standalone: true,
  template: `
    <z-calendar zMode="single" class="rounded-lg border" />
  `,
})
export class ZardDemoCalendarBasicComponent {}
