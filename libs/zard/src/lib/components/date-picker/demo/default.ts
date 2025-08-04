import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardDatePickerComponent } from '../date-picker.component';

@Component({
  selector: 'zard-demo-date-picker-default',
  standalone: true,
  imports: [ZardDatePickerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <z-date-picker [value]="selectedDate()" placeholder="Pick a date" (dateChange)="onDateChange($event)" /> `,
})
export class ZardDemoDatePickerDefaultComponent {
  selectedDate = signal<Date | null>(null);

  onDateChange(date: Date | null) {
    this.selectedDate.set(date);
    console.log('Selected date:', date);
  }
}
