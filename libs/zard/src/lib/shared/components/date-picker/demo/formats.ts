import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { CalendarValue } from '@/shared/components/calendar/calendar.types';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

import { ZardDatePickerComponent } from '../date-picker.component';

@Component({
  selector: 'z-demo-date-picker-formats',
  imports: [ZardDatePickerComponent, ZardFieldImports],
  standalone: true,
  template: `
    <div z-field-group class="mx-auto w-60">
      <div z-field>
        <label z-field-label for="date-picker-format-default">MMMM d, yyyy</label>
        <z-date-picker zId="date-picker-format-default" [(value)]="selectedDate" />
      </div>

      <div z-field>
        <label z-field-label for="date-picker-format-us">MM/dd/yyyy</label>
        <z-date-picker zId="date-picker-format-us" zFormat="MM/dd/yyyy" [(value)]="selectedDate" />
      </div>

      <div z-field>
        <label z-field-label for="date-picker-format-iso">yyyy-MM-dd</label>
        <z-date-picker zId="date-picker-format-iso" zFormat="yyyy-MM-dd" [(value)]="selectedDate" />
      </div>

      <div z-field>
        <label z-field-label for="date-picker-format-day-name">EEE, MMMM d</label>
        <z-date-picker zId="date-picker-format-day-name" zFormat="EEE, MMMM d" [(value)]="selectedDate" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDatePickerFormatsComponent {
  /** Shared on purpose — every picker shows the same date under a different format. */
  readonly selectedDate = signal<CalendarValue>(new Date());
}
