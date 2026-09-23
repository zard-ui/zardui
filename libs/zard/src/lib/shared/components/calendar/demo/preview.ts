import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardCalendarComponent } from '../calendar.component';

@Component({
  selector: 'z-demo-calendar-preview',
  imports: [ZardCalendarComponent],
  template: `
    <z-calendar zMode="single" zCaptionLayout="dropdown" class="rounded-lg border" [(value)]="selectedDate" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCalendarPreviewComponent {
  readonly selectedDate = signal<Date | null>(new Date());
}
