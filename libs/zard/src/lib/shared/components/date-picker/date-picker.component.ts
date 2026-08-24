import { DatePipe } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  model,
  numberAttribute,
  output,
  viewChild,
  ViewEncapsulation,
  type TemplateRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendar, lucideChevronDown } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import { ZardButtonComponent, type ZardButtonTypeVariants } from '@/shared/components/button';
import { ZardCalendarComponent } from '@/shared/components/calendar';
import type {
  CalendarMode,
  CalendarValue,
  ZardCalendarCaptionLayout,
} from '@/shared/components/calendar/calendar.types';
import { normalizeCalendarValue } from '@/shared/components/calendar/calendar.utils';
import {
  datePickerTriggerVariants,
  datePickerVariants,
  type ZardDatePickerIconVariants,
  type ZardDatePickerSizeVariants,
} from '@/shared/components/date-picker/date-picker.variants';
import { ZardPopoverComponent, ZardPopoverDirective, type ZardPopoverAlign } from '@/shared/components/popover';
import { mergeClasses } from '@/shared/utils/merge-classes';
import { noopFn } from '@/shared/utils/noop';

/** Separates the two ends of a range in the trigger label. */
const RANGE_SEPARATOR = ' - ';

@Component({
  selector: 'z-date-picker, [z-date-picker]',
  imports: [NgIcon, ZardButtonComponent, ZardCalendarComponent, ZardPopoverComponent, ZardPopoverDirective],
  template: `
    <button
      z-button
      type="button"
      [attr.id]="zId() || null"
      [zType]="zType()"
      [zSize]="zSize()"
      [zDisabled]="disabled()"
      [class]="triggerClasses()"
      [attr.data-empty]="isEmpty() ? 'true' : null"
      [attr.aria-label]="zId() ? null : 'Choose date'"
      zPopover
      #popoverDirective="zPopover"
      [zContent]="calendarTemplate"
      zTrigger="click"
      [zAlign]="zAlign()"
      (zVisibleChange)="onPopoverVisibilityChange($event)"
    >
      @if (zIcon() === 'calendar') {
        <ng-icon name="lucideCalendar" class="size-4!" data-icon="inline-start" />
      }
      <span class="min-w-0 truncate">{{ displayText() }}</span>
      @if (zIcon() === 'chevron') {
        <ng-icon name="lucideChevronDown" class="size-4!" data-icon="inline-end" />
      }
    </button>

    <ng-template #calendarTemplate>
      <z-popover aria-label="Choose date" class="w-auto overflow-hidden p-0">
        <!-- The popover content is p-0, so the calendar's own p-2 provides the padding. -->
        <z-calendar
          #calendar
          [zMode]="zMode()"
          [zCaptionLayout]="zCaptionLayout()"
          [zNumberOfMonths]="zNumberOfMonths()"
          [zDisabledDates]="zDisabledDates()"
          [zShowOutsideDays]="zShowOutsideDays()"
          [value]="value()"
          [minDate]="minDate()"
          [maxDate]="maxDate()"
          [disabled]="disabled()"
          (valueChange)="onCalendarValueChange($event)"
        />
      </z-popover>
    </ng-template>
  `,
  providers: [
    DatePipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardDatePickerComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideCalendar, lucideChevronDown })],
  host: {
    'data-slot': 'date-picker',
    '[class]': 'classes()',
    '[attr.data-empty]': "isEmpty() ? 'true' : null",
  },
  exportAs: 'zDatePicker',
})
export class ZardDatePickerComponent implements ControlValueAccessor {
  private readonly datePipe = inject(DatePipe);

  readonly calendarTemplate = viewChild.required<TemplateRef<unknown>>('calendarTemplate');
  readonly popoverDirective = viewChild.required<ZardPopoverDirective>('popoverDirective');
  /** Only resolves while the popover is open — the calendar lives in a lazily rendered template. */
  readonly calendar = viewChild<ZardCalendarComponent>('calendar');

  readonly class = input<ClassValue>('');
  /** Applied to the trigger button, so a `<label for="…">` points at something focusable. */
  readonly zId = input<string>('');
  readonly zType = input<ZardButtonTypeVariants>('outline');
  readonly zSize = input<ZardDatePickerSizeVariants>('default');
  readonly zIcon = input<ZardDatePickerIconVariants>('chevron');
  readonly value = model<CalendarValue>(null);
  readonly zPlaceholder = input<string>('Pick a date');
  readonly zFormat = input<string>('MMMM d, yyyy');
  readonly zMode = input<CalendarMode>('single');
  readonly zCaptionLayout = input<ZardCalendarCaptionLayout>('label');
  readonly zNumberOfMonths = input(1, { transform: numberAttribute });
  readonly zDisabledDates = input<Date[]>([]);
  readonly zShowOutsideDays = input(true, { transform: booleanAttribute });
  readonly zAlign = input<ZardPopoverAlign>('start');
  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);
  readonly disabled = model<boolean>(false);

  readonly dateChange = output<CalendarValue>();

  private onChange: (value: CalendarValue) => void = noopFn;
  private onTouched: () => void = noopFn;

  protected readonly classes = computed(() => mergeClasses(datePickerVariants(), this.class()));

  protected readonly triggerClasses = computed(() => datePickerTriggerVariants({ zIcon: this.zIcon() }));

  /** The value flattened to a list, whatever the mode — empty when nothing is selected. */
  private readonly selectedDates = computed(() => {
    const value = normalizeCalendarValue(this.value());
    if (!value) {
      return [];
    }
    return Array.isArray(value) ? value : [value];
  });

  protected readonly isEmpty = computed(() => this.selectedDates().length === 0);

  protected readonly displayText = computed(() => {
    const dates = this.selectedDates();
    if (!dates.length) {
      return this.zPlaceholder();
    }

    const format = this.zFormat();
    if (this.zMode() === 'range') {
      const [from, to] = dates;
      return to
        ? `${this.formatDate(from, format)}${RANGE_SEPARATOR}${this.formatDate(to, format)}`
        : this.formatDate(from, format);
    }

    return dates.map(date => this.formatDate(date, format)).join(', ');
  });

  protected onCalendarValueChange(value: CalendarValue): void {
    this.value.set(value);
    this.onChange(value);
    this.onTouched();
    this.dateChange.emit(value);

    if (this.shouldCloseOnSelect(value)) {
      this.popoverDirective().hide();
    }
  }

  /** Single mode closes on pick, range once both ends are set, multiple stays open. */
  private shouldCloseOnSelect(value: CalendarValue): boolean {
    switch (this.zMode()) {
      case 'single':
        return value !== null;
      case 'range':
        return Array.isArray(value) && value.length >= 2;
      default:
        return false;
    }
  }

  protected onPopoverVisibilityChange(visible: boolean): void {
    if (!visible) {
      return;
    }

    // The calendar is only created once the popover renders, hence the deferral.
    setTimeout(() => this.calendar()?.resetNavigation());
  }

  private formatDate(date: Date, format: string): string {
    return this.datePipe.transform(date, format) ?? '';
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
