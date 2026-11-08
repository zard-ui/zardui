import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const CALENDAR_API: ApiSection[] = [
  {
    selector: 'z-calendar',
    description: 'Date or range picker grid, sized by `--cell-size` and `--cell-radius`.',
    props: [
      {
        name: '[class]',
        description: 'Custom CSS classes; also overrides the CSS variables',
        type: 'ClassValue',
        default: "''",
      },
      { name: '[zMode]', description: 'Selection mode', type: "'single' | 'multiple' | 'range'", default: "'single'" },
      { name: '[value]', description: 'Selected date(s), shaped by `zMode`', type: 'CalendarValue', default: 'null' },
      { name: '[minDate]', description: 'Earliest selectable date', type: 'Date | null', default: 'null' },
      { name: '[maxDate]', description: 'Latest selectable date', type: 'Date | null', default: 'null' },
      { name: '[disabled]', description: 'Disables the calendar', type: 'boolean', default: 'false' },
      {
        name: '[zCaptionLayout]',
        description: 'Month/year caption as label or native dropdowns',
        type: "'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years'",
        default: "'label'",
      },
      {
        name: '[zButtonVariant]',
        description: 'Variant of the navigation arrows',
        type: 'ZardButtonTypeVariants',
        default: "'ghost'",
      },
      { name: '[zShowOutsideDays]', description: 'Shows days of adjacent months', type: 'boolean', default: 'true' },
      {
        name: '[zDisabledDates]',
        description: 'Individual days that cannot be selected',
        type: 'Date[]',
        default: '[]',
      },
      { name: '[zNumberOfMonths]', description: 'Months shown side by side', type: 'number', default: '1' },
      { name: '[zLocale]', description: 'BCP 47 locale for this calendar only', type: 'string', default: '-' },
      {
        name: '[zDayTemplate]',
        description: 'Custom day content (`let-day`)',
        type: 'TemplateRef<CalendarDayTemplateContext> | null',
        default: 'null',
      },
      {
        name: '(dateChange)',
        description: 'Emits when the selection changes',
        type: 'EventEmitter<Date | Date[]>',
        default: '-',
      },
      {
        name: 'resetNavigation()',
        description: 'Returns the view to the selected value',
        type: '() => void',
        default: '-',
      },
      { name: '[--cell-size]', description: 'Day cell width and height', type: 'length', default: '--spacing(7)' },
      { name: '[--cell-radius]', description: 'Day cell corner radius', type: 'length', default: 'var(--radius-md)' },
    ],
  },
  {
    selector: 'ZardCalendarI18nService',
    description: 'Localized month and weekday names, driven by `ZardI18nService`.',
    props: [
      { name: 'locale', description: 'Current BCP 47 locale', type: 'Signal<string>', default: "'en-US'" },
      {
        name: 'weekStartsOn',
        description: 'First day of the week (0 = Sunday)',
        type: 'Signal<ZardDayOfWeek>',
        default: '0',
      },
      { name: 'shortMonths', description: 'Short month names', type: 'Signal<string[]>', default: '' },
      { name: 'longMonths', description: 'Full month names', type: 'Signal<string[]>', default: '' },
      {
        name: 'weekdays',
        description: 'Weekday names ordered by `weekStartsOn`',
        type: 'Signal<string[]>',
        default: '',
      },
      {
        name: 'getMonthNames(format?, locale?)',
        description: 'Month names for a locale',
        type: "(format?: 'short' | 'long', locale?: string) => string[]",
        default: '',
      },
      {
        name: 'getWeekdayNames(format?, weekStartsOn?, locale?)',
        description: 'Weekday names for a locale and start day',
        type: "(format?: 'short' | 'narrow' | 'long', weekStartsOn?: ZardDayOfWeek, locale?: string) => string[]",
        default: '',
      },
    ],
  },
];
