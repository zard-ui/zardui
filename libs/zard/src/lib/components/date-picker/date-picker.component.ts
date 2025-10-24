import { ChangeDetectionStrategy, Component, computed, inject, input, output, TemplateRef, viewChild, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ZardPopoverComponent, ZardPopoverDirective } from '../popover/popover.component';
import { datePickerVariants, ZardDatePickerVariants } from './date-picker.variants';
import { ZardCalendarComponent } from '../calendar/calendar.component';
import { ZardButtonComponent } from '../button/button.component';
import { ZardIconComponent } from '../icon/icon.component';
import { mergeClasses } from '../../shared/utils/utils';

import type { ClassValue } from 'clsx';

const HEIGHT_BY_SIZE: Record<NonNullable<ZardDatePickerVariants['zSize']>, string> = {
  sm: 'h-8',
  default: 'h-10',
  lg: 'h-12',
};

@Component({
  selector: 'z-date-picker, [z-date-picker]',
  exportAs: 'zDatePicker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ZardButtonComponent, ZardCalendarComponent, ZardPopoverComponent, ZardPopoverDirective, ZardIconComponent],
  host: {},
  template: `
    <button
      z-button
      [zType]="zType()"
      [zSize]="zSize()"
      [disabled]="disabled()"
      [class]="buttonClasses()"
      zPopover
      #popoverDirective="zPopover"
      [zContent]="calendarTemplate"
      zTrigger="click"
      (zVisibleChange)="onPopoverVisibilityChange($event)"
      [attr.aria-expanded]="false"
      [attr.aria-haspopup]="true"
      aria-label="Choose date"
    >
      <z-icon zType="calendar" />
      <span [class]="textClasses()">
        {{ displayText() }}
      </span>
    </button>

    <ng-template #calendarTemplate>
      <z-popover [class]="popoverClasses()">
        <z-calendar #calendar [zSize]="calendarSize()" [value]="value()" [minDate]="minDate()" [maxDate]="maxDate()" [disabled]="disabled()" (dateChange)="onDateChange($event)" />
      </z-popover>
    </ng-template>
  `,
  providers: [DatePipe],
})
export class ZardDatePickerComponent {
  private readonly datePipe = inject(DatePipe);

  readonly calendarTemplate = viewChild.required<TemplateRef<unknown>>('calendarTemplate');
  readonly popoverDirective = viewChild.required<ZardPopoverDirective>('popoverDirective');
  readonly calendar = viewChild.required<ZardCalendarComponent>('calendar');

  readonly class = input<ClassValue>('');
  readonly zType = input<ZardDatePickerVariants['zType']>('outline');
  readonly zSize = input<ZardDatePickerVariants['zSize']>('default');
  readonly value = input<Date | null>(null);
  readonly placeholder = input<string>('Pick a date');
  readonly zFormat = input<string>('MMMM d, yyyy');
  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);
  readonly disabled = input<boolean>(false);

  readonly dateChange = output<Date | null>();

  protected readonly classes = computed(() =>
    mergeClasses(
      datePickerVariants({
        zSize: this.zSize(),
      }),
      this.class(),
    ),
  );

  protected readonly buttonClasses = computed(() => {
    const hasValue = !!this.value();
    const size: NonNullable<ZardDatePickerVariants['zSize']> = this.zSize() ?? 'default';
    const height = HEIGHT_BY_SIZE[size];
    return mergeClasses('justify-start text-left font-normal', !hasValue && 'text-muted-foreground', height, 'min-w-[240px]');
  });

  protected readonly textClasses = computed(() => {
    const hasValue = !!this.value();
    return mergeClasses(!hasValue && 'text-muted-foreground');
  });

  protected readonly popoverClasses = computed(() => mergeClasses('w-auto p-0'));

  protected readonly calendarSize = computed(() => this.zSize() ?? 'default');

  protected readonly displayText = computed(() => {
    const date = this.value();
    if (!date) {
      return this.placeholder();
    }
    return this.formatDate(date, this.zFormat());
  });

  protected onDateChange(date: Date): void {
    this.dateChange.emit(date);
    // Close popover after selection using direct method call
    this.popoverDirective().hide();
  }

  protected onPopoverVisibilityChange(visible: boolean): void {
    if (visible) {
      // Reset calendar navigation when opening to show correct month/year
      setTimeout(() => {
        if (this.calendar()) {
          this.calendar().resetNavigation();
        }
      });
    }
  }

  private formatDate(date: Date, format: string): string {
    return this.datePipe.transform(date, format) ?? '';
  }
}
