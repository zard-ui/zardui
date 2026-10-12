import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendar, lucideChevronDown, lucideClock2 } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardCalendarComponent, type CalendarValue } from '@zard/components/calendar';
import { ZardCardImports } from '@zard/components/card';
import { ZardFieldImports } from '@zard/components/field';
import { ZardInputComponent } from '@zard/components/input';
import { ZardInputGroupImports } from '@zard/components/input-group';
import { ZardPopoverImports } from '@zard/components/popover';

import { ExampleImports } from './example.component';

const PRESETS = [
  { label: 'Today', value: 0 },
  { label: 'Tomorrow', value: 1 },
  { label: 'In 3 days', value: 3 },
  { label: 'In a week', value: 7 },
  { label: 'In 2 weeks', value: 14 },
] as const;

const TIME_INPUT_CLASSES =
  'appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none';

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function year(): number {
  return new Date().getFullYear();
}

function isWeekend(date: Date): boolean {
  return date.getDay() === 0 || date.getDay() === 6;
}

/** date-fns `PPP`: "February 3rd, 2026". */
function formatLong(date: Date): string {
  const day = date.getDate();
  const suffix =
    day % 100 >= 11 && day % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[day % 10];
  const month = date.toLocaleString('en-US', { month: 'long' });
  return `${month} ${day}${suffix ?? 'th'}, ${date.getFullYear()}`;
}

/** date-fns `LLL dd, y`: "Jan 20, 2026". */
function formatShort(date: Date): string {
  const month = date.toLocaleString('en-US', { month: 'short' });
  return `${month} ${String(date.getDate()).padStart(2, '0')}, ${date.getFullYear()}`;
}

function asDate(value: CalendarValue): Date | null {
  return value instanceof Date ? value : null;
}

/** shadcn/ui's `calendar-example`, in zard. */
@Component({
  selector: 'z-calendar-example',
  imports: [
    NgIcon,
    ExampleImports,
    ZardButtonComponent,
    ZardCalendarComponent,
    ZardCardImports,
    ZardFieldImports,
    ZardInputComponent,
    ZardInputGroupImports,
    ZardPopoverImports,
  ],
  viewProviders: [provideIcons({ lucideCalendar, lucideChevronDown, lucideClock2 })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper>
      <z-example zTitle="Single">
        <z-card class="mx-auto w-fit p-0">
          <z-card-content class="p-0">
            <z-calendar zMode="single" zCaptionLayout="dropdown" [(value)]="single" />
          </z-card-content>
        </z-card>
      </z-example>

      <z-example zTitle="Multiple">
        <z-card class="mx-auto w-fit p-0">
          <z-card-content class="p-0">
            <z-calendar zMode="multiple" />
          </z-card-content>
        </z-card>
      </z-example>

      <z-example zTitle="Week Numbers" zClass="justify-center">
        <z-card class="mx-auto w-fit p-0">
          <z-card-content class="p-0">
            <z-calendar zMode="single" [(value)]="weekNumbers" />
          </z-card-content>
        </z-card>
      </z-example>

      <z-example zTitle="Booked Dates">
        <z-card class="mx-auto w-fit p-0">
          <z-card-content class="p-0">
            <z-calendar
              zMode="single"
              class="[&_[data-disabled=true]_button]:line-through [&_[data-disabled=true]_button]:opacity-100"
              [zDisabledDates]="bookedDates"
              [(value)]="booked"
            />
          </z-card-content>
        </z-card>
      </z-example>

      <z-example zTitle="Range" zContainerClass="lg:col-span-full 2xl:col-span-full" zClass="p-12">
        <z-card class="mx-auto w-fit p-0">
          <z-card-content class="p-0">
            <z-calendar zMode="range" zNumberOfMonths="2" [minDate]="minDate" [maxDate]="today" [(value)]="range" />
          </z-card-content>
        </z-card>
      </z-example>

      <z-example zTitle="Range Multiple Months" zContainerClass="lg:col-span-full 2xl:col-span-full" zClass="p-12">
        <z-card class="mx-auto w-fit p-0">
          <z-card-content class="p-0">
            <z-calendar zMode="range" zNumberOfMonths="3" zLocale="es" [(value)]="rangeMultiple" />
          </z-card-content>
        </z-card>
      </z-example>

      <z-example zTitle="With Time">
        <z-card zSize="sm" class="mx-auto w-fit">
          <z-card-content>
            <z-calendar zMode="single" class="p-0" [(value)]="withTime" />
          </z-card-content>
          <z-card-footer class="bg-card border-t">
            <div z-field-group>
              <div z-field>
                <label z-field-label for="time-from">Start Time</label>
                <z-input-group>
                  <input z-input id="time-from" type="time" step="1" value="10:30:00" [class]="timeInputClasses" />
                  <z-input-group-addon>
                    <ng-icon name="lucideClock2" class="text-muted-foreground" />
                  </z-input-group-addon>
                </z-input-group>
              </div>
              <div z-field>
                <label z-field-label for="time-to">End Time</label>
                <z-input-group>
                  <input z-input id="time-to" type="time" step="1" value="12:30:00" [class]="timeInputClasses" />
                  <z-input-group-addon>
                    <ng-icon name="lucideClock2" class="text-muted-foreground" />
                  </z-input-group-addon>
                </z-input-group>
              </div>
            </div>
          </z-card-footer>
        </z-card>
      </z-example>

      <z-example zTitle="With Presets">
        <z-card zSize="sm" class="mx-auto w-fit max-w-[300px]">
          <z-card-content class="px-4">
            <z-calendar zMode="single" class="p-0 [--cell-size:--spacing(9.5)]" [(value)]="preset" />
          </z-card-content>
          <z-card-footer class="flex flex-wrap gap-2 border-t">
            @for (item of presets; track item.value) {
              <button
                type="button"
                z-button
                zType="outline"
                zSize="sm"
                class="flex-1"
                (click)="preset.set(addDays(today, item.value))"
              >
                {{ item.label }}
              </button>
            }
          </z-card-footer>
        </z-card>
      </z-example>

      <z-example zTitle="Custom Days">
        <z-card class="mx-auto w-fit p-0">
          <z-card-content class="p-0">
            <z-calendar
              zMode="range"
              zCaptionLayout="dropdown"
              class="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
              [zDayTemplate]="priceDay"
              [(value)]="customDays"
            />
          </z-card-content>
        </z-card>
        <ng-template #priceDay let-day>
          {{ day.date.getDate() }}
          @if (day.isCurrentMonth) {
            <span>{{ isWeekend(day.date) ? '$120' : '$100' }}</span>
          }
        </ng-template>
      </z-example>

      <z-example zTitle="Date Picker Simple">
        <div z-field class="mx-auto w-72">
          <label z-field-label for="date-picker-simple">Date</label>
          <button
            type="button"
            z-button
            zType="outline"
            id="date-picker-simple"
            class="justify-start px-2.5 font-normal"
            zPopover
            zAlign="start"
            [zContent]="simpleCalendar"
          >
            <ng-icon name="lucideCalendar" data-icon="inline-start" />
            @if (simpleDate(); as date) {
              {{ formatLong(date) }}
            } @else {
              <span>Pick a date</span>
            }
          </button>
          <ng-template #simpleCalendar>
            <z-popover class="w-auto p-0">
              <z-calendar zMode="single" [(value)]="simple" />
            </z-popover>
          </ng-template>
        </div>
      </z-example>

      <z-example zTitle="Date Picker with Dropdowns">
        <div z-field class="mx-auto w-72">
          <label z-field-label for="date-picker-with-dropdowns-desktop">Date</label>
          <button
            type="button"
            z-button
            zType="outline"
            id="date-picker-with-dropdowns-desktop"
            class="justify-start px-2.5 font-normal"
            zPopover
            #dropdownPicker="zPopover"
            zAlign="start"
            [zContent]="dropdownCalendar"
          >
            @if (dropdownDate(); as date) {
              {{ formatLong(date) }}
            } @else {
              <span>Pick a date</span>
            }
            <ng-icon name="lucideChevronDown" data-icon="inline-start" class="ml-auto" />
          </button>
          <ng-template #dropdownCalendar>
            <z-popover class="w-auto p-0">
              <z-calendar zMode="single" zCaptionLayout="dropdown" [(value)]="dropdown" />
              <div class="flex gap-2 border-t p-2">
                <button
                  type="button"
                  z-button
                  zType="outline"
                  zSize="sm"
                  class="w-full"
                  (click)="dropdownPicker.hide()"
                >
                  Done
                </button>
              </div>
            </z-popover>
          </ng-template>
        </div>
      </z-example>

      <z-example zTitle="Date Picker Range">
        <div z-field class="mx-auto w-72">
          <label z-field-label for="date-picker-range">Date Picker Range</label>
          <button
            type="button"
            z-button
            zType="outline"
            id="date-picker-range"
            class="justify-start px-2.5 font-normal"
            zPopover
            zAlign="start"
            [zContent]="rangeCalendar"
          >
            <ng-icon name="lucideCalendar" data-icon="inline-start" />
            @let picked = pickerRange();
            @if (picked[0]) {
              @if (picked[1]) {
                {{ formatShort(picked[0]) }} - {{ formatShort(picked[1]) }}
              } @else {
                {{ formatShort(picked[0]) }}
              }
            } @else {
              <span>Pick a date</span>
            }
          </button>
          <ng-template #rangeCalendar>
            <z-popover class="w-auto p-0">
              <z-calendar zMode="range" zNumberOfMonths="2" [(value)]="pickerRangeValue" />
            </z-popover>
          </ng-template>
        </div>
      </z-example>

      <z-example zTitle="In Card">
        <z-card class="mx-auto w-fit p-0">
          <z-card-content class="p-0">
            <z-calendar zMode="single" />
          </z-card-content>
        </z-card>
      </z-example>

      <z-example zTitle="In Popover">
        <button
          type="button"
          z-button
          zType="outline"
          class="px-2.5 font-normal"
          zPopover
          zAlign="start"
          [zContent]="popoverCalendar"
        >
          <ng-icon name="lucideCalendar" data-icon="inline-start" />
          Open Calendar
        </button>
        <ng-template #popoverCalendar>
          <z-popover class="w-auto p-0">
            <z-calendar zMode="single" />
          </z-popover>
        </ng-template>
      </z-example>
    </z-example-wrapper>
  `,
})
export class CalendarExampleComponent {
  protected readonly presets = PRESETS;
  protected readonly timeInputClasses = TIME_INPUT_CLASSES;
  protected readonly today = new Date();
  protected readonly minDate = new Date('1900-01-01');
  protected readonly bookedDates = Array.from({ length: 15 }, (_, i) => new Date(year(), 1, 12 + i));

  protected readonly single = signal<CalendarValue>(new Date(year(), new Date().getMonth(), 12));
  protected readonly weekNumbers = signal<CalendarValue>(new Date(year(), 1, 3));
  protected readonly booked = signal<CalendarValue>(new Date(year(), 1, 3));
  protected readonly range = signal<CalendarValue>([new Date(year(), 0, 12), addDays(new Date(year(), 0, 12), 30)]);
  protected readonly rangeMultiple = signal<CalendarValue>([
    new Date(year(), 3, 12),
    addDays(new Date(year(), 3, 12), 60),
  ]);

  protected readonly withTime = signal<CalendarValue>(new Date(year(), new Date().getMonth(), 12));
  protected readonly preset = signal<CalendarValue>(new Date(year(), 1, 12));
  protected readonly customDays = signal<CalendarValue>([
    new Date(year(), 11, 8),
    addDays(new Date(year(), 11, 8), 10),
  ]);

  protected readonly simple = signal<CalendarValue>(null);
  protected readonly dropdown = signal<CalendarValue>(null);
  protected readonly pickerRangeValue = signal<CalendarValue>([
    new Date(year(), 0, 20),
    addDays(new Date(year(), 0, 20), 20),
  ]);

  protected readonly simpleDate = computed(() => asDate(this.simple()));
  protected readonly dropdownDate = computed(() => asDate(this.dropdown()));
  protected readonly pickerRange = computed<[Date | undefined, Date | undefined]>(() => {
    const value = this.pickerRangeValue();
    return Array.isArray(value) ? [value[0], value[1]] : [undefined, undefined];
  });

  protected readonly addDays = addDays;
  protected readonly isWeekend = isWeekend;
  protected readonly formatLong = formatLong;
  protected readonly formatShort = formatShort;
}
