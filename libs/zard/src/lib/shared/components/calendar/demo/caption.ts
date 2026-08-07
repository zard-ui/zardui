import { Component } from '@angular/core';

import { ZardCalendarComponent } from '../calendar.component';

@Component({
  selector: 'z-demo-calendar-caption',
  imports: [ZardCalendarComponent],
  standalone: true,
  template: `
    <z-calendar zMode="single" zCaptionLayout="dropdown" class="rounded-lg border" />
  `,
})
export class ZardDemoCalendarCaptionComponent {}
