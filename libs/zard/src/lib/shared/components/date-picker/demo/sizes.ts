import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { CalendarValue } from '@/shared/components/calendar/calendar.types';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

import { ZardDatePickerComponent } from '../date-picker.component';

@Component({
  selector: 'z-demo-date-picker-sizes',
  imports: [ZardDatePickerComponent, ZardFieldImports],
  standalone: true,
  template: `
    <div z-field-group class="mx-auto w-60">
      <div z-field>
        <label z-field-label for="date-picker-size-xs">Extra small</label>
        <z-date-picker zId="date-picker-size-xs" zSize="xs" [(value)]="selectedDate" />
      </div>

      <div z-field>
        <label z-field-label for="date-picker-size-sm">Small</label>
        <z-date-picker zId="date-picker-size-sm" zSize="sm" [(value)]="selectedDate" />
      </div>

      <div z-field>
        <label z-field-label for="date-picker-size-default">Default</label>
        <z-date-picker zId="date-picker-size-default" [(value)]="selectedDate" />
      </div>

      <div z-field>
        <label z-field-label for="date-picker-size-lg">Large</label>
        <z-date-picker zId="date-picker-size-lg" zSize="lg" [(value)]="selectedDate" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDatePickerSizesComponent {
  readonly selectedDate = signal<CalendarValue>(new Date());
}
