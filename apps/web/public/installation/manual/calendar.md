

```angular-ts title="calendar.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  linkedSignal,
  model,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { outputFromObservable, outputToObservable } from '@angular/core/rxjs-interop';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

import type { ClassValue } from 'clsx';
import { filter } from 'rxjs';

import { ZardCalendarGridComponent } from './calendar-grid.component';
import { ZardCalendarNavigationComponent } from './calendar-navigation.component';
import type { CalendarMode, CalendarValue } from './calendar.types';
import { generateCalendarDays, getSelectedDatesArray, isSameDay, makeSafeDate } from './calendar.utils';
import { calendarVariants } from './calendar.variants';
import { mergeClasses } from '../../shared/utils/utils';

export type { CalendarDay, CalendarMode, CalendarValue } from './calendar.types';

@Component({
  selector: 'z-calendar, [z-calendar]',
  imports: [ZardCalendarNavigationComponent, ZardCalendarGridComponent],
  standalone: true,
  template: `
    <div [class]="classes()">
      <z-calendar-navigation
        [currentMonth]="currentMonthValue()"
        [currentYear]="currentYearValue()"
        [minDate]="minDate()"
        [maxDate]="maxDate()"
        [disabled]="disabled()"
        (monthChange)="onMonthChange($event)"
        (yearChange)="onYearChange($event)"
        (previousMonth)="previousMonth()"
        (nextMonth)="nextMonth()"
      />

      <z-calendar-grid
        [calendarDays]="calendarDays()"
        [disabled]="disabled()"
        (dateSelect)="onDateSelect($event)"
        (previousMonth)="onGridPreviousMonth($event)"
        (nextMonth)="onGridNextMonth($event)"
        (previousYear)="navigateYear(-1)"
        (nextYear)="navigateYear(1)"
      />
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardCalendarComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[attr.tabindex]': '0',
  },
  exportAs: 'zCalendar',
})
export class ZardCalendarComponent implements ControlValueAccessor {
  private readonly gridRef = viewChild.required(ZardCalendarGridComponent);

  // Public method to reset navigation (useful for date-picker)
  resetNavigation(): void {
    const value = this.currentDate();
    this.currentMonthValue.set(value.getMonth().toString());
    this.currentYearValue.set(value.getFullYear().toString());
    this.gridRef().setFocusedDayIndex(-1);
  }

  // Public inputs
  readonly class = input<ClassValue>('');
  readonly zMode = input<CalendarMode>('single');
  readonly value = model<CalendarValue>(null);
  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);
  readonly disabled = model<boolean>(false);

  // Public outputs
  readonly dateChange = outputFromObservable(outputToObservable(this.value).pipe(filter(v => v !== null)));

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: CalendarValue) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  // Internal state
  private readonly currentDate = computed(() => {
    const val = this.value();
    const mode = this.zMode();

    if (!val) return new Date();

    // For single mode, val is Date | null
    if (mode === 'single') return val as Date;

    // For multiple/range mode, val is Date[]
    if (Array.isArray(val) && val.length > 0) return val[0];

    return new Date();
  });

  protected readonly currentMonthValue = linkedSignal(() => this.currentDate().getMonth().toString());
  protected readonly currentYearValue = linkedSignal(() => this.currentDate().getFullYear().toString());

  protected readonly classes = computed(() => mergeClasses(calendarVariants(), this.class()));

  protected readonly calendarDays = computed(() => {
    const currentDate = this.currentDate();
    const navigationDate = makeSafeDate(
      Number.parseInt(this.currentYearValue()),
      Number.parseInt(this.currentMonthValue()),
      currentDate.getDate(),
    );
    const selectedDate = Number.isNaN(navigationDate.getTime()) ? currentDate : navigationDate;

    return generateCalendarDays({
      year: selectedDate.getFullYear(),
      month: selectedDate.getMonth(),
      mode: this.zMode(),
      selectedDates: getSelectedDatesArray(this.value(), this.zMode()),
      minDate: this.minDate(),
      maxDate: this.maxDate(),
      disabled: this.disabled(),
    });
  });

  protected onMonthChange(monthIndex: string | string[]): void {
    if (Array.isArray(monthIndex)) {
      console.warn('Calendar received array for month selection, expected single value. Ignoring:', monthIndex);
      return;
    }

    if (!monthIndex || monthIndex.trim() === '') {
      console.warn('Invalid month index received:', monthIndex);
      return;
    }

    const parsedMonth = Number.parseInt(monthIndex, 10);
    if (Number.isNaN(parsedMonth) || parsedMonth < 0 || parsedMonth > 11) {
      console.warn('Invalid month value:', monthIndex, 'parsed as:', parsedMonth);
      return;
    }

    const currentDate = this.currentDate();
    const selectedYear = Number.parseInt(this.currentYearValue());
    const newDate = makeSafeDate(Number.isNaN(selectedYear) ? currentDate.getFullYear() : selectedYear, parsedMonth, 1);
    this.currentMonthValue.set(newDate.getMonth().toString());
    this.gridRef().setFocusedDayIndex(-1);
  }

  protected onYearChange(year: string | string[]): void {
    if (Array.isArray(year)) {
      console.warn('Calendar received array for year selection, expected single value. Ignoring:', year);
      return;
    }

    if (!year || year.trim() === '') {
      console.warn('Invalid year received:', year);
      return;
    }

    const parsedYear = Number.parseInt(year, 10);
    if (Number.isNaN(parsedYear) || parsedYear < 1900 || parsedYear > 2100) {
      console.warn('Invalid year value:', year, 'parsed as:', parsedYear);
      return;
    }

    const currentDate = this.currentDate();
    const selectedMonth = Number.parseInt(this.currentMonthValue());
    const newDate = makeSafeDate(parsedYear, Number.isNaN(selectedMonth) ? currentDate.getMonth() : selectedMonth, 1);
    this.currentYearValue.set(newDate.getFullYear().toString());
    this.gridRef().setFocusedDayIndex(-1);
  }

  protected previousMonth(): void {
    const month = Number.parseInt(this.currentMonthValue());
    const year = Number.parseInt(this.currentYearValue());

    const date = makeSafeDate(year, month - 1, 1);

    this.currentMonthValue.set(date.getMonth().toString());
    this.currentYearValue.set(date.getFullYear().toString());

    this.gridRef().setFocusedDayIndex(-1);
  }

  protected nextMonth(): void {
    const month = Number.parseInt(this.currentMonthValue());
    const year = Number.parseInt(this.currentYearValue());

    const date = makeSafeDate(year, month + 1, 1);

    this.currentMonthValue.set(date.getMonth().toString());
    this.currentYearValue.set(date.getFullYear().toString());

    this.gridRef().setFocusedDayIndex(-1);
  }

  protected navigateYear(direction: number): void {
    const current = this.currentDate();
    const newDate = makeSafeDate(current.getFullYear() + direction, current.getMonth(), 1);
    this.currentYearValue.set(newDate.getFullYear().toString());
    setTimeout(() => this.gridRef().resetFocus(), 0);
  }

  protected onGridPreviousMonth(event: { position: string; dayOfWeek: number }): void {
    this.previousMonth();
    setTimeout(() => this.resetFocusAfterNavigation(event.position, event.dayOfWeek), 0);
  }

  protected onGridNextMonth(event: { position: string; dayOfWeek: number }): void {
    this.nextMonth();
    setTimeout(() => this.resetFocusAfterNavigation(event.position, event.dayOfWeek), 0);
  }

  protected onDateSelect(event: { date: Date; index: number }): void {
    this.selectDate(event.date);
  }

  private selectDate(date: Date): void {
    if (this.disabled()) return;

    const mode = this.zMode();
    const currentValue = this.value();

    if (mode === 'single') {
      this.value.set(date);
    } else if (mode === 'multiple') {
      const selectedDates = Array.isArray(currentValue) ? [...currentValue] : [];
      const existingIndex = selectedDates.findIndex(d => isSameDay(d, date));

      if (existingIndex >= 0) {
        // Remove date if already selected
        selectedDates.splice(existingIndex, 1);
      } else {
        // Add date
        selectedDates.push(date);
      }

      this.value.set(selectedDates.length > 0 ? selectedDates : null);
    } else if (mode === 'range') {
      const selectedDates = Array.isArray(currentValue) ? [...currentValue] : [];

      if (selectedDates.length === 0) {
        // First date selected - set as range start
        this.value.set([date]);
      } else if (selectedDates.length === 1) {
        // Second date selected - complete the range
        const start = selectedDates[0];
        if (date.getTime() < start.getTime()) {
          // New date is before start, swap them
          this.value.set([date, start]);
        } else if (isSameDay(date, start)) {
          // Same date clicked, reset
          this.value.set(null);
        } else {
          // New date is after start
          this.value.set([start, date]);
        }
      } else {
        // Range already complete, start new range
        this.value.set([date]);
      }
    }

    this.onChange(this.value());
    this.onTouched();
  }

  private resetFocusAfterNavigation(position = 'default', dayOfWeek = -1): void {
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

        targetIndex =
          selectedIndex >= 0 ? selectedIndex : todayIndex >= 0 ? todayIndex : Math.max(firstEnabledIndex, 0);
        break;
      }
    }

    if (targetIndex >= 0) {
      this.gridRef().setFocusedDayIndex(targetIndex);
    }
  }

  private findEnabledInRange(start: number, fallback: number, days: { isDisabled: boolean }[]): number {
    const clampedStart = Math.max(0, Math.min(start, days.length - 1));
    const clampedFallback = Math.max(0, Math.min(fallback, days.length - 1));

    // Search forward from start
    for (let i = clampedStart; i < days.length; i++) {
      if (!days[i].isDisabled) return i;
    }
    // Search backward from start
    for (let i = clampedStart - 1; i >= 0; i--) {
      if (!days[i].isDisabled) return i;
    }

    return clampedFallback;
  }

  writeValue(value: CalendarValue): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: CalendarValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}

```



```angular-ts title="calendar.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export const calendarVariants = cva('bg-background p-3 w-fit rounded-lg border');

export const calendarMonthVariants = cva('flex flex-col w-fit gap-4');

export const calendarNavVariants = cva('flex items-center justify-between gap-2 w-fit mb-4');

export const calendarNavButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
);

export const calendarWeekdaysVariants = cva('flex');

export const calendarWeekdayVariants = cva('text-muted-foreground font-normal text-center text-[0.8rem] w-8');

export const calendarWeekVariants = cva('flex w-full mt-2');

export const calendarDayVariants = cva(
  'p-0 relative focus-within:relative focus-within:z-20 flex mt-1 h-8 w-8 text-sm',
);

export const calendarDayButtonVariants = cva(
  'p-0 font-normal flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground w-full h-full text-sm',
  {
    variants: {
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
      rangeStart: {
        true: 'rounded-r-none bg-primary text-primary-foreground',
        false: '',
      },
      rangeEnd: {
        true: 'rounded-l-none bg-primary text-primary-foreground',
        false: '',
      },
      inRange: {
        true: 'rounded-none bg-accent hover:bg-accent',
        false: '',
      },
    },
    compoundVariants: [
      {
        today: true,
        selected: false,
        rangeStart: false,
        rangeEnd: false,
        inRange: false,
        className: 'bg-accent text-accent-foreground',
      },
      {
        today: true,
        selected: true,
        className: 'bg-primary text-primary-foreground',
      },
      {
        rangeStart: true,
        rangeEnd: true,
        className: 'rounded-md bg-primary text-primary-foreground',
      },
    ],
    defaultVariants: {
      selected: false,
      today: false,
      outside: false,
      disabled: false,
      rangeStart: false,
      rangeEnd: false,
      inRange: false,
    },
  },
);

export type ZardCalendarVariants = VariantProps<typeof calendarVariants>;
export type ZardCalendarWeekdayVariants = VariantProps<typeof calendarWeekdayVariants>;
export type ZardCalendarDayVariants = VariantProps<typeof calendarDayVariants>;
export type ZardCalendarDayButtonVariants = VariantProps<typeof calendarDayButtonVariants>;

```



```angular-ts title="calendar-grid.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import type { CalendarDay } from './calendar.types';
import { getDayAriaLabel, getDayId } from './calendar.utils';
import { calendarDayButtonVariants, calendarDayVariants, calendarWeekdayVariants } from './calendar.variants';
import { mergeClasses } from '../../shared/utils/utils';
import { checkForProperZardInitialization } from '../core/provider/providezard';

@Component({
  selector: 'z-calendar-grid',
  template: `
    <div #gridContainer>
      <!-- Weekdays Header -->
      <div class="grid w-fit grid-cols-7 text-center" role="row">
        @for (weekday of weekdays; track $index) {
          <div [class]="weekdayClasses()" role="columnheader">
            {{ weekday }}
          </div>
        }
      </div>

      <!-- Calendar Days Grid -->
      <div class="mt-2 grid w-fit auto-rows-min grid-cols-7 gap-0" role="rowgroup">
        @for (day of calendarDays(); track day.date.getTime(); let i = $index) {
          <div [class]="dayContainerClasses()" role="gridcell">
            <button
              type="button"
              [id]="getDayId(i)"
              [class]="dayButtonClasses(day)"
              (click)="onDayClick(day.date, i)"
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[attr.role]': '"grid"',
    '(keydown.{arrowleft,arrowright,arrowup,arrowdown,home,end,pageup,pagedown,enter,space}.prevent)':
      'onKeyDown($event)',
  },
  exportAs: 'zCalendarGrid',
})
export class ZardCalendarGridComponent {
  private readonly gridContainer = viewChild.required<ElementRef<HTMLElement>>('gridContainer');

  // Inputs
  readonly calendarDays = input.required<CalendarDay[]>();
  readonly disabled = input<boolean>(false);

  // Outputs
  readonly dateSelect = output<{ date: Date; index: number }>();
  readonly previousMonth = output<{ position: string; dayOfWeek: number }>();
  readonly nextMonth = output<{ position: string; dayOfWeek: number }>();
  readonly previousYear = output<void>();
  readonly nextYear = output<void>();

  readonly weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  private readonly focusedDayIndex = signal<number>(-1);

  protected readonly weekdayClasses = computed(() => mergeClasses(calendarWeekdayVariants()));

  protected readonly dayContainerClasses = computed(() => mergeClasses(calendarDayVariants()));

  constructor() {
    checkForProperZardInitialization();
  }

  protected dayButtonClasses(day: CalendarDay): string {
    return mergeClasses(
      calendarDayButtonVariants({
        selected: day.isSelected,
        today: day.isToday,
        outside: !day.isCurrentMonth,
        disabled: day.isDisabled,
        rangeStart: day.isRangeStart ?? false,
        rangeEnd: day.isRangeEnd ?? false,
        inRange: day.isInRange ?? false,
      }),
    );
  }

  protected onDayClick(date: Date, index: number): void {
    if (this.disabled()) {
      return;
    }
    this.focusedDayIndex.set(index);
    this.dateSelect.emit({ date, index });
  }

  protected getDayId(index: number): string {
    return getDayId(index);
  }

  protected getDayAriaLabel(day: CalendarDay): string {
    return getDayAriaLabel(day);
  }

  protected getFocusedDayIndex(): number {
    const focused = this.focusedDayIndex();
    if (focused >= 0) {
      return focused;
    }

    // Default focus to selected date or today
    const days = this.calendarDays();
    const selectedIndex = days.findIndex(day => day.isSelected);
    if (selectedIndex >= 0) {
      return selectedIndex;
    }

    const todayIndex = days.findIndex(day => day.isToday && day.isCurrentMonth);
    if (todayIndex >= 0) {
      return todayIndex;
    }

    // Fall back to first enabled day of current month
    const firstCurrentMonthIndex = days.findIndex(day => day.isCurrentMonth && !day.isDisabled);
    return firstCurrentMonthIndex >= 0 ? firstCurrentMonthIndex : 0;
  }

  /**
   * Public method to set focus on a specific day index
   */
  setFocusedDayIndex(index: number): void {
    this.focusedDayIndex.set(index);
    this.setFocus(index);
  }

  /**
   * Public method to reset focus based on priority
   */
  resetFocus(): void {
    const targetIndex = this.getFocusedDayIndex();
    this.setFocus(targetIndex);
  }

  onKeyDown(e: Event): void {
    if (this.disabled()) {
      return;
    }

    const event = e as KeyboardEvent;
    const days = this.calendarDays();
    if (days.length === 0) {
      return;
    }

    const currentIndex = this.getFocusedDayIndex();
    let newIndex: number | null = null;

    switch (event.key) {
      case 'ArrowLeft':
        newIndex = this.navigate(currentIndex, -1, days);
        break;
      case 'ArrowRight':
        newIndex = this.navigate(currentIndex, 1, days);
        break;
      case 'ArrowUp':
        newIndex = this.navigate(currentIndex, -7, days);
        break;
      case 'ArrowDown':
        newIndex = this.navigate(currentIndex, 7, days);
        break;
      case 'Home':
        newIndex = this.findEnabledInRange(
          Math.floor(currentIndex / 7) * 7,
          Math.floor(currentIndex / 7) * 7 + 6,
          days,
        );
        break;
      case 'End':
        newIndex = this.findEnabledInRange(
          Math.floor(currentIndex / 7) * 7 + 6,
          Math.floor(currentIndex / 7) * 7,
          days,
          true,
        );
        break;
      case 'PageUp':
        if (event.ctrlKey) {
          this.previousYear.emit();
        } else {
          this.previousMonth.emit({ position: 'default', dayOfWeek: -1 });
        }
        break;
      case 'PageDown':
        if (event.ctrlKey) {
          this.nextYear.emit();
        } else {
          this.nextMonth.emit({ position: 'default', dayOfWeek: -1 });
        }
        break;
      case 'Enter':
      case ' ': {
        const focusedDay = days[currentIndex];
        if (focusedDay && !focusedDay.isDisabled) {
          this.dateSelect.emit({ date: focusedDay.date, index: currentIndex });
        }
        break;
      }
      default:
        break;
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
      this.previousMonth.emit({ position: 'last', dayOfWeek: -1 });
    } else if (step === 1) {
      // Going right - navigate to next month, focus first day
      this.nextMonth.emit({ position: 'first', dayOfWeek: -1 });
    } else if (step === -7) {
      // Going up - navigate to previous month, preserve column
      this.previousMonth.emit({ position: 'lastWeek', dayOfWeek });
    } else if (step === 7) {
      // Going down - navigate to next month, preserve column
      this.nextMonth.emit({ position: 'firstWeek', dayOfWeek });
    }

    return null;
  }

  private findEnabledInRange(start: number, fallback: number, days: CalendarDay[], reverse = false): number {
    const clampedStart = Math.max(0, Math.min(start, days.length - 1));
    const clampedFallback = Math.max(0, Math.min(fallback, days.length - 1));

    if (!reverse) {
      // Search forward from start
      for (let i = clampedStart; i < days.length; i++) {
        if (!days[i].isDisabled) {
          return i;
        }
      }
      // Search backward from start
      for (let i = clampedStart - 1; i >= 0; i--) {
        if (!days[i].isDisabled) {
          return i;
        }
      }
    } else {
      // Search backward from start
      for (let i = clampedStart; i >= 0; i--) {
        if (!days[i].isDisabled) {
          return i;
        }
      }
      // Search forward from start
      for (let i = clampedStart + 1; i < days.length; i++) {
        if (!days[i].isDisabled) {
          return i;
        }
      }
    }

    return clampedFallback;
  }

  private setFocus(index: number): void {
    this.focusedDayIndex.set(index);
    setTimeout(() => {
      const dayElement = this.gridContainer()?.nativeElement.querySelector(`#${getDayId(index)}`) as HTMLElement;
      dayElement?.focus();
    }, 0);
  }
}

```



```angular-ts title="calendar-navigation.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, computed, input, output, ViewEncapsulation } from '@angular/core';

import { calendarNavVariants } from './calendar.variants';
import { mergeClasses } from '../../shared/utils/utils';
import { ZardButtonComponent } from '../button/button.component';
import { ZardIconComponent } from '../icon/icon.component';
import { ZardSelectItemComponent } from '../select/select-item.component';
import { ZardSelectComponent } from '../select/select.component';

@Component({
  selector: 'z-calendar-navigation',
  imports: [ZardButtonComponent, ZardIconComponent, ZardSelectComponent, ZardSelectItemComponent],
  standalone: true,
  template: `
    <div [class]="navClasses()">
      <button
        type="button"
        z-button
        zType="ghost"
        zSize="sm"
        (click)="onPreviousClick()"
        [disabled]="isPreviousDisabled()"
        aria-label="Previous month"
        class="h-7 w-7 p-0"
      >
        <z-icon zType="chevron-left" />
      </button>

      <!-- Month and Year Selectors -->
      <div class="flex items-center space-x-2">
        <!-- Month Select -->
        <z-select [zValue]="currentMonth()" [zLabel]="currentMonthName()" (zSelectionChange)="onMonthChange($event)">
          @for (month of months; track $index) {
            <z-select-item [zValue]="$index.toString()">{{ month }}</z-select-item>
          }
        </z-select>

        <!-- Year Select -->
        <z-select [zValue]="currentYear()" [zLabel]="currentYear()" (zSelectionChange)="onYearChange($event)">
          @for (year of availableYears(); track year) {
            <z-select-item [zValue]="year.toString()">{{ year }}</z-select-item>
          }
        </z-select>
      </div>

      <button
        type="button"
        z-button
        zType="ghost"
        zSize="sm"
        (click)="onNextClick()"
        [disabled]="isNextDisabled()"
        aria-label="Next month"
        class="h-7 w-7 p-0"
      >
        <z-icon zType="chevron-right" />
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zCalendarNavigation',
})
export class ZardCalendarNavigationComponent {
  // Inputs
  readonly currentMonth = input.required<string>();
  readonly currentYear = input.required<string>();
  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);
  readonly disabled = input<boolean>(false);

  // Outputs
  readonly monthChange = output<string>();
  readonly yearChange = output<string>();
  readonly previousMonth = output<void>();
  readonly nextMonth = output<void>();

  readonly months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  protected readonly navClasses = computed(() => mergeClasses(calendarNavVariants()));

  protected readonly availableYears = computed(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  });

  protected readonly currentMonthName = computed(() => {
    const selectedMonth = Number.parseInt(this.currentMonth());
    if (!Number.isNaN(selectedMonth) && this.months[selectedMonth]) return this.months[selectedMonth];
    return this.months[new Date().getMonth()];
  });

  protected isPreviousDisabled(): boolean {
    if (this.disabled()) return true;

    const minDate = this.minDate();
    if (!minDate) return false;

    const currentMonth = Number.parseInt(this.currentMonth());
    const currentYear = Number.parseInt(this.currentYear());
    const lastDayOfPreviousMonth = new Date(currentYear, currentMonth, 0);

    return lastDayOfPreviousMonth.getTime() < minDate.getTime();
  }

  protected isNextDisabled(): boolean {
    if (this.disabled()) return true;

    const maxDate = this.maxDate();
    if (!maxDate) return false;

    const currentMonth = Number.parseInt(this.currentMonth());
    const currentYear = Number.parseInt(this.currentYear());
    const nextMonth = new Date(currentYear, currentMonth + 1, 1);

    return nextMonth.getTime() > maxDate.getTime();
  }

  protected onPreviousClick(): void {
    this.previousMonth.emit();
  }

  protected onNextClick(): void {
    this.nextMonth.emit();
  }

  protected onMonthChange(month: string | string[]): void {
    if (Array.isArray(month)) {
      console.warn('Calendar navigation received array for month selection, expected single value. Ignoring:', month);
      return;
    }
    this.monthChange.emit(month);
  }

  protected onYearChange(year: string | string[]): void {
    if (Array.isArray(year)) {
      console.warn('Calendar navigation received array for year selection, expected single value. Ignoring:', year);
      return;
    }
    this.yearChange.emit(year);
  }
}

```



```angular-ts title="calendar.types.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
export type CalendarMode = 'single' | 'multiple' | 'range';
export type CalendarValue = Date | Date[] | null;

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
  isInRange?: boolean;
  id?: string;
}

export interface CalendarDayConfig {
  year: number;
  month: number;
  mode: CalendarMode;
  selectedDates: Date[];
  minDate: Date | null;
  maxDate: Date | null;
  disabled: boolean;
}

export { type ZardCalendarVariants } from './calendar.variants';

```



```angular-ts title="calendar.utils.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import type { CalendarDay, CalendarDayConfig, CalendarMode, CalendarValue } from './calendar.types';

/**
 * Checks if two dates represent the same day (ignoring time)
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Checks if a date is disabled based on min/max constraints
 */
export function isDateDisabled(date: Date, minDate: Date | null, maxDate: Date | null): boolean {
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  return false;
}

/**
 * Generates calendar days for a given month with all selection states
 */
export function generateCalendarDays(config: CalendarDayConfig): CalendarDay[] {
  const { year, month, mode, selectedDates, minDate, maxDate, disabled } = config;

  const today = new Date();

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

  // For range mode, determine range start and end
  let rangeStart: Date | null = null;
  let rangeEnd: Date | null = null;
  if (mode === 'range' && selectedDates.length > 0) {
    rangeStart = selectedDates[0];
    rangeEnd = selectedDates.length > 1 ? selectedDates[1] : null;
  }

  while (currentWeekDate <= endDate) {
    const date = new Date(currentWeekDate);
    const isCurrentMonth = date.getMonth() === month;
    const isToday = isSameDay(date, today);
    const isDisabledDate = disabled || isDateDisabled(date, minDate, maxDate);

    // Determine if date is selected
    let isSelected = false;
    let isRangeStart = false;
    let isRangeEnd = false;
    let isInRange = false;

    if (mode === 'single') {
      isSelected = selectedDates.length > 0 && isSameDay(date, selectedDates[0]);
    } else if (mode === 'multiple') {
      isSelected = selectedDates.some(d => isSameDay(date, d));
    } else if (mode === 'range') {
      if (rangeStart && isSameDay(date, rangeStart)) {
        isRangeStart = true;
        isSelected = true;
      }
      if (rangeEnd && isSameDay(date, rangeEnd)) {
        isRangeEnd = true;
        isSelected = true;
      }
      if (rangeStart && rangeEnd && !isRangeStart && !isRangeEnd) {
        // Check if date is between start and end
        const dateTime = date.getTime();
        const startTime = rangeStart.getTime();
        const endTime = rangeEnd.getTime();
        isInRange = dateTime > startTime && dateTime < endTime;
      }
    }

    days.push({
      date,
      isCurrentMonth,
      isToday,
      isSelected,
      isDisabled: isDisabledDate,
      isRangeStart,
      isRangeEnd,
      isInRange,
    });

    currentWeekDate.setDate(currentWeekDate.getDate() + 1);
  }

  return days;
}

/**
 * Converts CalendarValue to array of Dates for easier processing
 */
export function getSelectedDatesArray(value: CalendarValue, mode: CalendarMode): Date[] {
  if (!value) return [];

  if (mode === 'single') {
    return [value as Date];
  }

  if ((mode === 'multiple' || mode === 'range') && Array.isArray(value)) {
    return value;
  }

  return [];
}

/**
 * Generates a unique ID for a calendar day
 */
export function getDayId(index: number): string {
  return `calendar-day-${index}`;
}

/**
 * Generates an accessible ARIA label for a calendar day
 */
export function getDayAriaLabel(day: CalendarDay): string {
  const dateStr = day.date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const labels = [dateStr];

  if (day.isToday) labels.push('Today');
  if (day.isSelected) labels.push('Selected');
  if (day.isRangeStart) labels.push('Range start');
  if (day.isRangeEnd) labels.push('Range end');
  if (day.isInRange) labels.push('In range');
  if (!day.isCurrentMonth) labels.push('Outside month');
  if (day.isDisabled) labels.push('Disabled');

  return labels.join(', ');
}

/**
 * Creates a date positioned safely at midday to avoid timezone-based
 * month/day shifts triggered by local DST or UTC conversions.
 *
 * Useful when constructing calendar/navigation dates where 00:00
 * may incorrectly roll the date backward or forward.
 */
export function makeSafeDate(year: number, month: number, day = 1): Date {
  const date = new Date(year, month, day);
  date.setHours(12, 0, 0, 0);
  return date;
}

```

