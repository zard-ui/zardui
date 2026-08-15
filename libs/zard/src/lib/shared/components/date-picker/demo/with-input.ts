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
