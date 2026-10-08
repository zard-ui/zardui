import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';

import { ZardCalendarComponent } from '../calendar.component';

const RANGE_LENGTH_IN_DAYS = 10;

/** December 8 of the current year; the calendar opens on the month of the range start. */
function startOfRange(): Date {
  return new Date(new Date().getFullYear(), 11, 8);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function isWeekend(date: Date): boolean {
  return date.getDay() === 0 || date.getDay() === 6;
}

@Component({
  selector: 'z-demo-calendar-custom-cell-size',
  imports: [ZardCalendarComponent, ZardCardImports],
  template: `
    <z-card class="mx-auto w-fit p-0">
      <z-card-content class="p-0">
        <z-calendar
          zMode="range"
          zCaptionLayout="dropdown"
          class="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
          [zDayTemplate]="day"
          [(value)]="dateRange"
        />
      </z-card-content>
    </z-card>

    <ng-template #day let-day>
      {{ day.date.getDate() }}
      @if (day.isCurrentMonth) {
        <span>{{ isWeekend(day.date) ? '$120' : '$100' }}</span>
      }
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCalendarCustomCellSizeComponent {
  readonly dateRange = signal<Date[] | null>([startOfRange(), addDays(startOfRange(), RANGE_LENGTH_IN_DAYS)]);

  protected readonly isWeekend = isWeekend;
}
