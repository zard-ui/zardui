import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { CalendarValue } from '@/shared/components/calendar/calendar.types';

import { ZardDatePickerComponent } from '../date-picker.component';

@Component({
  selector: 'z-demo-date-picker-preview',
  imports: [ZardDatePickerComponent],
  standalone: true,
  template: `
    <z-date-picker class="mx-auto" [(value)]="selectedDate" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDatePickerPreviewComponent {
  readonly selectedDate = signal<CalendarValue>(null);
}
