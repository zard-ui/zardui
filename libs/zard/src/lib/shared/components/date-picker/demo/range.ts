import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { CalendarValue } from '@/shared/components/calendar/calendar.types';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

import { ZardDatePickerComponent } from '../date-picker.component';

const currentYear = new Date().getFullYear();

@Component({
  selector: 'z-demo-date-picker-range',
  imports: [ZardDatePickerComponent, ZardFieldImports],
  standalone: true,
  template: `
    <div z-field class="mx-auto w-60">
      <label z-field-label for="date-picker-range">Date range</label>
      <z-date-picker
        zId="date-picker-range"
        zMode="range"
        zIcon="calendar"
        zFormat="MMM dd, y"
        [zNumberOfMonths]="2"
        [(value)]="selectedRange"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDatePickerRangeComponent {
  readonly selectedRange = signal<CalendarValue>([new Date(currentYear, 0, 20), new Date(currentYear, 1, 9)]);
}
