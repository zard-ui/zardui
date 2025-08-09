

```angular-ts title="date-picker.component.ts" copyButton showLineNumbers
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';

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
  providers: [DatePipe],
})
export class ZardDatePickerComponent {
  private readonly datePipe = inject(DatePipe);

  @ViewChild('calendarTemplate', { static: true }) calendarTemplate!: TemplateRef<unknown>;
  @ViewChild('popoverDirective', { static: true }) popoverDirective!: ZardPopoverDirective;
  @ViewChild('calendar', { static: false }) calendar!: ZardCalendarComponent;

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
    return this.formatDate(date, this.zFormat());
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

  private formatDate(date: Date, format: string): string {
    return this.datePipe.transform(date, format) || '';
  }
}

```



```angular-ts title="date-picker.variants.ts" copyButton showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

const datePickerVariants = cva('', {
  variants: {
    zSize: {
      sm: '',
      default: '',
      lg: '',
    },
    zType: {
      default: '',
      outline: '',
      ghost: '',
    },
  },
  defaultVariants: {
    zSize: 'default',
    zType: 'outline',
  },
});

export { datePickerVariants };
export type ZardDatePickerVariants = VariantProps<typeof datePickerVariants>;

```

