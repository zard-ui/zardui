import { Component, signal } from '@angular/core';

import { ZardCalendarComponent } from '../calendar.component';

@Component({
  selector: 'z-demo-calendar-multiple',
  imports: [ZardCalendarComponent],
  standalone: true,
  template: `
    <div class="flex flex-col gap-4">
      <z-calendar zMode="multiple" class="rounded-lg border" [(value)]="selectedDates" />

      <p class="text-muted-foreground text-sm font-medium">Selected ({{ selectedDates()?.length ?? 0 }}) date(s).</p>
    </div>
  `,
})
export class ZardDemoCalendarMultipleComponent {
  readonly selectedDates = signal<Date[] | null>(null);
}
