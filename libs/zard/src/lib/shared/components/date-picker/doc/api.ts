import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const DATE_PICKER_API: ApiSection[] = [
  {
    selector: 'z-date-picker',
    description:
      'A date picker component that provides an intuitive interface for date selection through a button trigger and calendar popup.',
    props: [
      { name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      {
        name: 'zType',
        description: 'Button variant style',
        type: "'default' | 'outline' | 'ghost'",
        default: "'outline'",
      },
      { name: 'zSize', description: 'Size of the date picker', type: "'sm' | 'default' | 'lg'", default: "'default'" },
      { name: 'value', description: 'Selected date value', type: 'Date | null', default: 'null' },
      {
        name: 'placeholder',
        description: 'Placeholder text when no date is selected',
        type: 'string',
        default: "'Pick a date'",
      },
      {
        name: 'zFormat',
        description: "Date format pattern (e.g. 'MMMM d, yyyy')",
        type: 'string',
        default: "'MMMM d, yyyy'",
      },
      { name: 'minDate', description: 'Minimum selectable date', type: 'Date | null', default: 'null' },
      { name: 'maxDate', description: 'Maximum selectable date', type: 'Date | null', default: 'null' },
      { name: 'disabled', description: 'Whether the date picker is disabled', type: 'boolean', default: 'false' },
      {
        name: '(dateChange)',
        description: 'Emitted when a date is selected',
        type: 'EventEmitter<Date | null>',
        default: '-',
      },
    ],
  },
];
