---
title: Date Picker
description: A button that opens a calendar in a popover to pick one date, several dates, or a date range.
---

# Date Picker

A button that opens a calendar in a popover to pick one date, several dates, or a date range.

## Installation

### CLI

```bash
npx zard-cli@latest add date-picker
```

### Manual

```angular-ts
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
import { mergeClasses, noopFn } from '@/shared/utils/merge-classes';

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
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

import type { ZardButtonSizeVariants } from '@/shared/components/button/button.variants';

/**
 * Host wrapper. The width lives here — the trigger is `w-full` — so a single
 * `class="w-44"` on `<z-date-picker />` resizes the whole thing, and dropping it
 * into a `<div z-field>` lets the field own the width instead.
 */
export const datePickerVariants = cva('flex w-[212px] flex-col');

/**
 * Trigger button. Everything else (height, colors, focus ring) comes from
 * `buttonVariants` through `<button z-button>`, so only the delta lives here.
 */
export const datePickerTriggerVariants = cva('w-full font-normal data-[empty=true]:text-muted-foreground', {
  variants: {
    zIcon: {
      chevron: 'justify-between text-left',
      calendar: 'justify-start text-left',
      none: 'justify-start text-left',
    },
  },
  defaultVariants: {
    zIcon: 'chevron',
  },
});

export type ZardDatePickerIconVariants = NonNullable<VariantProps<typeof datePickerTriggerVariants>['zIcon']>;

/** The date picker exposes the height scale of the button, minus the icon-only sizes. */
export type ZardDatePickerSizeVariants = Extract<ZardButtonSizeVariants, 'xs' | 'sm' | 'default' | 'lg'>;
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
<z-date-picker zPlaceholder="Pick a date"></z-date-picker>
```

## Examples

### Basic

Pair it with a `<div z-field>` label through `zId`, and use `zIcon="none"` to drop the trailing chevron.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { CalendarValue } from '@/shared/components/calendar/calendar.types';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

import { ZardDatePickerComponent } from '../date-picker.component';

@Component({
  selector: 'z-demo-date-picker-basic',
  imports: [ZardDatePickerComponent, ZardFieldImports],
  standalone: true,
  template: `
    <div z-field class="mx-auto w-44">
      <label z-field-label for="date-picker-basic">Date</label>
      <z-date-picker zId="date-picker-basic" zIcon="none" [(value)]="selectedDate" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDatePickerBasicComponent {
  readonly selectedDate = signal<CalendarValue>(null);
}
```

### Date Of Birth

Use `zCaptionLayout="dropdown"` with `minDate`/`maxDate` to jump across decades in two clicks.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { CalendarValue } from '@/shared/components/calendar/calendar.types';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

import { ZardDatePickerComponent } from '../date-picker.component';

@Component({
  selector: 'z-demo-date-picker-date-of-birth',
  imports: [ZardDatePickerComponent, ZardFieldImports],
  standalone: true,
  template: `
    <div z-field class="mx-auto w-44">
      <label z-field-label for="date-picker-date-of-birth">Date of birth</label>
      <z-date-picker
        zId="date-picker-date-of-birth"
        zIcon="none"
        zCaptionLayout="dropdown"
        zPlaceholder="Select date"
        [minDate]="minDate"
        [maxDate]="maxDate"
        [(value)]="selectedDate"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDatePickerDateOfBirthComponent {
  readonly selectedDate = signal<CalendarValue>(null);

  /** The bounds are what widen the year dropdown — without them it spans today ± 10 years. */
  readonly minDate = new Date(1900, 0, 1);
  readonly maxDate = new Date();
}
```

### Range

Use `zMode="range"` to pick a start and an end date — the popover only closes once both ends are set.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { CalendarValue } from '@/shared/components/calendar/calendar.types';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

import { ZardDatePickerComponent } from '../date-picker.component';

const currentYear = new Date().getFullYear();

@Component({
  selector: 'z-demo-date-picker-range',
  imports: [ZardDatePickerComponent, ZardFieldImports],
  standalone: true,
  template: `
    <div z-field class="mx-auto w-60">
      <label z-field-label for="date-picker-range">Date range</label>
      <z-date-picker
        zId="date-picker-range"
        zMode="range"
        zIcon="calendar"
        zFormat="MMM dd, y"
        [zNumberOfMonths]="2"
        [(value)]="selectedRange"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDatePickerRangeComponent {
  readonly selectedRange = signal<CalendarValue>([new Date(currentYear, 0, 20), new Date(currentYear, 1, 9)]);
}
```

### With Time

Put the picker next to a `type="time"` input to collect a date and a time.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { CalendarValue } from '@/shared/components/calendar/calendar.types';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

import { ZardDatePickerComponent } from '../date-picker.component';

@Component({
  selector: 'z-demo-date-picker-with-time',
  imports: [ZardDatePickerComponent, ZardFieldImports, ZardInputComponent],
  standalone: true,
  template: `
    <!-- A fixed width, not max-w-*: the field group is w-full, so it has nothing to resolve against. -->
    <div z-field-group class="mx-auto w-xs flex-row">
      <!-- The width goes on the field: it forces w-full onto whatever it wraps. -->
      <div z-field class="w-40">
        <label z-field-label for="date-picker-with-time">Date</label>
        <z-date-picker
          zId="date-picker-with-time"
          zCaptionLayout="dropdown"
          zPlaceholder="Select date"
          zFormat="MMM d, yyyy"
          [(value)]="selectedDate"
        />
      </div>

      <div z-field class="w-32">
        <label z-field-label for="date-picker-time">Time</label>
        <input
          z-input
          id="date-picker-time"
          type="time"
          step="1"
          value="10:30:00"
          class="appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
        />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDatePickerWithTimeComponent {
  readonly selectedDate = signal<CalendarValue>(null);
}
```

### With Input

Compose `z-input-group`, `z-popover` and `z-calendar` when the date should also be typeable — arrow down opens the calendar.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendar } from '@ng-icons/lucide';

import { ZardCalendarComponent } from '@/shared/components/calendar/calendar.component';
import type { CalendarValue } from '@/shared/components/calendar/calendar.types';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardPopoverComponent, ZardPopoverDirective } from '@/shared/components/popover';

const MONTHS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

function formatDate(date: Date | null): string {
  if (!date) {
    return '';
  }

  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });
}

/**
 * Parses the one format this demo documents — `June 01, 2025` — as a local date.
 * `new Date(value)` is not an option: it reads date-only ISO strings as UTC, so west of UTC the
 * calendar would land a day earlier than what was typed.
 */
function parseDate(value: string): Date | null {
  const match = /^\s*([a-zA-Z]+)\s+(\d{1,2}),?\s+(\d{4})\s*$/.exec(value);
  if (!match) {
    return null;
  }

  const month = MONTHS.indexOf(match[1].toLowerCase());
  const day = Number(match[2]);
  const year = Number(match[3]);

  if (month < 0) {
    return null;
  }

  // Set the three parts at once on a neutral date: `new Date(year, …)` would remap any year below
  // 100 into the 1900s, and normalize against the wrong year's leap day on the way.
  const date = new Date(2000, 0, 1);
  date.setFullYear(year, month, day);

  // Rejects overflow like "February 31, 2025", which setFullYear rolls over instead of refusing.
  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day ? date : null;
}

@Component({
  selector: 'z-demo-date-picker-with-input',
  imports: [
    NgIcon,
    ZardCalendarComponent,
    ZardFieldImports,
    ZardInputComponent,
    ZardInputGroupImports,
    ZardPopoverComponent,
    ZardPopoverDirective,
  ],
  standalone: true,
  template: `
    <div z-field class="mx-auto w-52">
      <label z-field-label for="date-picker-with-input">Subscription date</label>
      <z-input-group>
        <input
          z-input
          id="date-picker-with-input"
          placeholder="June 01, 2025"
          [value]="inputValue()"
          (input)="onInput($event)"
          (keydown)="onKeydown($event)"
        />
        <z-input-group-addon zAlign="inline-end">
          <button
            z-input-group-button
            aria-label="Select date"
            zPopover
            zAlign="end"
            [zContent]="calendarTemplate"
            [zVisible]="isOpen()"
            [zAlignOffset]="-8"
            [zSideOffset]="10"
            (zVisibleChange)="isOpen.set($event)"
          >
            <ng-icon name="lucideCalendar" class="size-4!" />
          </button>
        </z-input-group-addon>
      </z-input-group>
    </div>

    <ng-template #calendarTemplate>
      <z-popover aria-label="Choose date" class="w-auto overflow-hidden p-0">
        <z-calendar [value]="selectedDate()" (valueChange)="onSelect($event)" />
      </z-popover>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCalendar })],
})
export class ZardDemoDatePickerWithInputComponent {
  readonly selectedDate = signal<Date | null>(new Date(2025, 5, 1));
  readonly inputValue = signal(formatDate(new Date(2025, 5, 1)));
  readonly isOpen = signal(false);

  onInput(event: Event): void {
    const typed = (event.target as HTMLInputElement).value;
    this.inputValue.set(typed);

    const parsed = parseDate(typed);
    if (parsed) {
      this.selectedDate.set(parsed);
    }
  }

  /** Arrow down opens the calendar, the way a native date input does. */
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.isOpen.set(true);
    }
  }

  onSelect(value: CalendarValue): void {
    const date = Array.isArray(value) ? (value[0] ?? null) : value;
    this.selectedDate.set(date);
    this.inputValue.set(formatDate(date));
    this.isOpen.set(false);
  }
}
```

### Sizes

`zSize` follows the button scale, so a picker lines up with the inputs around it.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { CalendarValue } from '@/shared/components/calendar/calendar.types';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

import { ZardDatePickerComponent } from '../date-picker.component';

@Component({
  selector: 'z-demo-date-picker-sizes',
  imports: [ZardDatePickerComponent, ZardFieldImports],
  standalone: true,
  template: `
    <div z-field-group class="mx-auto w-60">
      <div z-field>
        <label z-field-label for="date-picker-size-xs">Extra small</label>
        <z-date-picker zId="date-picker-size-xs" zSize="xs" [(value)]="selectedDate" />
      </div>

      <div z-field>
        <label z-field-label for="date-picker-size-sm">Small</label>
        <z-date-picker zId="date-picker-size-sm" zSize="sm" [(value)]="selectedDate" />
      </div>

      <div z-field>
        <label z-field-label for="date-picker-size-default">Default</label>
        <z-date-picker zId="date-picker-size-default" [(value)]="selectedDate" />
      </div>

      <div z-field>
        <label z-field-label for="date-picker-size-lg">Large</label>
        <z-date-picker zId="date-picker-size-lg" zSize="lg" [(value)]="selectedDate" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDatePickerSizesComponent {
  readonly selectedDate = signal<CalendarValue>(new Date());
}
```

### Formats

`zFormat` takes any Angular `DatePipe` pattern.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { CalendarValue } from '@/shared/components/calendar/calendar.types';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

import { ZardDatePickerComponent } from '../date-picker.component';

@Component({
  selector: 'z-demo-date-picker-formats',
  imports: [ZardDatePickerComponent, ZardFieldImports],
  standalone: true,
  template: `
    <div z-field-group class="mx-auto w-60">
      <div z-field>
        <label z-field-label for="date-picker-format-default">MMMM d, yyyy</label>
        <z-date-picker zId="date-picker-format-default" [(value)]="selectedDate" />
      </div>

      <div z-field>
        <label z-field-label for="date-picker-format-us">MM/dd/yyyy</label>
        <z-date-picker zId="date-picker-format-us" zFormat="MM/dd/yyyy" [(value)]="selectedDate" />
      </div>

      <div z-field>
        <label z-field-label for="date-picker-format-iso">yyyy-MM-dd</label>
        <z-date-picker zId="date-picker-format-iso" zFormat="yyyy-MM-dd" [(value)]="selectedDate" />
      </div>

      <div z-field>
        <label z-field-label for="date-picker-format-day-name">EEE, MMMM d</label>
        <z-date-picker zId="date-picker-format-day-name" zFormat="EEE, MMMM d" [(value)]="selectedDate" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDatePickerFormatsComponent {
  /** Shared on purpose — every picker shows the same date under a different format. */
  readonly selectedDate = signal<CalendarValue>(new Date());
}
```

## API Reference

### z-date-picker

A button that opens a z-calendar inside a popover. Everything the calendar can do — single, multiple and range selection, month/year dropdowns, several months side by side — is forwarded through the inputs below. The width lives on the host, so `class="w-44"` (or dropping it inside a `<div z-field>`) resizes the trigger.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `class` | Additional CSS classes on the host. Also where the trigger width is overridden | `ClassValue` | `''` |
| `zId` | Applied to the trigger button, so a `<label for="…">` points at something focusable | `string` | `''` |
| `zType` | Button variant used by the trigger | `ZardButtonTypeVariants` | `'outline'` |
| `zSize` | Trigger height, following the button scale | `'xs' \| 'sm' \| 'default' \| 'lg'` | `'default'` |
| `zIcon` | Trigger icon: a trailing chevron, a leading calendar, or none. `chevron` justifies the label to the start and pushes the icon to the end | `'chevron' \| 'calendar' \| 'none'` | `'chevron'` |
| `value` | Selected date(s) — a Date in single mode, a Date[] in range and multiple modes | `CalendarValue` | `null` |
| `zPlaceholder` | Trigger label shown while nothing is selected | `string` | `'Pick a date'` |
| `zFormat` | Angular DatePipe pattern used to render the selected date(s), e.g. 'MMM dd, y' | `string` | `'MMMM d, yyyy'` |
| `zMode` | Selection mode. `single` closes the popover on pick, `range` once both ends are set, `multiple` keeps it open | `'single' \| 'multiple' \| 'range'` | `'single'` |
| `zCaptionLayout` | How the calendar renders its month/year caption | `'label' \| 'dropdown' \| 'dropdown-months' \| 'dropdown-years'` | `'label'` |
| `zNumberOfMonths` | How many months the calendar renders side by side | `number` | `1` |
| `zDisabledDates` | Individual days that cannot be selected, on top of the minDate/maxDate range | `Date[]` | `[]` |
| `zShowOutsideDays` | Whether the days of the surrounding months are visible | `boolean` | `true` |
| `zAlign` | Which edge of the popover lines up with the trigger | `'start' \| 'center' \| 'end'` | `'start'` |
| `minDate` | Minimum selectable date. Also used to expand the year dropdown range | `Date \| null` | `null` |
| `maxDate` | Maximum selectable date. Also used to expand the year dropdown range | `Date \| null` | `null` |
| `disabled` | Whether the date picker is disabled | `boolean` | `false` |
| `(dateChange)` | Emitted whenever the selection changes, including when a range is cleared | `EventEmitter<CalendarValue>` | `-` |

---

[Open in browser](https://zardui.com/docs/components/date-picker)
