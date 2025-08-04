import { ChangeDetectionStrategy, Component, computed, input, output, signal, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { ZardButtonComponent } from '../button/button.component';
import { ZardSelectItemComponent } from '../select/select-item.component';
import { ZardSelectComponent } from '../select/select.component';
import { calendarDayButtonVariants, calendarDayVariants, calendarNavVariants, calendarVariants, calendarWeekdayVariants, ZardCalendarVariants } from './calendar.variants';

import type { ClassValue } from '../../shared/utils/utils';

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

export type { ZardCalendarVariants };

@Component({
  selector: 'z-calendar, [z-calendar]',
  exportAs: 'zCalendar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ZardButtonComponent, ZardSelectComponent, ZardSelectItemComponent],
  host: {},
  template: `
    <div [class]="classes()">
      <!-- Navigation Header -->
      <div [class]="navClasses()">
        <button
          z-button
          zType="ghost"
          [zSize]="navButtonSize()"
          (click)="previousMonth()"
          [disabled]="isPreviousDisabled()"
          aria-label="Previous month"
          [class]="navButtonClasses()"
        >
          <i class="icon-chevron-left w-4 h-4"></i>
        </button>

        <!-- Month and Year Selectors -->
        <div class="flex items-center space-x-2">
          <!-- Month Select -->
          <z-select [size]="selectSize()" class="min-w-[120px]" [value]="currentMonthValue()" [label]="getCurrentMonthName()" (selectionChange)="onMonthChange($event)">
            @for (month of months; track $index) {
              <z-select-item [value]="$index.toString()">{{ month }}</z-select-item>
            }
          </z-select>

          <!-- Year Select -->
          <z-select [size]="selectSize()" class="min-w-[80px]" [value]="currentYearValue()" [label]="getCurrentYear().toString()" (selectionChange)="onYearChange($event)">
            @for (year of availableYears(); track year) {
              <z-select-item [value]="year.toString()">{{ year }}</z-select-item>
            }
          </z-select>
        </div>

        <button z-button zType="ghost" [zSize]="navButtonSize()" (click)="nextMonth()" [disabled]="isNextDisabled()" aria-label="Next month" [class]="navButtonClasses()">
          <i class="icon-chevron-right w-4 h-4"></i>
        </button>
      </div>

      <!-- Weekdays Header -->
      <div class="grid grid-cols-7 text-center">
        @for (weekday of weekdays; track $index) {
          <div [class]="weekdayClasses()">
            {{ weekday }}
          </div>
        }
      </div>

      <!-- Calendar Days Grid -->
      <div class="grid grid-cols-7 gap-0 mt-2">
        @for (day of calendarDays(); track day.date.getTime()) {
          <div [class]="dayContainerClasses()">
            <button
              [class]="dayButtonClasses(day)"
              (click)="selectDate(day.date)"
              [disabled]="day.isDisabled"
              [attr.aria-selected]="day.isSelected"
              [attr.aria-label]="getDayAriaLabel(day)"
            >
              {{ day.date.getDate() }}
            </button>
          </div>
        }
      </div>
    </div>
  `,
})
export class ZardCalendarComponent {
  readonly class = input<ClassValue>('');
  readonly zSize = input<ZardCalendarVariants['zSize']>('default');
  readonly value = input<Date | null>(null);
  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);
  readonly disabled = input<boolean>(false);

  readonly dateChange = output<Date>();

  private readonly currentDate = signal(new Date());
  private readonly selectedDate = signal<Date | null>(new Date());

  readonly weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  readonly months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  protected readonly classes = computed(() =>
    mergeClasses(
      calendarVariants({
        zSize: this.zSize(),
      }),
      this.class(),
    ),
  );

  protected readonly navClasses = computed(() => mergeClasses(calendarNavVariants()));

  protected readonly weekdayClasses = computed(() => mergeClasses(calendarWeekdayVariants({ zSize: this.zSize() })));

  protected readonly dayContainerClasses = computed(() => mergeClasses(calendarDayVariants({ zSize: this.zSize() })));

  protected readonly selectSize = computed(() => {
    const size = this.zSize();
    if (size === 'lg') return 'lg';
    if (size === 'sm') return 'sm';
    return 'default';
  });

  protected readonly navButtonSize = computed(() => {
    const size = this.zSize();
    if (size === 'lg') return 'default';
    return 'sm';
  });

  protected readonly navButtonClasses = computed(() => {
    const size = this.zSize();
    const baseClasses = 'p-0 opacity-50 hover:opacity-100';

    switch (size) {
      case 'sm':
        return `h-6 w-6 ${baseClasses}`;
      case 'lg':
        return `h-8 w-8 ${baseClasses}`;
      default:
        return `h-7 w-7 ${baseClasses}`;
    }
  });

  protected readonly currentMonthValue = computed(() => this.currentDate().getMonth().toString());
  protected readonly currentYearValue = computed(() => this.currentDate().getFullYear().toString());

  protected readonly availableYears = computed(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  });

  protected readonly currentMonthYear = computed(() => {
    const date = this.currentDate();
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  });

  protected getCurrentMonthName(): string {
    return this.months[this.currentDate().getMonth()];
  }

  protected getCurrentYear(): number {
    return this.currentDate().getFullYear();
  }

  protected onMonthChange(monthIndex: string): void {
    if (!monthIndex || monthIndex.trim() === '') {
      console.warn('Invalid month index received:', monthIndex);
      return;
    }

    const parsedMonth = parseInt(monthIndex, 10);
    if (isNaN(parsedMonth) || parsedMonth < 0 || parsedMonth > 11) {
      console.warn('Invalid month value:', monthIndex, 'parsed as:', parsedMonth);
      return;
    }

    const current = this.currentDate();
    const newDate = new Date(current.getFullYear(), parsedMonth, 1);
    this.currentDate.set(newDate);
  }

  protected onYearChange(year: string): void {
    if (!year || year.trim() === '') {
      console.warn('Invalid year received:', year);
      return;
    }

    const parsedYear = parseInt(year, 10);
    if (isNaN(parsedYear) || parsedYear < 1900 || parsedYear > 2100) {
      console.warn('Invalid year value:', year, 'parsed as:', parsedYear);
      return;
    }

    const current = this.currentDate();
    const newDate = new Date(parsedYear, current.getMonth(), 1);
    this.currentDate.set(newDate);
  }

  protected readonly calendarDays = computed(() => {
    const currentDate = this.currentDate();
    const selectedDate = this.value() || this.selectedDate();
    const today = new Date();
    const minDate = this.minDate();
    const maxDate = this.maxDate();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get first day of the month
    const firstDay = new Date(year, month, 1);
    // Get last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Get the first day of the week for the first day of the month
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    // Get the last day of the week for the last day of the month
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const days: CalendarDay[] = [];
    const currentWeekDate = new Date(startDate);

    while (currentWeekDate <= endDate) {
      const date = new Date(currentWeekDate);
      const isCurrentMonth = date.getMonth() === month;
      const isToday = this.isSameDay(date, today);
      const isSelected = selectedDate ? this.isSameDay(date, selectedDate) : false;
      const isDisabled = this.disabled() || this.isDateDisabled(date, minDate, maxDate);

      days.push({
        date,
        isCurrentMonth,
        isToday,
        isSelected,
        isDisabled,
      });

      currentWeekDate.setDate(currentWeekDate.getDate() + 1);
    }

    return days;
  });

  protected dayButtonClasses(day: CalendarDay): string {
    return mergeClasses(
      calendarDayButtonVariants({
        zSize: this.zSize(),
        selected: day.isSelected,
        today: day.isToday,
        outside: !day.isCurrentMonth,
        disabled: day.isDisabled,
      }),
    );
  }

  protected previousMonth() {
    const current = this.currentDate();
    const previous = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    this.currentDate.set(previous);
  }

  protected nextMonth() {
    const current = this.currentDate();
    const next = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    this.currentDate.set(next);
  }

  protected isPreviousDisabled(): boolean {
    if (this.disabled()) return true;

    const minDate = this.minDate();
    if (!minDate) return false;

    const current = this.currentDate();
    const lastDayOfPreviousMonth = new Date(current.getFullYear(), current.getMonth(), 0);

    return lastDayOfPreviousMonth < minDate;
  }

  protected isNextDisabled(): boolean {
    if (this.disabled()) return true;

    const maxDate = this.maxDate();
    if (!maxDate) return false;

    const current = this.currentDate();
    const nextMonth = new Date(current.getFullYear(), current.getMonth() + 1, 1);

    return nextMonth > maxDate;
  }

  selectDate(date: Date) {
    if (this.disabled()) return;

    const minDate = this.minDate();
    const maxDate = this.maxDate();

    if (this.isDateDisabled(date, minDate, maxDate)) return;

    this.selectedDate.set(date);
    this.dateChange.emit(date);
  }

  protected getDayAriaLabel(day: CalendarDay): string {
    const dateStr = day.date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const labels = [dateStr];

    if (day.isToday) labels.push('Today');
    if (day.isSelected) labels.push('Selected');
    if (!day.isCurrentMonth) labels.push('Outside month');
    if (day.isDisabled) labels.push('Disabled');

    return labels.join(', ');
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
  }

  private isDateDisabled(date: Date, minDate: Date | null, maxDate: Date | null): boolean {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  }
}
