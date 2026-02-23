import {
  ChangeDetectionStrategy,
  Component,
  computed,
  type ElementRef,
  input,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { mergeClasses } from '@/shared/utils/merge-classes';

import type { CalendarDay } from './calendar.types';
import { calendarWeekdays, getDayAriaLabel, getDayId } from './calendar.utils';
import { calendarDayButtonVariants, calendarDayVariants, calendarWeekdayVariants } from './calendar.variants';

@Component({
  selector: 'z-calendar-grid',
  template: `
    <div #gridContainer>
      <!-- Weekdays Header -->
      <div class="grid w-fit grid-cols-7 text-center" role="row">
        @for (weekday of weekdays; track weekday) {
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
    class: 'flex justify-center',
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
  readonly navigateYear = output<number>();

  readonly weekdays = calendarWeekdays;

  private readonly focusedDayIndex = signal<number>(-1);

  protected readonly weekdayClasses = computed(() => mergeClasses(calendarWeekdayVariants()));

  protected readonly dayContainerClasses = computed(() => mergeClasses(calendarDayVariants()));

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
      const dayElement = this.gridContainer()?.nativeElement.querySelector(`#${getDayId(index)}`) as HTMLElement;
      dayElement?.focus();
    }, 0);
  }
}
