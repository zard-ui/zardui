import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardDatePickerComponent } from '@ngzard/ui/date-picker';

@Component({
  selector: 'zard-demo-date-picker-default',
  imports: [ZardDatePickerComponent],
  standalone: true,
  template: `
    <z-date-picker [value]="selectedDate()" placeholder="Pick a date" (dateChange)="onDateChange($event)" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDatePickerDefaultComponent {
  readonly selectedDate = signal<Date | null>(null);

  onDateChange(date: Date | null) {
    this.selectedDate.set(date);
    console.log('Selected date:', date);
  }
}
