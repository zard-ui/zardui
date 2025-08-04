import { ChangeDetectionStrategy, Component, computed, input, output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { ZardButtonComponent } from '../button/button.component';
import { ZardCalendarComponent } from '../calendar/calendar.component';
import { ZardPopoverComponent, ZardPopoverDirective } from '../popover/popover.component';
import { datePickerVariants, ZardDatePickerVariants } from './date-picker.variants';

import type { ClassValue } from '../../shared/utils/utils';

export type { ZardDatePickerVariants };

@Component({
  selector: 'z-date-picker, [z-date-picker]',
  exportAs: 'zDatePicker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ZardButtonComponent, ZardCalendarComponent, ZardPopoverComponent, ZardPopoverDirective],
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
      <i class="icon-calendar"></i>
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
})
export class ZardDatePickerComponent {
  @ViewChild('calendarTemplate', { static: true }) calendarTemplate!: TemplateRef<unknown>;
  @ViewChild('popoverDirective', { static: true }) popoverDirective!: ZardPopoverDirective;
  @ViewChild('calendar', { static: false }) calendar!: ZardCalendarComponent;

  readonly class = input<ClassValue>('');
  readonly zType = input<ZardDatePickerVariants['zType']>('outline');
  readonly zSize = input<ZardDatePickerVariants['zSize']>('default');
  readonly value = input<Date | null>(null);
  readonly placeholder = input<string>('Pick a date');
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
    return mergeClasses(
      'justify-start text-left font-normal',
      !hasValue && 'text-muted-foreground',
      this.zSize() === 'sm' ? 'h-8' : this.zSize() === 'lg' ? 'h-12' : 'h-10',
      'min-w-[240px]',
    );
  });

  protected readonly textClasses = computed(() => {
    const hasValue = !!this.value();
    return mergeClasses(!hasValue && 'text-muted-foreground');
  });

  protected readonly popoverClasses = computed(() => mergeClasses('w-auto p-0'));

  protected readonly calendarSize = computed(() => {
    const size = this.zSize();
    if (size === 'sm') return 'sm';
    if (size === 'lg') return 'lg';
    return 'default';
  });

  protected readonly displayText = computed(() => {
    const date = this.value();
    if (!date) {
      return this.placeholder();
    }
    return this.formatDate(date);
  });

  protected onDateChange(date: Date): void {
    this.dateChange.emit(date);
    // Close popover after selection using direct method call
    this.popoverDirective.hide();
  }

  protected onPopoverVisibilityChange(visible: boolean): void {
    if (visible) {
      // Reset calendar navigation when opening to show correct month/year
      setTimeout(() => {
        if (this.calendar) {
          this.calendar.resetNavigation();
        }
      });
    }
  }

  private formatDate(date: Date): string {
    // Simple date formatting without external dependencies
    // Format: "January 15, 2024"
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
  }
}
