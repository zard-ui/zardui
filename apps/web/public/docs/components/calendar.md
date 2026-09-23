---
title: Calendar
description: A calendar component that allows users to select a date or a range of dates.
---

# Calendar

A calendar component that allows users to select a date or a range of dates.

## Installation

### CLI

```bash
npx zard-cli@latest add calendar
```

### Manual

```angular-ts
import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  Injector,
  input,
  isDevMode,
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
import { mergeClasses } from '@/shared/utils/merge-classes';
import { noopFn } from '@/shared/utils/noop';

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
  private readonly injector = inject(Injector);
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
      if (isDevMode()) {
        console.warn('Invalid month index received:', monthIndex);
      }
      return;
    }

    const parsedMonth = Number.parseInt(monthIndex, 10);
    if (Number.isNaN(parsedMonth) || parsedMonth < 0 || parsedMonth > 11) {
      if (isDevMode()) {
        console.warn('Invalid month value:', monthIndex, 'parsed as:', parsedMonth);
      }
      return;
    }

    const displayed = this.displayedMonth(monthOffset);
    this.rebaseNavigation(makeSafeDate(displayed.year, parsedMonth, 1), monthOffset);
  }

  protected onYearChange(year: string, monthOffset = 0): void {
    if (!year?.trim()) {
      if (isDevMode()) {
        console.warn('Invalid year received:', year);
      }
      return;
    }

    const parsedYear = Number.parseInt(year, 10);
    if (Number.isNaN(parsedYear) || parsedYear < 1900 || parsedYear > 2100) {
      if (isDevMode()) {
        console.warn('Invalid year value:', year, 'parsed as:', parsedYear);
      }
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
    afterNextRender(() => this.gridRef()?.resetFocus(), { injector: this.injector });
  }

  protected onGridPreviousMonth(event: { position: string; dayOfWeek: number }): void {
    this.previousMonth();
    afterNextRender(() => this.resetFocusAfterNavigation(event.position, event.dayOfWeek), {
      injector: this.injector,
    });
  }

  protected onGridNextMonth(event: { position: string; dayOfWeek: number }): void {
    this.nextMonth();
    afterNextRender(() => this.resetFocusAfterNavigation(event.position, event.dayOfWeek), {
      injector: this.injector,
    });
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
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

/**
 * Every measurement of the calendar derives from two CSS variables declared on the root:
 *
 * - `--cell-size`: the width/height of a single day cell (default `--spacing(7)`)
 * - `--cell-radius`: the corner radius of a day cell (default `var(--radius-md)`)
 *
 * Overriding them through the `class` input rescales the whole calendar, e.g.
 * `class="[--cell-size:--spacing(12)]"`.
 */
export const calendarVariants = cva(
  mergeClasses(
    // `block` because these classes land on the `<z-calendar>` host, which is inline by default.
    'group/calendar block w-fit bg-background p-2',
    '[--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)]',
    'in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent',
  ),
);

/** Wraps every rendered month. Stacks on small screens and sits side by side from `md` up. */
export const calendarMonthsVariants = cva('relative flex flex-col gap-4 md:flex-row');

export const calendarMonthVariants = cva('relative flex w-full flex-col gap-4');

export const calendarNavVariants = cva('absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1');

/**
 * Extra classes layered on top of `buttonVariants` — the navigation arrows are rendered with
 * `<button z-button [zType]="zButtonVariant()">`, so the button component supplies the base styling.
 */
export const calendarNavButtonVariants = cva('size-(--cell-size) p-0 select-none aria-disabled:opacity-50');

/** Placeholder that holds an arrow's slot on the months that do not own it. */
export const calendarNavSpacerVariants = cva('size-(--cell-size)');

export const calendarCaptionVariants = cva('flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)');

export const calendarDropdownsVariants = cva(
  'flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium',
);

export const calendarCaptionLabelVariants = cva('font-medium select-none', {
  variants: {
    layout: {
      label: 'text-sm',
      // In dropdown layout this label is what the user sees of the select underneath it,
      // so it carries the control's height and padding.
      dropdown: 'flex h-(--cell-size) items-center gap-1 rounded-(--cell-radius) px-2 text-sm',
    },
  },
  defaultVariants: {
    layout: 'label',
  },
});

/**
 * Wraps a caption dropdown. A native `<select>` is laid invisible on top of the visible label,
 * so the browser owns the popup while the label owns the looks — the same trick shadcn uses.
 * The focus ring therefore has to come from the select, through `has-[:focus-visible]`.
 */
export const calendarDropdownRootVariants = cva(
  mergeClasses(
    'relative isolate rounded-(--cell-radius) border border-input bg-background shadow-xs',
    'has-focus-visible:border-ring has-focus-visible:ring-3 has-focus-visible:ring-ring/50',
    'has-disabled:pointer-events-none has-disabled:opacity-50',
  ),
);

/** The native select itself: invisible, but on top and still clickable. */
export const calendarDropdownVariants = cva('absolute inset-0 z-10 cursor-pointer bg-popover opacity-0');

export const calendarWeekdaysVariants = cva('grid w-full grid-cols-7');

export const calendarWeekdayVariants = cva(
  mergeClasses(
    'flex h-(--cell-size) w-full min-w-(--cell-size) items-center justify-center',
    'rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none',
  ),
);

/** The day rows. `gap-y-2` reproduces the `week: mt-2` of shadcn; `gap-x-0` keeps the range rail continuous. */
export const calendarWeekVariants = cva('mt-2 grid w-full grid-cols-7 gap-x-0 gap-y-2');

export const calendarDayVariants = cva(
  mergeClasses(
    'group/day relative aspect-square size-full rounded-(--cell-radius) p-0 text-center select-none',
    // Round the range rail at both ends of every week.
    'nth-[7n+1]:rounded-s-(--cell-radius) nth-[7n]:rounded-e-(--cell-radius)',
  ),
  {
    variants: {
      selected: {
        true: '',
        false: '',
      },
      today: {
        true: 'rounded-(--cell-radius) bg-muted text-foreground',
        false: '',
      },
      rangeStart: {
        true: mergeClasses(
          'relative isolate z-0 rounded-s-(--cell-radius) bg-muted',
          'after:absolute after:inset-y-0 after:end-0 after:w-4 after:bg-muted',
          // No neighbour to bridge to at the end of a week — do not bleed outside the grid.
          '[&:nth-child(7n)]:after:hidden',
        ),
        false: '',
      },
      rangeMiddle: {
        true: 'rounded-none bg-muted',
        false: '',
      },
      rangeEnd: {
        true: mergeClasses(
          'relative isolate z-0 rounded-e-(--cell-radius) bg-muted',
          'after:absolute after:inset-y-0 after:start-0 after:w-4 after:bg-muted',
          '[&:nth-child(7n+1)]:after:hidden',
        ),
        false: '',
      },
    },
    compoundVariants: [
      {
        // A one-day range is a plain selected day: full radius, no rail.
        rangeStart: true,
        rangeEnd: true,
        className: 'rounded-(--cell-radius) bg-transparent after:hidden',
      },
      {
        // Today + selected outside of a range: the day button owns the highlight.
        today: true,
        selected: true,
        rangeStart: false,
        rangeMiddle: false,
        rangeEnd: false,
        className: 'bg-transparent',
      },
    ],
    defaultVariants: {
      selected: false,
      today: false,
      rangeStart: false,
      rangeMiddle: false,
      rangeEnd: false,
    },
  },
);

export const calendarDayButtonVariants = cva(
  mergeClasses(
    'relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col items-center justify-center gap-1',
    'rounded-(--cell-radius) border border-transparent p-0 text-sm leading-none font-normal',
    'transition-colors outline-none',
    'hover:bg-muted hover:text-foreground dark:hover:text-foreground',
    'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&>span]:text-xs [&>span]:opacity-70',
  ),
  {
    variants: {
      selected: {
        true: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
        false: '',
      },
      rangeStart: {
        true: 'rounded-(--cell-radius) rounded-s-(--cell-radius) bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
        false: '',
      },
      rangeEnd: {
        true: 'rounded-(--cell-radius) rounded-e-(--cell-radius) bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
        false: '',
      },
      rangeMiddle: {
        true: 'rounded-none bg-muted text-foreground hover:bg-muted hover:text-foreground',
        false: '',
      },
      outside: {
        true: 'text-muted-foreground aria-selected:text-muted-foreground',
        false: '',
      },
      disabled: {
        true: 'text-muted-foreground opacity-50 cursor-not-allowed',
        false: '',
      },
    },
    compoundVariants: [
      {
        // A one-day range renders as a regular selected day.
        rangeStart: true,
        rangeEnd: true,
        className: 'rounded-(--cell-radius) bg-primary text-primary-foreground',
      },
    ],
    defaultVariants: {
      selected: false,
      rangeStart: false,
      rangeEnd: false,
      rangeMiddle: false,
      outside: false,
      disabled: false,
    },
  },
);

export type ZardCalendarCaptionLabelVariants = NonNullable<VariantProps<typeof calendarCaptionLabelVariants>['layout']>;
```

```angular-ts
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  type ElementRef,
  input,
  numberAttribute,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { mergeClasses } from '@/shared/utils/merge-classes';

import type { CalendarDay } from './calendar.types';
import { calendarWeekdays, getDayAriaLabel, getDayId } from './calendar.utils';
import {
  calendarDayButtonVariants,
  calendarDayVariants,
  calendarWeekdaysVariants,
  calendarWeekdayVariants,
  calendarWeekVariants,
} from './calendar.variants';

@Component({
  selector: 'z-calendar-grid',
  template: `
    <div #gridContainer class="w-full">
      <!-- Weekdays Header -->
      <div [class]="weekdaysClasses()" role="row">
        @for (weekday of weekdays; track weekday) {
          <div [class]="weekdayClasses()" role="columnheader">
            {{ weekday }}
          </div>
        }
      </div>

      <!-- Calendar Days Grid -->
      <div [class]="weekClasses()" role="rowgroup">
        @for (day of calendarDays(); track day.date.getTime(); let i = $index) {
          <div
            role="gridcell"
            [class]="dayContainerClasses(day)"
            [attr.data-selected]="day.isSelected ? 'true' : null"
            [attr.data-today]="day.isToday ? 'true' : null"
            [attr.data-outside]="day.isCurrentMonth ? null : 'true'"
            [attr.data-disabled]="day.isDisabled ? 'true' : null"
            [attr.data-range-start]="day.isRangeStart ? 'true' : null"
            [attr.data-range-middle]="day.isInRange ? 'true' : null"
            [attr.data-range-end]="day.isRangeEnd ? 'true' : null"
          >
            <button
              type="button"
              [id]="getDayId(i)"
              [class]="dayButtonClasses(day)"
              (click)="onDayClick(day.date, i)"
              [disabled]="day.isDisabled"
              [attr.data-day]="getDayLabel(day)"
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
    class: 'w-full',
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
  readonly zShowOutsideDays = input(true, { transform: booleanAttribute });
  /** Position of this grid inside a multi-month calendar. Only used to scope the day ids. */
  readonly zMonthIndex = input(0, { transform: numberAttribute });

  // Outputs
  readonly dateSelect = output<{ date: Date; index: number }>();
  readonly previousMonth = output<{ position: string; dayOfWeek: number }>();
  readonly nextMonth = output<{ position: string; dayOfWeek: number }>();
  readonly navigateYear = output<number>();

  readonly weekdays = calendarWeekdays;

  private readonly focusedDayIndex = signal<number>(-1);

  protected readonly weekdaysClasses = computed(() => mergeClasses(calendarWeekdaysVariants()));

  protected readonly weekdayClasses = computed(() => mergeClasses(calendarWeekdayVariants()));

  protected readonly weekClasses = computed(() => mergeClasses(calendarWeekVariants()));

  protected dayContainerClasses(day: CalendarDay): string {
    return mergeClasses(
      calendarDayVariants({
        selected: day.isSelected,
        today: day.isToday,
        rangeStart: day.isRangeStart ?? false,
        rangeMiddle: day.isInRange ?? false,
        rangeEnd: day.isRangeEnd ?? false,
      }),
      !day.isCurrentMonth && !this.zShowOutsideDays() && 'invisible',
    );
  }

  protected dayButtonClasses(day: CalendarDay): string {
    return mergeClasses(
      calendarDayButtonVariants({
        selected: day.isSelected,
        outside: !day.isCurrentMonth,
        disabled: day.isDisabled,
        rangeStart: day.isRangeStart ?? false,
        rangeEnd: day.isRangeEnd ?? false,
        rangeMiddle: day.isInRange ?? false,
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
    return getDayId(index, this.zMonthIndex());
  }

  protected getDayAriaLabel(day: CalendarDay): string {
    return getDayAriaLabel(day);
  }

  /** Date exposed as `data-day`, mirroring the shadcn day button. */
  protected getDayLabel(day: CalendarDay): string {
    return day.date.toLocaleDateString('en-US');
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
          this.navigateYear.emit(-1);
        } else {
          this.previousMonth.emit({ position: 'default', dayOfWeek: -1 });
        }
        break;
      case 'PageDown':
        if (event.ctrlKey) {
          this.navigateYear.emit(1);
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
      const dayElement = this.gridContainer()?.nativeElement.querySelector(
        `#${getDayId(index, this.zMonthIndex())}`,
      ) as HTMLElement;
      dayElement?.focus();
    }, 0);
  }
}
```

```angular-ts
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';

import type { ZardCalendarCaptionLayout } from '@/shared/components/calendar/calendar.types';
import { calendarMonths, calendarMonthsLong } from '@/shared/components/calendar/calendar.utils';
import { mergeClasses } from '@/shared/utils/merge-classes';

import {
  calendarCaptionLabelVariants,
  calendarCaptionVariants,
  calendarDropdownRootVariants,
  calendarDropdownsVariants,
  calendarDropdownVariants,
  calendarNavButtonVariants,
  calendarNavSpacerVariants,
  calendarNavVariants,
} from './calendar.variants';
import { ZardButtonComponent } from '../button/button.component';
import type { ZardButtonTypeVariants } from '../button/button.variants';

@Component({
  selector: 'z-calendar-navigation',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <div [class]="navClasses()">
      @if (zShowPreviousButton()) {
        <button
          type="button"
          z-button
          [zType]="zButtonVariant()"
          [class]="navButtonClasses()"
          (click)="onPreviousClick()"
          [zDisabled]="isPreviousDisabled()"
          aria-label="Previous month"
        >
          <ng-icon name="lucideChevronLeft" class="size-4!" />
        </button>
      } @else {
        <div [class]="navSpacerClasses()" aria-hidden="true"></div>
      }

      @if (zShowNextButton()) {
        <button
          type="button"
          z-button
          [zType]="zButtonVariant()"
          [class]="navButtonClasses()"
          (click)="onNextClick()"
          [zDisabled]="isNextDisabled()"
          aria-label="Next month"
        >
          <ng-icon name="lucideChevronRight" class="size-4!" />
        </button>
      } @else {
        <div [class]="navSpacerClasses()" aria-hidden="true"></div>
      }
    </div>

    <div data-slot="calendar-caption" [class]="captionClasses()">
      @if (zCaptionLayout() === 'label') {
        <span [class]="captionLabelClasses()">{{ monthYearLabel() }}</span>
      } @else {
        <div [class]="dropdownsClasses()">
          @if (showMonthDropdown()) {
            <!--
              A native select sits invisible on top of the label, exactly like the shadcn
              calendar: the browser owns the popup, the span owns the looks.
            -->
            <div data-slot="calendar-dropdown-root" [class]="dropdownRootClasses()">
              <select
                [class]="dropdownClasses()"
                [disabled]="disabled()"
                (change)="onMonthChange($event)"
                aria-label="Choose the month"
              >
                @for (month of months; track month; let monthIndex = $index) {
                  <option [value]="monthIndex" [selected]="monthIndex === selectedMonthIndex()">{{ month }}</option>
                }
              </select>

              <span [class]="captionLabelClasses()" aria-hidden="true">
                {{ currentMonthName() }}
                <ng-icon name="lucideChevronDown" class="text-muted-foreground size-3.5!" />
              </span>
            </div>
          } @else {
            <span [class]="captionLabelClasses()">{{ longMonthName() }}</span>
          }

          @if (showYearDropdown()) {
            <div data-slot="calendar-dropdown-root" [class]="dropdownRootClasses()">
              <select
                [class]="dropdownClasses()"
                [disabled]="disabled()"
                (change)="onYearChange($event)"
                aria-label="Choose the year"
              >
                @for (year of availableYears(); track year) {
                  <option [value]="year" [selected]="year.toString() === currentYear()">{{ year }}</option>
                }
              </select>

              <span [class]="captionLabelClasses()" aria-hidden="true">
                {{ currentYear() }}
                <ng-icon name="lucideChevronDown" class="text-muted-foreground size-3.5!" />
              </span>
            </div>
          } @else {
            <span [class]="captionLabelClasses()">{{ currentYear() }}</span>
          }
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideChevronDown, lucideChevronLeft, lucideChevronRight })],
  host: {
    class: 'block w-full',
  },
  exportAs: 'zCalendarNavigation',
})
export class ZardCalendarNavigationComponent {
  // Inputs
  readonly currentMonth = input.required<string>();
  readonly currentYear = input.required<string>();
  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);
  readonly disabled = input<boolean>(false);
  readonly zCaptionLayout = input<ZardCalendarCaptionLayout>('label');
  readonly zButtonVariant = input<ZardButtonTypeVariants>('ghost');
  /**
   * In a multi-month calendar only the first month owns the previous arrow and only the last
   * one owns the next arrow. The hidden side keeps a spacer so the caption stays centered.
   */
  readonly zShowPreviousButton = input(true, { transform: booleanAttribute });
  readonly zShowNextButton = input(true, { transform: booleanAttribute });

  // Outputs
  readonly monthChange = output<string>();
  readonly yearChange = output<string>();
  readonly previousMonth = output<void>();
  readonly nextMonth = output<void>();
  readonly months = calendarMonths;

  protected readonly navClasses = computed(() => mergeClasses(calendarNavVariants()));
  protected readonly navButtonClasses = computed(() => mergeClasses(calendarNavButtonVariants()));
  protected readonly navSpacerClasses = computed(() => mergeClasses(calendarNavSpacerVariants()));
  protected readonly captionClasses = computed(() => mergeClasses(calendarCaptionVariants()));
  protected readonly dropdownsClasses = computed(() => mergeClasses(calendarDropdownsVariants()));
  protected readonly dropdownRootClasses = computed(() => mergeClasses(calendarDropdownRootVariants()));
  protected readonly dropdownClasses = computed(() => mergeClasses(calendarDropdownVariants()));
  protected readonly captionLabelClasses = computed(() =>
    mergeClasses(calendarCaptionLabelVariants({ layout: this.zCaptionLayout() === 'label' ? 'label' : 'dropdown' })),
  );

  protected readonly showMonthDropdown = computed(() => {
    const layout = this.zCaptionLayout();
    return layout === 'dropdown' || layout === 'dropdown-months';
  });

  protected readonly showYearDropdown = computed(() => {
    const layout = this.zCaptionLayout();
    return layout === 'dropdown' || layout === 'dropdown-years';
  });

  protected readonly availableYears = computed(() => {
    const minYear = this.minDate()?.getFullYear() ?? new Date().getFullYear() - 10;
    const maxYear = this.maxDate()?.getFullYear() ?? new Date().getFullYear() + 10;
    const years = [];
    for (let i = minYear; i <= maxYear; i++) {
      years.push(i);
    }
    return years;
  });

  /** Index of the month the caption points at, falling back to the current one. */
  protected readonly selectedMonthIndex = computed(() => {
    const selectedMonth = Number.parseInt(this.currentMonth());
    return !Number.isNaN(selectedMonth) && this.months[selectedMonth] ? selectedMonth : new Date().getMonth();
  });

  protected readonly currentMonthName = computed(() => this.months[this.selectedMonthIndex()]);

  /** Full month name, used by the `label`, `dropdown-years` and `dropdown-months` captions. */
  protected readonly longMonthName = computed(() => {
    const parsedMonth = Number.parseInt(this.currentMonth());
    const month = Number.isNaN(parsedMonth) ? new Date().getMonth() : parsedMonth;

    return calendarMonthsLong[month] ?? calendarMonthsLong[new Date().getMonth()];
  });

  protected readonly monthYearLabel = computed(() => `${this.longMonthName()} ${this.currentYear()}`);

  protected readonly isPreviousDisabled = computed(() => {
    if (this.disabled()) {
      return true;
    }

    const minDate = this.minDate();
    if (!minDate) {
      return false;
    }

    const currentMonth = Number.parseInt(this.currentMonth());
    const currentYear = Number.parseInt(this.currentYear());
    const lastDayOfPreviousMonth = new Date(currentYear, currentMonth, 0);

    return lastDayOfPreviousMonth.getTime() < minDate.getTime();
  });

  protected readonly isNextDisabled = computed(() => {
    if (this.disabled()) {
      return true;
    }

    const maxDate = this.maxDate();
    if (!maxDate) {
      return false;
    }

    const currentMonth = Number.parseInt(this.currentMonth());
    const currentYear = Number.parseInt(this.currentYear());
    const nextMonth = new Date(currentYear, currentMonth + 1, 1);

    return nextMonth.getTime() > maxDate.getTime();
  });

  protected onPreviousClick(): void {
    this.previousMonth.emit();
  }

  protected onNextClick(): void {
    this.nextMonth.emit();
  }

  protected onMonthChange(event: Event): void {
    this.monthChange.emit((event.target as HTMLSelectElement).value);
  }

  protected onYearChange(event: Event): void {
    this.yearChange.emit((event.target as HTMLSelectElement).value);
  }
}
```

```angular-ts
/*
 * The alias, not a relative path: the Angular compiler re-emits these imports from
 * whichever module spreads the array, and it can only do that for a specifier the
 * consumer can resolve too. A relative path here fails with NG3004.
 */
import { ZardCalendarGridComponent } from '@/shared/components/calendar/calendar-grid.component';
import { ZardCalendarNavigationComponent } from '@/shared/components/calendar/calendar-navigation.component';
import { ZardCalendarComponent } from '@/shared/components/calendar/calendar.component';

/** Every part of the calendar component, for a template that uses more than one. */
export const ZardCalendarImports = [
  ZardCalendarComponent,
  ZardCalendarGridComponent,
  ZardCalendarNavigationComponent,
] as const;
```

```angular-ts
export type CalendarMode = 'single' | 'multiple' | 'range';
export type CalendarValue = Date | Date[] | null;

/**
 * How the month/year caption is rendered:
 *
 * - `label` — a single `"{Month} {Year}"` text
 * - `dropdown` — a month select plus a year select
 * - `dropdown-months` — a month select, year as text
 * - `dropdown-years` — month as text, a year select
 */
export type ZardCalendarCaptionLayout = 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years';

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
  /** Individual days that cannot be selected, on top of the min/max range. */
  disabledDates?: Date[];
}
```

```angular-ts
import type { CalendarDay, CalendarDayConfig, CalendarMode, CalendarValue } from './calendar.types';

export const calendarMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/**
 * Full month names used by the `label` caption. Hardcoded like `calendarMonths` and
 * `calendarWeekdays` so every string the calendar renders comes from the same language —
 * `toLocaleString` would follow the browser locale and mix languages inside the header.
 */
export const calendarMonthsLong = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const calendarWeekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

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
 * Checks if a date is disabled based on min/max constraints and on the
 * individually disabled days
 */
export function isDateDisabled(
  date: Date,
  minDate: Date | null,
  maxDate: Date | null,
  disabledDates?: Date[],
): boolean {
  if ((minDate && date < minDate) || (maxDate && date > maxDate)) {
    return true;
  }

  return !!disabledDates?.some(disabledDate => isSameDay(date, disabledDate));
}

/**
 * Generates calendar days for a given month with all selection states
 */
export function generateCalendarDays(config: CalendarDayConfig): CalendarDay[] {
  const { year, month, mode, selectedDates, minDate, maxDate, disabled, disabledDates } = config;

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
    const isDisabledDate = disabled || isDateDisabled(date, minDate, maxDate, disabledDates);

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
  if (!value) {
    return [];
  }

  if (mode === 'single') {
    return [value as Date];
  }

  if ((mode === 'multiple' || mode === 'range') && Array.isArray(value)) {
    return value;
  }

  return [];
}

/**
 * Generates a unique ID for a calendar day. `monthIndex` scopes the id when more than one
 * month is rendered, so the ids stay unique across the grids of a multi-month calendar.
 */
export function getDayId(index: number, monthIndex = 0): string {
  return monthIndex > 0 ? `calendar-m${monthIndex}-day-${index}` : `calendar-day-${index}`;
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

  const labels = [
    dateStr,
    day.isToday && 'Today',
    day.isSelected && 'Selected',
    day.isRangeStart && 'Range start',
    day.isRangeEnd && 'Range end',
    day.isInRange && 'In range',
    !day.isCurrentMonth && 'Outside month',
    day.isDisabled && 'Disabled',
  ].filter(Boolean);

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

/**
 * Normalizes any calendar value into a valid Date or array of Dates.
 * Returns null for empty values, validates single Dates, converts arrays,
 * and attempts to parse any other type into a Date.
 */
export function normalizeCalendarValue(v: CalendarValue): CalendarValue {
  if (!v) {
    return v;
  }

  if (v instanceof Date) {
    return toValidDate(v);
  }

  if (Array.isArray(v)) {
    return v.reduce<Date[]>((acc, d) => {
      const date = toValidDate(d);
      if (date) {
        acc.push(date);
      }
      return acc;
    }, []);
  }

  return toValidDate(v);
}

/**
 * Converts any value into a valid Date.
 * If it is already a Date, it is returned as is.
 * If the conversion fails, null should be returned.
 */
export function toValidDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'number' && value.toString().length === 8) {
    const s = value.toString();
    const y = +s.slice(0, 4);
    const m = +s.slice(4, 6) - 1;
    const d = +s.slice(6, 8);

    return makeSafeDate(y, m, d);
  }

  if (typeof value === 'string' && /^\d{8}$/.test(value)) {
    const y = +value.slice(0, 4);
    const m = +value.slice(4, 6) - 1;
    const d = +value.slice(6, 8);

    return makeSafeDate(y, m, d);
  }

  const date = new Date(value as string | number | Date);

  if (isNaN(date.getTime())) {
    return null;
  }

  return makeSafeDate(date.getFullYear(), date.getMonth(), date.getDate());
}
```

```angular-ts
export * from './calendar-grid.component';
export * from './calendar-navigation.component';
export * from './calendar.component';
export * from './calendar.imports';
export * from './calendar.types';
export * from './calendar.utils';
export * from './calendar.variants';
```

## Usage

```angular-ts
import { ZardCalendarComponent } from '@/shared/components/calendar/calendar.component';
```

```angular-html
<z-calendar zMode="single" class="rounded-lg border"></z-calendar>
```

## Examples

### Basic

The calendar renders without a border by default — add `class="rounded-lg border"` to frame it.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCalendarComponent } from '../calendar.component';

@Component({
  selector: 'z-demo-calendar-basic',
  imports: [ZardCalendarComponent],
  template: `
    <z-calendar zMode="single" class="rounded-lg border" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCalendarBasicComponent {}
```

### Range

Use `zMode="range"` to let users select a start and an end date, and `zNumberOfMonths` to show more than one month at a time.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

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
  template: `
    <z-calendar zMode="range" zNumberOfMonths="2" class="rounded-lg border" [(value)]="dateRange" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCalendarRangeComponent {
  readonly dateRange = signal<Date[] | null>([startOfRange(), addDays(startOfRange(), RANGE_LENGTH_IN_DAYS)]);
}
```

### Multiple

Use `zMode="multiple"` to select any number of individual dates.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardCalendarComponent } from '../calendar.component';

@Component({
  selector: 'z-demo-calendar-multiple',
  imports: [ZardCalendarComponent],
  template: `
    <div class="flex flex-col gap-4">
      <z-calendar zMode="multiple" class="rounded-lg border" [(value)]="selectedDates" />

      <p class="text-muted-foreground text-sm font-medium">Selected ({{ selectedDates()?.length ?? 0 }}) date(s).</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCalendarMultipleComponent {
  readonly selectedDates = signal<Date[] | null>(null);
}
```

### Presets

Compose the calendar with a `<z-card />` footer to offer quick date presets.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';

import { ZardCalendarComponent } from '../calendar.component';

interface CalendarPreset {
  label: string;
  days: number;
}

const PRESETS: CalendarPreset[] = [
  { label: 'Today', days: 0 },
  { label: 'Tomorrow', days: 1 },
  { label: 'In 3 days', days: 3 },
  { label: 'In a week', days: 7 },
  { label: 'In 2 weeks', days: 14 },
];

@Component({
  selector: 'z-demo-calendar-presets',
  imports: [ZardCalendarComponent, ZardButtonComponent, ZardCardImports],
  template: `
    <z-card zSize="sm" class="mx-auto w-fit max-w-[300px]">
      <z-card-content>
        <z-calendar zMode="single" class="p-0 [--cell-size:--spacing(9.5)]" [(value)]="selectedDate" />
      </z-card-content>
      <z-card-footer zFooterBorder class="flex flex-wrap gap-2">
        @for (preset of presets; track preset.days) {
          <button z-button type="button" zType="outline" zSize="sm" class="flex-1" (click)="selectPreset(preset)">
            {{ preset.label }}
          </button>
        }
      </z-card-footer>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCalendarPresetsComponent {
  readonly presets = PRESETS;
  readonly selectedDate = signal<Date | null>(new Date());

  selectPreset(preset: CalendarPreset): void {
    const date = new Date();
    date.setDate(date.getDate() + preset.days);
    this.selectedDate.set(date);
  }
}
```

### With Time

Pair the calendar with time inputs to build a date and time picker.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideClock2 } from '@ng-icons/lucide';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';

import { ZardCalendarComponent } from '../calendar.component';

@Component({
  selector: 'z-demo-calendar-with-time',
  imports: [
    ZardCalendarComponent,
    ZardCardImports,
    ZardFieldImports,
    ZardInputGroupImports,
    ZardInputComponent,
    NgIcon,
  ],
  template: `
    <z-card zSize="sm" class="mx-auto w-fit">
      <z-card-content>
        <z-calendar zMode="single" class="p-0" [(value)]="selectedDate" />
      </z-card-content>
      <z-card-footer zFooterBorder>
        <div z-field-group>
          <div z-field>
            <label z-field-label for="calendar-time-from">Start Time</label>
            <z-input-group>
              <input
                z-input
                id="calendar-time-from"
                type="time"
                step="1"
                value="10:30:00"
                class="appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
              />
              <z-input-group-addon>
                <ng-icon name="lucideClock2" class="text-muted-foreground" />
              </z-input-group-addon>
            </z-input-group>
          </div>

          <div z-field>
            <label z-field-label for="calendar-time-to">End Time</label>
            <z-input-group>
              <input
                z-input
                id="calendar-time-to"
                type="time"
                step="1"
                value="12:30:00"
                class="appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
              />
              <z-input-group-addon>
                <ng-icon name="lucideClock2" class="text-muted-foreground" />
              </z-input-group-addon>
            </z-input-group>
          </div>
        </div>
      </z-card-footer>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideClock2 })],
})
export class ZardDemoCalendarWithTimeComponent {
  readonly selectedDate = signal<Date | null>(new Date());
}
```

### Booked Dates

Use `zDisabledDates` to block individual days — here they are struck through to read as booked.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardCalendarComponent } from '../calendar.component';

const FIRST_BOOKED_DAY = 8;
const BOOKED_DAYS_COUNT = 12;

function bookedDatesOfCurrentMonth(): Date[] {
  const today = new Date();

  return Array.from(
    { length: BOOKED_DAYS_COUNT },
    (_, index) => new Date(today.getFullYear(), today.getMonth(), FIRST_BOOKED_DAY + index),
  );
}

@Component({
  selector: 'z-demo-calendar-booked-dates',
  imports: [ZardCalendarComponent],
  template: `
    <z-calendar
      zMode="single"
      class="rounded-lg border shadow-sm [&_[data-disabled=true]_button]:line-through [&_[data-disabled=true]_button]:opacity-100"
      [zDisabledDates]="bookedDates"
      [(value)]="selectedDate"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCalendarBookedDatesComponent {
  readonly bookedDates = bookedDatesOfCurrentMonth();
  readonly selectedDate = signal<Date | null>(null);
}
```

### Custom Cell Size

Override the `--cell-size` CSS variable to resize the whole calendar.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';

import { ZardCalendarComponent } from '../calendar.component';

@Component({
  selector: 'z-demo-calendar-custom-cell-size',
  imports: [ZardCalendarComponent, ZardCardImports],
  template: `
    <z-card zSize="sm" class="mx-auto w-fit">
      <z-card-content>
        <z-calendar
          zMode="range"
          zCaptionLayout="dropdown"
          class="p-0 [--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
          [(value)]="dateRange"
        />
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCalendarCustomCellSizeComponent {
  readonly dateRange = signal<Date[] | null>(null);
}
```

```angular-html
<!-- Scale every measurement with the Tailwind spacing scale. -->
<z-calendar class="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]" />
```

```angular-html
<!-- Or use fixed values. -->
<z-calendar class="rounded-lg border [--cell-size:2.75rem] md:[--cell-size:3rem]" />
```

### With Constraints

Use `minDate` and `maxDate` to limit the selectable range, or `disabled` to turn the whole calendar off.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCalendarComponent } from '../calendar.component';

const DAYS_IN_FUTURE = 30;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

@Component({
  selector: 'z-demo-calendar-with-constraints',
  imports: [ZardCalendarComponent],
  template: `
    <div class="flex flex-wrap items-start justify-center gap-6">
      <z-calendar zMode="single" class="rounded-lg border" [minDate]="minDate" [maxDate]="maxDate" />

      <z-calendar zMode="single" class="rounded-lg border" [disabled]="true" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCalendarWithConstraintsComponent {
  readonly minDate = new Date();
  readonly maxDate = new Date(Date.now() + DAYS_IN_FUTURE * MILLISECONDS_PER_DAY);

  constructor() {
    this.minDate.setHours(0, 0, 0, 0);
    this.maxDate.setHours(23, 59, 59, 999);
  }
}
```

### Expand Year Selection Range

`minDate` and `maxDate` also expand the year dropdown — useful for a date of birth picker.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardCalendarComponent } from '../calendar.component';

const BIRTH_YEAR_FLOOR = 1950;

@Component({
  selector: 'z-demo-calendar-expand-year-selection-range',
  imports: [ZardCalendarComponent],
  template: `
    <z-calendar
      zMode="single"
      zCaptionLayout="dropdown"
      class="rounded-lg border"
      [minDate]="minDate"
      [maxDate]="maxDate"
      [(value)]="dateOfBirth"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCalendarExpandYearSelectionRangeComponent {
  readonly minDate = new Date(BIRTH_YEAR_FLOOR, 0, 1);
  readonly maxDate = new Date();
  readonly dateOfBirth = signal<Date | null>(null);
}
```

## API Reference

### z-calendar

A calendar component that allows users to select a date or a range of dates, with full keyboard navigation support. Every measurement derives from the --cell-size and --cell-radius CSS variables listed at the end of the table, so overriding them through the class input rescales the whole calendar.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes. Also where a border is opted into (`rounded-lg border`) and where the CSS variables below are overridden | `ClassValue` | `''` |
| `[zMode]` | Selection mode of the calendar | `'single' \| 'multiple' \| 'range'` | `'single'` |
| `[value]` | Currently selected date(s) - type depends on mode | `CalendarValue` | `null` |
| `[minDate]` | Minimum selectable date. Also used to expand the year picker range | `Date \| null` | `null` |
| `[maxDate]` | Maximum selectable date. Also used to expand the year picker range | `Date \| null` | `null` |
| `[disabled]` | Whether the calendar is disabled | `boolean` | `false` |
| `[zCaptionLayout]` | How the month/year caption is rendered: a plain label, two dropdowns, or a dropdown for only the month or only the year. The dropdowns are native `<select>` elements laid invisible over the label, so the browser owns the popup | `'label' \| 'dropdown' \| 'dropdown-months' \| 'dropdown-years'` | `'label'` |
| `[zButtonVariant]` | Button variant used by the previous/next month arrows | `ZardButtonTypeVariants` | `'ghost'` |
| `[zShowOutsideDays]` | Whether the days of the surrounding months are visible. When false they are hidden but keep their grid cell, so the layout never shifts | `boolean` | `true` |
| `[zDisabledDates]` | Individual days that cannot be selected, on top of the minDate/maxDate range. Each day still keeps its grid cell and is marked with `data-disabled="true"` | `Date[]` | `[]` |
| `[zNumberOfMonths]` | How many months are rendered side by side. They stack vertically below the `md` breakpoint, and only the first and the last month carry the navigation arrows | `number` | `1` |
| `(dateChange)` | Emitted when date selection changes | `EventEmitter<Date \| Date[]>` | `-` |
| `resetNavigation()` | Public method that moves the visible month back to the selected value and clears the roving focus | `() => void` | `-` |
| `[--cell-size]` | CSS variable: width and height of a day cell, e.g. `class="[--cell-size:--spacing(12)]"` | `length` | `--spacing(7)` |
| `[--cell-radius]` | CSS variable: corner radius of a day cell, e.g. `class="[--cell-radius:var(--radius-lg)]"` | `length` | `var(--radius-md)` |

---

[Open in browser](https://zardui.com/docs/components/calendar)
