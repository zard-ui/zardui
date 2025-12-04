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
    const minYear = this.minDate()?.getFullYear() ?? new Date().getFullYear() - 10;
    const maxYear = this.maxDate()?.getFullYear() ?? new Date().getFullYear() + 10;
    const years = [];
    for (let i = minYear; i <= maxYear; i++) {
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
