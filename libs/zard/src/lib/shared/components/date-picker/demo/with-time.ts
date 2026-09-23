import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { CalendarValue } from '@/shared/components/calendar/calendar.types';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

import { ZardDatePickerComponent } from '../date-picker.component';

@Component({
  selector: 'z-demo-date-picker-with-time',
  imports: [ZardDatePickerComponent, ZardFieldImports, ZardInputComponent],
  template: `
    <!-- A fixed width, not max-w-*: the field group is w-full, so it has nothing to resolve against. -->
    <div z-field-group class="mx-auto w-xs flex-row">
      <!-- The width goes on the field: it forces w-full onto whatever it wraps. -->
      <div z-field class="w-40">
        <label z-field-label for="date-picker-with-time">Date</label>
        <z-date-picker
          zId="date-picker-with-time"
          zCaptionLayout="dropdown"
          zPlaceholder="Select date"
          zFormat="MMM d, yyyy"
          [(value)]="selectedDate"
        />
      </div>

      <div z-field class="w-32">
        <label z-field-label for="date-picker-time">Time</label>
        <input
          z-input
          id="date-picker-time"
          type="time"
          step="1"
          value="10:30:00"
          class="appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
        />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDatePickerWithTimeComponent {
  readonly selectedDate = signal<CalendarValue>(null);
}
