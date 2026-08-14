---
title: Date Picker
description: A date picker component with range and presets.
---

# Date Picker

A date picker component with range and presets.

## Installation

### CLI

```bash
npx zard-cli@latest add date-picker
```

### Manual

```angular-ts
import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  model,
  output,
  viewChild,
  ViewEncapsulation,
  type TemplateRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendar } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import { ZardButtonComponent, type ZardButtonTypeVariants } from '@/shared/components/button';
import { ZardCalendarComponent } from '@/shared/components/calendar';
import type { ZardDatePickerSizeVariants } from '@/shared/components/date-picker/date-picker.variants';
import { ZardPopoverComponent, ZardPopoverDirective } from '@/shared/components/popover';
import { mergeClasses, noopFn } from '@/shared/utils/merge-classes';

/**
 * Height overrides for date-picker sizes.
 *
 * These heights intentionally differ from button size variants to accommodate
 * the date-picker UI:
 * - default: h-9 (vs button h-8)
 * - lg: h-11 (vs button h-9)
 *
 * The `mergeClasses` utility (tailwind-merge) resolves class conflicts,
 * allowing these values to override the base button heights defined in
 * `ZardDatePickerSizeVariants`.
 */
const HEIGHT_BY_SIZE: Record<ZardDatePickerSizeVariants, string> = {
  xs: 'h-7',
  sm: 'h-8',
  default: 'h-9',
  lg: 'h-11',
};

@Component({
  selector: 'z-date-picker, [z-date-picker]',
  imports: [NgIcon, ZardButtonComponent, ZardCalendarComponent, ZardPopoverComponent, ZardPopoverDirective],
  template: `
    <button
      z-button
      type="button"
      [zType]="zType()"
      [zSize]="zSize()"
      [disabled]="disabled()"
      [class]="buttonClasses()"
      zPopover
      #popoverDirective="zPopover"
      [zContent]="calendarTemplate"
      zTrigger="click"
      (zVisibleChange)="onPopoverVisibilityChange($event)"
      aria-label="Choose date"
    >
      <ng-icon name="lucideCalendar" class="size-4!" />
      <span [class]="textClasses()">
        {{ displayText() }}
      </span>
    </button>

    <ng-template #calendarTemplate>
      <z-popover aria-label="Choose date" [class]="popoverClasses()">
        <z-calendar
          #calendar
          class="border-0"
          [value]="value()"
          [minDate]="minDate()"
          [maxDate]="maxDate()"
          [disabled]="disabled()"
          (dateChange)="onDateChange($event)"
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
  viewProviders: [provideIcons({ lucideCalendar })],
  host: {
    '[class]': 'class()',
  },
  exportAs: 'zDatePicker',
})
export class ZardDatePickerComponent implements ControlValueAccessor {
  private readonly datePipe = inject(DatePipe);

  readonly calendarTemplate = viewChild.required<TemplateRef<unknown>>('calendarTemplate');
  readonly popoverDirective = viewChild.required<ZardPopoverDirective>('popoverDirective');
  readonly calendar = viewChild.required<ZardCalendarComponent>('calendar');

  readonly class = input<ClassValue>('');
  readonly zType = input<ZardButtonTypeVariants>('outline');
  readonly zSize = input<ZardDatePickerSizeVariants>('default');
  readonly value = model<Date | null>(null);
  readonly placeholder = input<string>('Pick a date');
  readonly zFormat = input<string>('MMMM d, yyyy');
  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);
  readonly disabled = model<boolean>(false);

  readonly dateChange = output<Date | null>();

  private onChange: (value: Date | null) => void = noopFn;
  private onTouched: () => void = noopFn;

  protected readonly buttonClasses = computed(() => {
    const hasValue = !!this.value();
    const size = this.zSize();
    const height = HEIGHT_BY_SIZE[size];
    return mergeClasses(
      'justify-start text-left font-normal',
      !hasValue && 'text-muted-foreground',
      height,
      'min-w-[240px]',
    );
  });

  protected readonly textClasses = computed(() => {
    const hasValue = !!this.value();
    return mergeClasses(!hasValue && 'text-muted-foreground');
  });

  protected readonly popoverClasses = computed(() => mergeClasses('w-auto p-0'));

  protected readonly displayText = computed(() => {
    const date = this.value();
    if (!date) {
      return this.placeholder();
    }
    return this.formatDate(date, this.zFormat());
  });

  protected onDateChange(date: Date | Date[]): void {
    // Date picker always uses single mode, so we can safely cast
    const singleDate = Array.isArray(date) ? (date[0] ?? null) : date;
    this.value.set(singleDate);
    this.onChange(singleDate);
    this.onTouched();
    this.dateChange.emit(singleDate);

    this.popoverDirective().hide();
  }

  protected onPopoverVisibilityChange(visible: boolean): void {
    if (visible) {
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

  writeValue(value: Date | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: Date | null) => void): void {
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

export const datePickerVariants = cva('', {
  variants: {
    zSize: {
      xs: '',
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

export type ZardDatePickerSizeVariants = NonNullable<VariantProps<typeof datePickerVariants>['zSize']>;
```

```angular-ts
export * from './date-picker.component';
export * from './date-picker.variants';
```

## Usage

```angular-ts
import { ZardDatePickerComponent } from '@/shared/components/date-picker/date-picker.component';
```

```angular-html
<z-date-picker placeholder="Pick a date"></z-date-picker>
```

## Examples

### Default

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardDatePickerComponent } from '../date-picker.component';

@Component({
  selector: 'zard-demo-date-picker-default',
  imports: [ZardDatePickerComponent],
  standalone: true,
  template: `
    <z-date-picker [value]="selectedDate()" placeholder="Pick a date" (dateChange)="onDateChange($event)" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDatePickerDefaultComponent {
  readonly selectedDate = signal<Date | null>(null);

  onDateChange(date: Date | null) {
    this.selectedDate.set(date);
    console.log('Selected date:', date);
  }
}
```

### Sizes

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardDatePickerComponent } from '../date-picker.component';

@Component({
  selector: 'zard-demo-date-picker-sizes',
  imports: [ZardDatePickerComponent],
  standalone: true,
  template: `
    <div class="flex flex-col gap-4">
      <div class="space-y-2">
        <h4 class="text-sm font-medium">Small</h4>
        <z-date-picker
          zSize="sm"
          [value]="selectedDateSm()"
          placeholder="Pick a date"
          (dateChange)="onDateChangeSm($event)"
        />
      </div>

      <div class="space-y-2">
        <h4 class="text-sm font-medium">Default</h4>
        <z-date-picker
          zSize="default"
          [value]="selectedDateDefault()"
          placeholder="Pick a date"
          (dateChange)="onDateChangeDefault($event)"
        />
      </div>

      <div class="space-y-2">
        <h4 class="text-sm font-medium">Large</h4>
        <z-date-picker
          zSize="lg"
          [value]="selectedDateLg()"
          placeholder="Pick a date"
          (dateChange)="onDateChangeLg($event)"
        />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDatePickerSizesComponent {
  readonly selectedDateSm = signal<Date | null>(null);
  readonly selectedDateDefault = signal<Date | null>(null);
  readonly selectedDateLg = signal<Date | null>(null);

  onDateChangeSm(date: Date | null) {
    this.selectedDateSm.set(date);
    console.log('Selected date (sm):', date);
  }

  onDateChangeDefault(date: Date | null) {
    this.selectedDateDefault.set(date);
    console.log('Selected date (default):', date);
  }

  onDateChangeLg(date: Date | null) {
    this.selectedDateLg.set(date);
    console.log('Selected date (lg):', date);
  }
}
```

### Formats

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardDatePickerComponent } from '../date-picker.component';

@Component({
  selector: 'z-date-picker-formats-demo',
  imports: [ZardDatePickerComponent],
  standalone: true,
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium">Default Format (MMMM d, yyyy)</label>
        <z-date-picker [value]="selectedDate" (dateChange)="selectedDate = $event" />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium">US Format (MM/dd/yyyy)</label>
        <z-date-picker [value]="selectedDate" (dateChange)="selectedDate = $event" zFormat="MM/dd/yyyy" />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium">European Format (dd-MM-yyyy)</label>
        <z-date-picker [value]="selectedDate" (dateChange)="selectedDate = $event" zFormat="dd-MM-yyyy" />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium">Short Format (MMM d, yy)</label>
        <z-date-picker [value]="selectedDate" (dateChange)="selectedDate = $event" zFormat="MMM d, yy" />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium">With Day Name (EEE, MMMM d)</label>
        <z-date-picker [value]="selectedDate" (dateChange)="selectedDate = $event" zFormat="EEE, MMMM d" />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium">ISO Format (yyyy-MM-dd)</label>
        <z-date-picker [value]="selectedDate" (dateChange)="selectedDate = $event" zFormat="yyyy-MM-dd" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDatePickerFormatsComponent {
  selectedDate: Date | null = new Date();
}

export default ZardDatePickerFormatsComponent;
```

## API Reference

### z-date-picker

A date picker component that provides an intuitive interface for date selection through a button trigger and calendar popup.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `class` | Additional CSS classes | `ClassValue` | `''` |
| `zType` | Button variant style | `'default' \| 'outline' \| 'ghost'` | `'outline'` |
| `zSize` | Size of the date picker | `'sm' \| 'default' \| 'lg'` | `'default'` |
| `value` | Selected date value | `Date \| null` | `null` |
| `placeholder` | Placeholder text when no date is selected | `string` | `'Pick a date'` |
| `zFormat` | Date format pattern (e.g. 'MMMM d, yyyy') | `string` | `'MMMM d, yyyy'` |
| `minDate` | Minimum selectable date | `Date \| null` | `null` |
| `maxDate` | Maximum selectable date | `Date \| null` | `null` |
| `disabled` | Whether the date picker is disabled | `boolean` | `false` |
| `(dateChange)` | Emitted when a date is selected | `EventEmitter<Date \| null>` | `-` |

---

[Open in browser](https://zardui.com/docs/components/date-picker)
