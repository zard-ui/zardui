import { Component, signal } from '@angular/core';

import { ZardCalendarComponent } from '../calendar.component';

const RANGE_LENGTH_IN_DAYS = 30;

function startOfRange(): Date {
  return new Date(new Date().getFullYear(), 0, 12);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

@Component({
  selector: 'z-demo-calendar-range',
  imports: [ZardCalendarComponent],
  standalone: true,
  template: `
    <z-calendar zMode="range" zNumberOfMonths="2" class="rounded-lg border" [(value)]="dateRange" />
  `,
})
export class ZardDemoCalendarRangeComponent {
  readonly dateRange = signal<Date[] | null>([startOfRange(), addDays(startOfRange(), RANGE_LENGTH_IN_DAYS)]);
}
