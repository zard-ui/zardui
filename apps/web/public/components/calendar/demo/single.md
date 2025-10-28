```angular-ts showLineNumbers copyButton
import { Component, signal } from '@angular/core';

import { ZardCalendarComponent } from '../calendar.component';

@Component({
  standalone: true,
  imports: [ZardCalendarComponent],
  template: `
    <div class="space-y-4">
      <z-calendar zMode="single" [(value)]="selectedDate" (dateChange)="onDateChange($event)" />
      @if (selectedDate()) {
        <p class="text-sm text-muted-foreground">Selected date: {{ formatDate(selectedDate()!) }}</p>
      }
    </div>
  `,
})
export class ZardDemoCalendarSingleComponent {
  selectedDate = signal<Date | null>(null);

  onDateChange(date: Date | Date[]) {
    console.log('Selected date:', date);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
}

```