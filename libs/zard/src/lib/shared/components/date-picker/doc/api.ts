import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const DATE_PICKER_API: ApiSection[] = [
  {
    selector: 'z-date-picker',
    description: 'A button that opens a `z-calendar` in a popover.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      { name: '[zId]', description: 'Id of the trigger button, for `<label for>`', type: 'string', default: "''" },
      { name: '[zType]', description: 'Trigger button variant', type: 'ZardButtonTypeVariants', default: "'outline'" },
      { name: '[zSize]', description: 'Trigger height', type: "'xs' | 'sm' | 'default' | 'lg'", default: "'default'" },
      { name: '[zIcon]', description: 'Trigger icon', type: "'chevron' | 'calendar' | 'none'", default: "'chevron'" },
      {
        name: '[value]',
        description: 'Selected date, or dates in range and multiple modes',
        type: 'CalendarValue',
        default: 'null',
      },
      {
        name: '[zPlaceholder]',
        description: 'Trigger label when nothing is selected',
        type: 'string',
        default: "'Pick a date'",
      },
      { name: '[zFormat]', description: '`DatePipe` format of the label', type: 'string', default: "'MMMM d, yyyy'" },
      { name: '[zMode]', description: 'Selection mode', type: "'single' | 'multiple' | 'range'", default: "'single'" },
      {
        name: '[zCaptionLayout]',
        description: 'Calendar month/year caption style',
        type: "'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years'",
        default: "'label'",
      },
      { name: '[zNumberOfMonths]', description: 'Months shown side by side', type: 'number', default: '1' },
      { name: '[zLocale]', description: 'BCP 47 locale; falls back to the app locale', type: 'string', default: '-' },
      { name: '[zDisabledDates]', description: 'Days that cannot be selected', type: 'Date[]', default: '[]' },
      { name: '[zShowOutsideDays]', description: 'Shows days of adjacent months', type: 'boolean', default: 'true' },
      {
        name: '[zAlign]',
        description: 'Popover alignment to the trigger',
        type: "'start' | 'center' | 'end'",
        default: "'start'",
      },
      { name: '[minDate]', description: 'Minimum selectable date', type: 'Date | null', default: 'null' },
      { name: '[maxDate]', description: 'Maximum selectable date', type: 'Date | null', default: 'null' },
      { name: '[disabled]', description: 'Disables the date picker', type: 'boolean', default: 'false' },
      {
        name: '(dateChange)',
        description: 'Emitted when the selection changes or is cleared',
        type: 'EventEmitter<CalendarValue>',
        default: '-',
      },
    ],
  },
];
