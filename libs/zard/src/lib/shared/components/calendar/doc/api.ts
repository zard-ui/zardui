import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const CALENDAR_API: ApiSection[] = [
  {
    selector: 'z-calendar',
    description:
      'A flexible and accessible calendar component for selecting dates with full keyboard navigation support.',
    props: [
      {
        name: 'class',
        description: 'Additional CSS classes to apply to the calendar',
        type: 'ClassValue',
        default: "''",
      },
      {
        name: 'zMode',
        description: 'Selection mode of the calendar',
        type: "'single' | 'multiple' | 'range'",
        default: "'single'",
      },
      {
        name: 'value',
        description: 'Currently selected date(s) - type depends on mode',
        type: 'CalendarValue',
        default: 'null',
      },
      {
        name: 'minDate',
        description: 'Minimum selectable date. Also used to expand the year picker range',
        type: 'Date | null',
        default: 'null',
      },
      {
        name: 'maxDate',
        description: 'Maximum selectable date. Also used to expand the year picker range',
        type: 'Date | null',
        default: 'null',
      },
      { name: 'disabled', description: 'Whether the calendar is disabled', type: 'boolean', default: 'false' },
      {
        name: '(dateChange)',
        description: 'Emitted when date selection changes',
        type: 'EventEmitter<Date | Date[]>',
        default: '-',
      },
    ],
  },
];
