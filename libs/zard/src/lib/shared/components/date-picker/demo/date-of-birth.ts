import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { CalendarValue } from '@/shared/components/calendar/calendar.types';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

import { ZardDatePickerComponent } from '../date-picker.component';

@Component({
  selector: 'z-demo-date-picker-date-of-birth',
  imports: [ZardDatePickerComponent, ZardFieldImports],
  template: `
    <div z-field class="mx-auto w-44">
      <label z-field-label for="date-picker-date-of-birth">Date of birth</label>
      <z-date-picker
        zId="date-picker-date-of-birth"
        zIcon="none"
        zCaptionLayout="dropdown"
        zPlaceholder="Select date"
        [minDate]="minDate"
        [maxDate]="maxDate"
        [(value)]="selectedDate"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDatePickerDateOfBirthComponent {
  readonly selectedDate = signal<CalendarValue>(null);

  /** The bounds are what widen the year dropdown — without them it spans today ± 10 years. */
  readonly minDate = new Date(1900, 0, 1);
  readonly maxDate = new Date();
}
