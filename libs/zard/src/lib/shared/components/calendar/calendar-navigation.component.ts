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
