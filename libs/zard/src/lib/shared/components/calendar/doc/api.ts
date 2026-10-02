import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const CALENDAR_API: ApiSection[] = [
  {
    selector: 'z-calendar',
    description:
      'A calendar component that allows users to select a date or a range of dates, with full keyboard navigation support. Every measurement derives from the --cell-size and --cell-radius CSS variables listed at the end of the table, so overriding them through the class input rescales the whole calendar.',
    props: [
      {
        name: '[class]',
        description:
          'Additional CSS classes. Also where a border is opted into (`rounded-lg border`) and where the CSS variables below are overridden',
        type: 'ClassValue',
        default: "''",
      },
      {
        name: '[zMode]',
        description: 'Selection mode of the calendar',
        type: "'single' | 'multiple' | 'range'",
        default: "'single'",
      },
      {
        name: '[value]',
        description: 'Currently selected date(s) - type depends on mode',
        type: 'CalendarValue',
        default: 'null',
      },
      {
        name: '[minDate]',
        description: 'Minimum selectable date. Also used to expand the year picker range',
        type: 'Date | null',
        default: 'null',
      },
      {
        name: '[maxDate]',
        description: 'Maximum selectable date. Also used to expand the year picker range',
        type: 'Date | null',
        default: 'null',
      },
      { name: '[disabled]', description: 'Whether the calendar is disabled', type: 'boolean', default: 'false' },
      {
        name: '[zCaptionLayout]',
        description:
          'How the month/year caption is rendered: a plain label, two dropdowns, or a dropdown for only the month or only the year. The dropdowns are native `<select>` elements laid invisible over the label, so the browser owns the popup',
        type: "'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years'",
        default: "'label'",
      },
      {
        name: '[zButtonVariant]',
        description: 'Button variant used by the previous/next month arrows',
        type: 'ZardButtonTypeVariants',
        default: "'ghost'",
      },
      {
        name: '[zShowOutsideDays]',
        description:
          'Whether the days of the surrounding months are visible. When false they are hidden but keep their grid cell, so the layout never shifts',
        type: 'boolean',
        default: 'true',
      },
      {
        name: '[zDisabledDates]',
        description:
          'Individual days that cannot be selected, on top of the minDate/maxDate range. Each day still keeps its grid cell and is marked with `data-disabled="true"`',
        type: 'Date[]',
        default: '[]',
      },
      {
        name: '[zNumberOfMonths]',
        description:
          'How many months are rendered side by side. They stack vertically below the `md` breakpoint, and only the first and the last month carry the navigation arrows',
        type: 'number',
        default: '1',
      },
      {
        name: '(dateChange)',
        description: 'Emitted when date selection changes',
        type: 'EventEmitter<Date | Date[]>',
        default: '-',
      },
      {
        name: 'resetNavigation()',
        description:
          'Public method that moves the visible month back to the selected value and clears the roving focus',
        type: '() => void',
        default: '-',
      },
      {
        name: '[--cell-size]',
        description: 'CSS variable: width and height of a day cell, e.g. `class="[--cell-size:--spacing(12)]"`',
        type: 'length',
        default: '--spacing(7)',
      },
      {
        name: '[--cell-radius]',
        description: 'CSS variable: corner radius of a day cell, e.g. `class="[--cell-radius:var(--radius-lg)]"`',
        type: 'length',
        default: 'var(--radius-md)',
      },
    ],
  },
  {
    selector: 'ZardCalendarI18nService',
    description:
      'Injectable service that provides localized month names, weekday names, and week-start configuration. Driven by ZardI18nService or provideZardI18n().',
    props: [
      {
        name: 'locale',
        description: 'Signal emitting the current BCP-47 locale tag, e.g. "en-US", "fr-FR"',
        type: 'Signal<string>',
        default: "'en-US'",
      },
      {
        name: 'weekStartsOn',
        description: 'Signal emitting the starting day of the week (0 for Sunday, 1 for Monday, etc.)',
        type: 'Signal<ZardDayOfWeek>',
        default: '0',
      },
      {
        name: 'shortMonths',
        description: 'Signal emitting the 12 localized short month names for the current locale',
        type: 'Signal<string[]>',
        default: '',
      },
      {
        name: 'longMonths',
        description: 'Signal emitting the 12 localized full month names for the current locale',
        type: 'Signal<string[]>',
        default: '',
      },
      {
        name: 'weekdays',
        description: 'Signal emitting the 7 localized weekday names matching weekStartsOn',
        type: 'Signal<string[]>',
        default: '',
      },
      {
        name: 'getMonthNames(format?, locale?)',
        description: 'Returns formatted month names for a given locale',
        type: "(format?: 'short' | 'long', locale?: string) => string[]",
        default: '',
      },
      {
        name: 'getWeekdayNames(format?, weekStartsOn?, locale?)',
        description: 'Returns formatted weekday names for a given locale and starting day',
        type: "(format?: 'short' | 'narrow' | 'long', weekStartsOn?: ZardDayOfWeek, locale?: string) => string[]",
        default: '',
      },
    ],
  },
];
