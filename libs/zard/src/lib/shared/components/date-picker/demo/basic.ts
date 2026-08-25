import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { CalendarValue } from '@/shared/components/calendar/calendar.types';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

import { ZardDatePickerComponent } from '../date-picker.component';

@Component({
  selector: 'z-demo-date-picker-basic',
  imports: [ZardDatePickerComponent, ZardFieldImports],
  template: `
    <div z-field class="mx-auto w-44">
      <label z-field-label for="date-picker-basic">Date</label>
      <z-date-picker zId="date-picker-basic" zIcon="none" [(value)]="selectedDate" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDatePickerBasicComponent {
  readonly selectedDate = signal<CalendarValue>(null);
}
