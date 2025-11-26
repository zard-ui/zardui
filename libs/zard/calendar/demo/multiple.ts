import { Component, signal } from '@angular/core';

import { ZardCalendarComponent } from '@ngzard/ui/calendar';

@Component({
  selector: 'z-demo-calendar-multiple',
  imports: [ZardCalendarComponent],
  standalone: true,
  template: `
    <div class="space-y-4">
      <z-calendar zMode="multiple" [(value)]="selectedDates" (dateChange)="onDateChange($event)" />

      <div class="text-muted-foreground mt-2 text-sm">
        <p class="font-medium">Selected ({{ selectedDates()?.length ?? 0 }}) date(s).</p>
      </div>
    </div>
  `,
})
export class ZardDemoCalendarMultipleComponent {
  readonly selectedDates = signal<Date[] | null>(null);

  onDateChange(dates: Date | Date[]) {
    console.log('Selected dates:', dates);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  }
}
