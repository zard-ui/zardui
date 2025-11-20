import { Component, signal } from '@angular/core';

import { ZardCalendarComponent } from '../calendar.component';

@Component({
  selector: 'z-demo-calendar-range',
  imports: [ZardCalendarComponent],
  standalone: true,
  template: `
    <div class="space-y-4">
      <z-calendar zMode="range" [(value)]="dateRange" (dateChange)="onDateChange($event)" />

      <div class="bg-muted/50 mt-4 rounded-lg border p-4">
        <div class="space-y-1 text-sm">
          <div class="flex items-center gap-2">
            <span class="text-muted-foreground min-w-12">From:</span>
            <span class="font-medium">{{ formatDate(dateRange(), 'start') }}</span>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-muted-foreground min-w-12">To:</span>
            <span class="font-medium">{{ formatDate(dateRange(), 'end') }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ZardDemoCalendarRangeComponent {
  readonly dateRange = signal<Date[] | null>(null);

  onDateChange(dates: Date | Date[]) {
    console.log('Selected range:', dates);
  }

  formatDate(date?: Date[] | null, label: 'start' | 'end' = 'start'): string {
    if (!date || date?.length === 0) {
      return 'N/A';
    }

    const targetDate = label === 'start' ? date[0] : date[1];
    if (!targetDate) {
      return 'N/A';
    }

    return targetDate.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
