```angular-ts showLineNumbers copyButton
import { Component, signal } from '@angular/core';

import { ZardCalendarComponent } from '../calendar.component';

@Component({
  selector: 'z-demo-calendar-multiple',
  standalone: true,
  imports: [ZardCalendarComponent],
  template: `
    <div class="space-y-4">
      <z-calendar zMode="multiple" [(value)]="selectedDates" (dateChange)="onDateChange($event)" />

      <div class="text-sm text-muted-foreground mt-2">
        <p class="font-medium">Selected ({{ selectedDates()?.length ?? 0 }}) date(s).</p>
      </div>
    </div>
  `,
})
export class ZardDemoCalendarMultipleComponent {
  selectedDates = signal<Date[] | null>(null);

  onDateChange(dates: Date | Date[]) {
    console.log('Selected dates:', dates);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  }
}

```