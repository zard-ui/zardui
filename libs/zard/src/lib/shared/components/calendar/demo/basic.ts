import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCalendarComponent } from '../calendar.component';

@Component({
  selector: 'z-demo-calendar-basic',
  imports: [ZardCalendarComponent],
  template: `
    <z-calendar zMode="single" class="rounded-lg border" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCalendarBasicComponent {}
