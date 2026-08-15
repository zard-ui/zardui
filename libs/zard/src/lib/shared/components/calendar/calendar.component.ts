import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  linkedSignal,
  model,
  numberAttribute,
  viewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { outputFromObservable, outputToObservable } from '@angular/core/rxjs-interop';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

import type { ClassValue } from 'clsx';
import { filter, map } from 'rxjs';

import { ZardCalendarGridComponent } from '@/shared/components/calendar/calendar-grid.component';
import { ZardCalendarNavigationComponent } from '@/shared/components/calendar/calendar-navigation.component';
import type {
  CalendarMode,
  CalendarValue,
  ZardCalendarCaptionLayout,
} from '@/shared/components/calendar/calendar.types';
import {
  generateCalendarDays,
  getSelectedDatesArray,
  isSameDay,
  makeSafeDate,
  normalizeCalendarValue,
} from '@/shared/components/calendar/calendar.utils';
import {
  calendarMonthsVariants,
  calendarMonthVariants,
  calendarVariants,
} from '@/shared/components/calendar/calendar.variants';
import { mergeClasses, noopFn } from '@/shared/utils/merge-classes';

import type { ZardButtonTypeVariants } from '../button/button.variants';

@Component({
  selector: 'z-calendar, [z-calendar]',
  imports: [ZardCalendarNavigationComponent, ZardCalendarGridComponent],
  template: `
    <div [class]="monthsClasses()">
      @for (month of visibleMonths(); track month.key; let i = $index, last = $last) {
        <div [class]="monthClasses()">
          <z-calendar-navigation
            [currentMonth]="month.month.toString()"
            [currentYear]="month.year.toString()"
            [minDate]="minDate()"
            [maxDate]="maxDate()"
            [disabled]="disabled()"
            [zCaptionLayout]="zCaptionLayout()"
            [zButtonVariant]="zButtonVariant()"
            [zShowPreviousButton]="i === 0"
            [zShowNextButton]="last"
            (monthChange)="onMonthChange($event, i)"
            (yearChange)="onYearChange($event, i)"
            (previousMonth)="previousMonth()"
            (nextMonth)="nextMonth()"
          />

          <z-calendar-grid
            [calendarDays]="month.days"
            [disabled]="disabled()"
            [zShowOutsideDays]="zShowOutsideDays()"
            [zMonthIndex]="i"
            (dateSelect)="onDateSelect($event)"
            (previousMonth)="onGridPreviousMonth($event)"
            (nextMonth)="onGridNextMonth($event)"
            (navigateYear)="onNavigateYear($event)"
          />
        </div>
      }
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
    'data-slot': 'calendar',
    '[class]': 'classes()',
    '[attr.tabindex]': '0',
  },
  exportAs: 'zCalendar',
})
export class ZardCalendarComponent implements ControlValueAccessor {
  private readonly gridRefs = viewChildren(ZardCalendarGridComponent);

  /** The grid that owns the roving focus — always the first rendered month. */
  private gridRef(): ZardCalendarGridComponent | undefined {
    return this.gridRefs()[0];
  }

  private clearFocus(): void {
    for (const grid of this.gridRefs()) {
      grid.setFocusedDayIndex(-1);
    }
  }

  // Public method to reset navigation (useful for date-picker)
  resetNavigation(): void {
    const value = this.currentDate();
    this.currentMonthValue.set(value.getMonth().toString());
    this.currentYearValue.set(value.getFullYear().toString());
    this.clearFocus();
  }

  // Public inputs
  readonly class = input<ClassValue>('');
  readonly zMode = input<CalendarMode>('single');
  readonly value = model<CalendarValue>(null);
  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);
  readonly disabled = model<boolean>(false);
  readonly zCaptionLayout = input<ZardCalendarCaptionLayout>('label');
  readonly zButtonVariant = input<ZardButtonTypeVariants>('ghost');
  readonly zShowOutsideDays = input(true, { transform: booleanAttribute });
  readonly zDisabledDates = input<Date[]>([]);
  readonly zNumberOfMonths = input(1, { transform: numberAttribute });

  // Public outputs
  readonly dateChange = outputFromObservable(
    outputToObservable(this.value).pipe(
      map(v => normalizeCalendarValue(v)),
      filter((v): v is NonNullable<CalendarValue> => v !== null),
    ),
  );

  private onChange: (value: CalendarValue) => void = noopFn;
  private onTouched: () => void = noopFn;

  // Internal state
  private readonly normalizedValue = computed(() => normalizeCalendarValue(this.value()));
  private readonly currentDate = computed(() => {
    const val = this.normalizedValue();
    const mode = this.zMode();

    if (!val) {
      return new Date();
    }

    // For single mode, val is Date | null
    if (mode === 'single') {
      return val as Date;
    }

    // For multiple/range mode, val is Date[]
    if (Array.isArray(val) && val.length > 0) {
      return val[0];
    }

    return new Date();
  });

  protected readonly currentMonthValue = linkedSignal(() => this.currentDate().getMonth().toString());
  protected readonly currentYearValue = linkedSignal(() => this.currentDate().getFullYear().toString());

  protected readonly classes = computed(() => mergeClasses(calendarVariants(), this.class()));

  protected readonly monthsClasses = computed(() => mergeClasses(calendarMonthsVariants()));

  protected readonly monthClasses = computed(() => mergeClasses(calendarMonthVariants()));

  /** First day of the month the navigation currently points at. */
  private readonly navigationDate = computed(() => {
    const currentDate = this.currentDate();
    const navigationDate = makeSafeDate(
      Number.parseInt(this.currentYearValue()),
      Number.parseInt(this.currentMonthValue()),
      currentDate.getDate(),
    );

    return Number.isNaN(navigationDate.getTime()) ? currentDate : navigationDate;
  });

  /** One entry per rendered month, starting at the navigation date. */
  protected readonly visibleMonths = computed(() => {
    const base = this.navigationDate();
    const mode = this.zMode();
    const selectedDates = getSelectedDatesArray(this.normalizedValue(), mode);
    const total = Math.max(1, this.zNumberOfMonths());

    return Array.from({ length: total }, (_, offset) => {
      const monthDate = makeSafeDate(base.getFullYear(), base.getMonth() + offset, 1);
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();

      return {
        key: `${year}-${month}`,
        year,
        month,
        days: generateCalendarDays({
          year,
          month,
          mode,
          selectedDates,
          minDate: this.minDate(),
          maxDate: this.maxDate(),
          disabled: this.disabled(),
          disabledDates: this.zDisabledDates(),
        }),
      };
    });
  });

  /** Days of the first rendered month — the one the roving focus lives in. */
  protected readonly calendarDays = computed(() => this.visibleMonths()[0].days);

  /**
   * @param monthOffset position of the month whose caption emitted the change, so a dropdown on
   * the second rendered month moves the navigation base back by that many months.
   */
  protected onMonthChange(monthIndex: string, monthOffset = 0): void {
    if (!monthIndex?.trim()) {
      console.warn('Invalid month index received:', monthIndex);
      return;
    }

    const parsedMonth = Number.parseInt(monthIndex, 10);
    if (Number.isNaN(parsedMonth) || parsedMonth < 0 || parsedMonth > 11) {
      console.warn('Invalid month value:', monthIndex, 'parsed as:', parsedMonth);
      return;
    }

    const displayed = this.displayedMonth(monthOffset);
    this.rebaseNavigation(makeSafeDate(displayed.year, parsedMonth, 1), monthOffset);
  }

  protected onYearChange(year: string, monthOffset = 0): void {
    if (!year?.trim()) {
      console.warn('Invalid year received:', year);
      return;
    }

    const parsedYear = Number.parseInt(year, 10);
    if (Number.isNaN(parsedYear) || parsedYear < 1900 || parsedYear > 2100) {
      console.warn('Invalid year value:', year, 'parsed as:', parsedYear);
      return;
    }

    const displayed = this.displayedMonth(monthOffset);
    this.rebaseNavigation(makeSafeDate(parsedYear, displayed.month, 1), monthOffset);
  }

  /** The month currently rendered at `monthOffset`, falling back to the first one. */
  private displayedMonth(monthOffset: number): { year: number; month: number } {
    const months = this.visibleMonths();
    return months[monthOffset] ?? months[0];
  }

  /**
   * Moves the navigation so that `target` is what the month at `monthOffset` renders.
   * With a single month this is just "go to target".
   */
  private rebaseNavigation(target: Date, monthOffset: number): void {
    const base = makeSafeDate(target.getFullYear(), target.getMonth() - monthOffset, 1);
    this.currentMonthValue.set(base.getMonth().toString());
    this.currentYearValue.set(base.getFullYear().toString());
    this.clearFocus();
  }

  protected previousMonth(): void {
    const month = Number.parseInt(this.currentMonthValue());
    const year = Number.parseInt(this.currentYearValue());

    const date = makeSafeDate(year, month - 1, 1);

    this.currentMonthValue.set(date.getMonth().toString());
    this.currentYearValue.set(date.getFullYear().toString());

    this.clearFocus();
  }

  protected nextMonth(): void {
    const month = Number.parseInt(this.currentMonthValue());
    const year = Number.parseInt(this.currentYearValue());

    const date = makeSafeDate(year, month + 1, 1);

    this.currentMonthValue.set(date.getMonth().toString());
    this.currentYearValue.set(date.getFullYear().toString());

    this.clearFocus();
  }

  protected onNavigateYear(direction: number): void {
    const current = this.currentDate();
    const month = Number.parseInt(this.currentMonthValue());
    const year = Number.parseInt(this.currentYearValue());
    const baseYear = Number.isNaN(year) ? current.getFullYear() : year;
    const baseMonth = Number.isNaN(month) ? current.getMonth() : month;
    const newDate = makeSafeDate(baseYear + direction, baseMonth, 1);
    this.currentYearValue.set(newDate.getFullYear().toString());
    setTimeout(() => this.gridRef()?.resetFocus(), 0);
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
    if (this.disabled()) {
      return;
    }

    const mode = this.zMode();
    const currentValue = this.normalizedValue();

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

    this.onChange(this.normalizedValue());
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
      this.gridRef()?.setFocusedDayIndex(targetIndex);
    }
  }

  private findEnabledInRange(start: number, fallback: number, days: { isDisabled: boolean }[]): number {
    const clampedStart = Math.max(0, Math.min(start, days.length - 1));
    const clampedFallback = Math.max(0, Math.min(fallback, days.length - 1));

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
