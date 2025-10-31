import { ChangeDetectionStrategy, Component, computed, ElementRef, HostListener, input, output, signal, viewChild, ViewEncapsulation } from '@angular/core';

import type { CalendarDay } from './calendar.types';
import { getDayAriaLabel, getDayId } from './calendar.utils';
import { calendarDayButtonVariants, calendarDayVariants, calendarWeekdayVariants } from './calendar.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-calendar-grid',
  exportAs: 'zCalendarGrid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[attr.role]': '"grid"',
  },
  template: `
    <div #gridContainer>
      <!-- Weekdays Header -->
      <div class="grid grid-cols-7 text-center w-fit" role="row">
        @for (weekday of weekdays; track $index) {
          <div [class]="weekdayClasses()" role="columnheader">
            {{ weekday }}
          </div>
        }
      </div>

      <!-- Calendar Days Grid -->
      <div class="grid grid-cols-7 gap-0 mt-2 auto-rows-min w-fit" role="rowgroup">
        @for (day of calendarDays(); track day.date.getTime(); let i = $index) {
          <div [class]="dayContainerClasses()" role="gridcell">
            <button
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
    if (this.disabled()) return;
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

  @HostListener('keydown', ['$event'])
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
          this.previousYear.emit();
        } else {
          this.previousMonth.emit({ position: 'default', dayOfWeek: -1 });
        }
        return;
      case 'PageDown':
        event.preventDefault();
        if (event.ctrlKey) {
          this.nextYear.emit();
        } else {
          this.nextMonth.emit({ position: 'default', dayOfWeek: -1 });
        }
        return;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const focusedDay = days[currentIndex];
        if (focusedDay && !focusedDay.isDisabled) {
          this.dateSelect.emit({ date: focusedDay.date, index: currentIndex });
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
      const dayElement = this.gridContainer()?.nativeElement.querySelector(`#${getDayId(index)}`) as HTMLElement;
      dayElement?.focus();
    }, 0);
  }
}
