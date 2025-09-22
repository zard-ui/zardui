```angular-ts title="calendar.component.ts" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, computed, ElementRef, input, linkedSignal, model, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { outputFromObservable, outputToObservable } from '@angular/core/rxjs-interop';

import { calendarDayButtonVariants, calendarDayVariants, calendarNavVariants, calendarVariants, calendarWeekdayVariants, ZardCalendarVariants } from './calendar.variants';
import { ZardSelectItemComponent } from '../select/select-item.component';
import { ZardSelectComponent } from '../select/select.component';
import { ZardButtonComponent } from '../button/button.component';
import type { ClassValue } from '../../shared/utils/utils';
import { mergeClasses } from '../../shared/utils/utils';
import { filter } from 'rxjs';

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  id?: string;
}

export type { ZardCalendarVariants };

@Component({
  selector: 'z-calendar, [z-calendar]',
  exportAs: 'zCalendar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ZardButtonComponent, ZardSelectComponent, ZardSelectItemComponent],
  host: {
    '(keydown)': 'onKeyDown($event)',
    '[attr.tabindex]': '0',
    '[attr.role]': '"grid"',
    '[attr.aria-label]': '"Calendar"',
  },
  template: `
    <div [class]="classes()" #calendarContainer>
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
          <i class="icon-chevron-left"></i>
        </button>

        <!-- Month and Year Selectors -->
        <div class="flex items-center space-x-2">
          <!-- Month Select -->
          <z-select [size]="selectSize()" class="min-w-[120px]" [value]="currentMonthValue()" [label]="currentMonthName()" (selectionChange)="onMonthChange($event)">
            @for (month of months; track $index) {
              <z-select-item [value]="$index.toString()">{{ month }}</z-select-item>
            }
          </z-select>

          <!-- Year Select -->
          <z-select [size]="selectSize()" class="min-w-[80px]" [value]="currentYearValue()" [label]="currentYearValue()" (selectionChange)="onYearChange($event)">
            @for (year of availableYears(); track year) {
              <z-select-item [value]="year.toString()">{{ year }}</z-select-item>
            }
          </z-select>
        </div>

        <button z-button zType="ghost" [zSize]="navButtonSize()" (click)="nextMonth()" [disabled]="isNextDisabled()" aria-label="Next month" [class]="navButtonClasses()">
          <i class="icon-chevron-right"></i>
        </button>
      </div>

      <!-- Weekdays Header -->
      <div class="grid grid-cols-7 text-center" role="row">
        @for (weekday of weekdays; track $index) {
          <div [class]="weekdayClasses()" role="columnheader">
            {{ weekday }}
          </div>
        }
      </div>

      <!-- Calendar Days Grid -->
      <div class="grid grid-cols-7 gap-0 mt-2" role="rowgroup">
        @for (day of calendarDays(); track day.date.getTime(); let i = $index) {
          <div [class]="dayContainerClasses()" role="gridcell">
            <button
              [id]="getDayId(i)"
              [class]="dayButtonClasses(day)"
              (click)="selectDate(day.date, i)"
              [disabled]="day.isDisabled"
              [attr.aria-selected]="day.isSelected"
              [attr.aria-label]="getDayAriaLabel(day)"
              [attr.tabindex]="getFocusedDayIndex() === i ? 0 : -1"
              role="button"
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
  private readonly calendarContainer = viewChild.required<ElementRef<HTMLElement>>('calendarContainer');

  // Public method to reset navigation (useful for date-picker)
  resetNavigation(): void {
    const value = this.currentDate();
    this.currentMonthValue.set(value.getMonth().toString());
    this.currentYearValue.set(value.getFullYear().toString());
    this.focusedDayIndex.set(-1);
  }
  readonly class = input<ClassValue>('');
  readonly zSize = input<ZardCalendarVariants['zSize']>('default');
  readonly value = model<Date | null>(null);
  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);
  readonly disabled = input<boolean>(false);

  readonly dateChange = outputFromObservable(outputToObservable(this.value).pipe(filter(v => v !== null)));

  private readonly focusedDayIndex = signal<number>(-1);

  private readonly currentDate = computed(() => this.value() ?? new Date(), {
    equal: (a, b) => a.getTime() === b.getTime(),
  });

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

  protected readonly currentMonthValue = linkedSignal(() => this.currentDate().getMonth().toString());
  protected readonly currentYearValue = linkedSignal(() => this.currentDate().getFullYear().toString());

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

  protected readonly currentMonthName = computed(() => {
    const selectedMonth = parseInt(this.currentMonthValue());
    if (!isNaN(selectedMonth) && this.months[selectedMonth]) return this.months[selectedMonth];
    return this.months[this.currentDate().getMonth()];
  });

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

    const currentDate = this.currentDate();
    const selectedYear = parseInt(this.currentYearValue());
    const newDate = new Date(isNaN(selectedYear) ? currentDate.getFullYear() : selectedYear, parsedMonth, 1);
    this.currentMonthValue.set(newDate.getMonth().toString());
    this.focusedDayIndex.set(-1);
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

    const currentDate = this.currentDate();
    const selectedMonth = parseInt(this.currentMonthValue());
    const newDate = new Date(parsedYear, isNaN(selectedMonth) ? currentDate.getMonth() : selectedMonth, 1);
    this.currentYearValue.set(newDate.getFullYear().toString());
    this.focusedDayIndex.set(-1);
  }

  protected readonly calendarDays = computed(() => {
    const currentDate = this.currentDate();
    const navigationDate = new Date(parseInt(this.currentYearValue()), parseInt(this.currentMonthValue()), currentDate.getDate());
    const selectedDate = isNaN(navigationDate.getTime()) ? currentDate : navigationDate;
    const today = new Date();
    const minDate = this.minDate();
    const maxDate = this.maxDate();

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

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
      const isSelected = currentDate ? this.isSameDay(date, currentDate) : false;
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
    const currentDate = this.currentDate();
    const currentMonth = parseInt(this.currentMonthValue());
    const previous = new Date(currentDate.getFullYear(), (isNaN(currentMonth) ? currentDate.getMonth() : currentMonth) - 1, 1);
    this.currentMonthValue.set(previous.getMonth().toString());
    this.focusedDayIndex.set(-1);
  }

  protected nextMonth() {
    const currentDate = this.currentDate();
    const currentMonth = parseInt(this.currentMonthValue());
    const next = new Date(currentDate.getFullYear(), (isNaN(currentMonth) ? currentDate.getMonth() : currentMonth) + 1, 1);
    this.currentMonthValue.set(next.getMonth().toString());
    this.focusedDayIndex.set(-1);
  }

  protected isPreviousDisabled(): boolean {
    if (this.disabled()) return true;

    const minDate = this.minDate();
    if (!minDate) return false;

    const currentDate = this.currentDate();
    const currentMonth = parseInt(this.currentMonthValue());
    const lastDayOfPreviousMonth = new Date(currentDate.getFullYear(), isNaN(currentMonth) ? currentDate.getMonth() : currentMonth, 0);

    return lastDayOfPreviousMonth.getTime() < minDate.getTime();
  }

  protected isNextDisabled(): boolean {
    if (this.disabled()) return true;

    const maxDate = this.maxDate();
    if (!maxDate) return false;

    const currentDate = this.currentDate();
    const currentMonth = parseInt(this.currentMonthValue());
    const nextMonth = new Date(currentDate.getFullYear(), (isNaN(currentMonth) ? currentDate.getMonth() : currentMonth) + 1, 1);

    return nextMonth.getTime() > maxDate.getTime();
  }

  selectDate(date: Date, i?: number) {
    if (this.disabled()) return;

    const minDate = this.minDate();
    const maxDate = this.maxDate();

    if (this.isDateDisabled(date, minDate, maxDate)) return;

    this.value.set(date);
    this.focusedDayIndex.set(i ?? this.calendarDays().findIndex(day => this.isSameDay(day.date, date)));
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

  protected getDayId(index: number): string {
    return `calendar-day-${index}`;
  }

  protected getFocusedDayIndex(): number {
    const focused = this.focusedDayIndex();
    if (focused >= 0) return focused;

    // Default focus to selected date or today
    const days = this.calendarDays();
    const selectedIndex = days.findIndex(day => day.isSelected);
    if (selectedIndex >= 0) return selectedIndex;

    const todayIndex = days.findIndex(day => day.isToday && day.isCurrentMonth);
    if (todayIndex >= 0) return todayIndex;

    // Fall back to first enabled day of current month
    const firstCurrentMonthIndex = days.findIndex(day => day.isCurrentMonth && !day.isDisabled);
    return firstCurrentMonthIndex >= 0 ? firstCurrentMonthIndex : 0;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled()) return;

    const days = this.calendarDays();
    if (days.length === 0) return;

    const currentIndex = this.getFocusedDayIndex();
    let newIndex: number | null = null;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = this.navigate(currentIndex, -1, days);
        break;
      case 'ArrowRight':
        event.preventDefault();
        newIndex = this.navigate(currentIndex, 1, days);
        break;
      case 'ArrowUp':
        event.preventDefault();
        newIndex = this.navigate(currentIndex, -7, days);
        break;
      case 'ArrowDown':
        event.preventDefault();
        newIndex = this.navigate(currentIndex, 7, days);
        break;
      case 'Home':
        event.preventDefault();
        newIndex = this.findEnabledInRange(Math.floor(currentIndex / 7) * 7, Math.floor(currentIndex / 7) * 7 + 6, days);
        break;
      case 'End':
        event.preventDefault();
        newIndex = this.findEnabledInRange(Math.floor(currentIndex / 7) * 7 + 6, Math.floor(currentIndex / 7) * 7, days, true);
        break;
      case 'PageUp':
        event.preventDefault();
        if (event.ctrlKey) {
          this.navigateYear(-1);
        } else {
          this.previousMonth();
        }
        this.resetFocusAfterNavigation();
        return;
      case 'PageDown':
        event.preventDefault();
        if (event.ctrlKey) {
          this.navigateYear(1);
        } else {
          this.nextMonth();
        }
        this.resetFocusAfterNavigation();
        return;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const focusedDay = days[currentIndex];
        if (focusedDay && !focusedDay.isDisabled) {
          this.selectDate(focusedDay.date, currentIndex);
        }
        return;
      }
      default:
        return;
    }

    if (newIndex !== null && newIndex !== currentIndex) {
      this.setFocus(newIndex);
    }
  }

  private navigate(currentIndex: number, step: number, days: CalendarDay[]): number | null {
    const targetIndex = currentIndex + step;

    // If within bounds, find enabled day
    if (targetIndex >= 0 && targetIndex < days.length) {
      return this.findEnabledInRange(targetIndex, currentIndex, days);
    }

    // Handle month boundaries
    const dayOfWeek = currentIndex % 7;

    if (step === -1) {
      // Going left - navigate to previous month, focus last day
      this.previousMonth();
      setTimeout(() => this.resetFocusAfterNavigation('last'), 0);
    } else if (step === 1) {
      // Going right - navigate to next month, focus first day
      this.nextMonth();
      setTimeout(() => this.resetFocusAfterNavigation('first'), 0);
    } else if (step === -7) {
      // Going up - navigate to previous month, preserve column
      this.previousMonth();
      setTimeout(() => this.resetFocusAfterNavigation('lastWeek', dayOfWeek), 0);
    } else if (step === 7) {
      // Going down - navigate to next month, preserve column
      this.nextMonth();
      setTimeout(() => this.resetFocusAfterNavigation('firstWeek', dayOfWeek), 0);
    }

    return null;
  }

  private findEnabledInRange(start: number, fallback: number, days: CalendarDay[], reverse = false): number {
    const clampedStart = Math.max(0, Math.min(start, days.length - 1));
    const clampedFallback = Math.max(0, Math.min(fallback, days.length - 1));

    if (!reverse) {
      // Search forward from start
      for (let i = clampedStart; i < days.length; i++) {
        if (!days[i].isDisabled) return i;
      }
      // Search backward from start
      for (let i = clampedStart - 1; i >= 0; i--) {
        if (!days[i].isDisabled) return i;
      }
    } else {
      // Search backward from start
      for (let i = clampedStart; i >= 0; i--) {
        if (!days[i].isDisabled) return i;
      }
      // Search forward from start
      for (let i = clampedStart + 1; i < days.length; i++) {
        if (!days[i].isDisabled) return i;
      }
    }

    return clampedFallback;
  }

  private setFocus(index: number): void {
    this.focusedDayIndex.set(index);
    setTimeout(() => {
      const dayElement = this.calendarContainer()?.nativeElement.querySelector(`#${this.getDayId(index)}`) as HTMLElement;
      dayElement?.focus();
    }, 0);
  }

  private navigateYear(direction: number): void {
    const current = this.currentDate();
    const newDate = new Date(current.getFullYear() + direction, current.getMonth(), 1);
    this.currentYearValue.set(newDate.getFullYear().toString());
  }

  private resetFocusAfterNavigation(position = 'default', dayOfWeek = -1): void {
    setTimeout(() => {
      const days = this.calendarDays();
      let targetIndex = -1;

      switch (position) {
        case 'first':
          // Focus first enabled day
          targetIndex = days.findIndex(day => !day.isDisabled);
          break;
        case 'last':
          // Focus last enabled day
          for (let i = days.length - 1; i >= 0; i--) {
            if (!days[i].isDisabled) {
              targetIndex = i;
              break;
            }
          }
          break;
        case 'firstWeek':
          // Focus same day of week in first week
          if (dayOfWeek >= 0 && dayOfWeek < 7) {
            targetIndex = this.findEnabledInRange(dayOfWeek, 0, days);
          }
          break;
        case 'lastWeek':
          // Focus same day of week in last week
          if (dayOfWeek >= 0) {
            const lastWeekStart = Math.floor((days.length - 1) / 7) * 7;
            const targetIdx = Math.min(lastWeekStart + dayOfWeek, days.length - 1);
            targetIndex = this.findEnabledInRange(targetIdx, days.length - 1, days);
          }
          break;
        default: {
          // Default priority: selected > today > first enabled
          const selectedIndex = days.findIndex(day => day.isSelected);
          const todayIndex = days.findIndex(day => day.isToday && day.isCurrentMonth);
          const firstEnabledIndex = days.findIndex(day => day.isCurrentMonth && !day.isDisabled);

          targetIndex = selectedIndex >= 0 ? selectedIndex : todayIndex >= 0 ? todayIndex : firstEnabledIndex >= 0 ? firstEnabledIndex : 0;
          break;
        }
      }

      if (targetIndex >= 0) {
        this.setFocus(targetIndex);
      }
    }, 0);
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

```

```angular-ts title="calendar.variants.ts" copyButton showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const calendarVariants = cva('bg-background p-3 w-fit rounded-lg border', {
  variants: {
    zSize: {
      sm: 'text-sm',
      default: '',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export const calendarMonthVariants = cva('flex flex-col w-full gap-4');

export const calendarNavVariants = cva('flex items-center justify-between gap-2 w-full mb-4');

export const calendarNavButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
);

export const calendarWeekdaysVariants = cva('flex');

export const calendarWeekdayVariants = cva('text-muted-foreground font-normal text-center', {
  variants: {
    zSize: {
      sm: 'text-xs w-7',
      default: 'text-[0.8rem] w-9',
      lg: 'text-sm w-11',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export const calendarWeekVariants = cva('flex w-full mt-2');

export const calendarDayVariants = cva('text-center p-0 relative focus-within:relative focus-within:z-20', {
  variants: {
    zSize: {
      sm: 'h-7 w-7 text-xs',
      default: 'h-9 w-9 text-sm',
      lg: 'h-11 w-11 text-base',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export const calendarDayButtonVariants = cva(
  'p-0 font-normal inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground',
  {
    variants: {
      zSize: {
        sm: 'h-7 w-7 text-xs',
        default: 'h-9 w-9 text-sm',
        lg: 'h-11 w-11 text-base',
      },
      selected: {
        true: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        false: '',
      },
      today: {
        true: 'bg-accent text-accent-foreground',
        false: '',
      },
      outside: {
        true: 'text-muted-foreground opacity-50',
        false: '',
      },
      disabled: {
        true: 'text-muted-foreground opacity-50 cursor-not-allowed',
        false: '',
      },
    },
    compoundVariants: [
      {
        today: true,
        selected: false,
        className: 'bg-accent text-accent-foreground',
      },
      {
        today: true,
        selected: true,
        className: 'bg-primary text-primary-foreground',
      },
    ],
    defaultVariants: {
      zSize: 'default',
      selected: false,
      today: false,
      outside: false,
      disabled: false,
    },
  },
);

export type ZardCalendarVariants = VariantProps<typeof calendarVariants>;
export type ZardCalendarWeekdayVariants = VariantProps<typeof calendarWeekdayVariants>;
export type ZardCalendarDayVariants = VariantProps<typeof calendarDayVariants>;
export type ZardCalendarDayButtonVariants = VariantProps<typeof calendarDayButtonVariants>;

```
