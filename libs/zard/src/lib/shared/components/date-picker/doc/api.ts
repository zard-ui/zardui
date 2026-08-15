import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const DATE_PICKER_API: ApiSection[] = [
  {
    selector: 'z-date-picker',
    description:
      'A button that opens a z-calendar inside a popover. Everything the calendar can do — single, multiple and range selection, month/year dropdowns, several months side by side — is forwarded through the inputs below. The width lives on the host, so `class="w-44"` (or dropping it inside a `<div z-field>`) resizes the trigger.',
    props: [
      {
        name: 'class',
        description: 'Additional CSS classes on the host. Also where the trigger width is overridden',
        type: 'ClassValue',
        default: "''",
      },
      {
        name: 'zId',
        description: 'Applied to the trigger button, so a `<label for="…">` points at something focusable',
        type: 'string',
        default: "''",
      },
      {
        name: 'zType',
        description: 'Button variant used by the trigger',
        type: 'ZardButtonTypeVariants',
        default: "'outline'",
      },
      {
        name: 'zSize',
        description: 'Trigger height, following the button scale',
        type: "'xs' | 'sm' | 'default' | 'lg'",
        default: "'default'",
      },
      {
        name: 'zIcon',
        description:
          'Trigger icon: a trailing chevron, a leading calendar, or none. `chevron` justifies the label to the start and pushes the icon to the end',
        type: "'chevron' | 'calendar' | 'none'",
        default: "'chevron'",
      },
      {
        name: 'value',
        description: 'Selected date(s) — a Date in single mode, a Date[] in range and multiple modes',
        type: 'CalendarValue',
        default: 'null',
      },
      {
        name: 'zPlaceholder',
        description: 'Trigger label shown while nothing is selected',
        type: 'string',
        default: "'Pick a date'",
      },
      {
        name: 'zFormat',
        description: "Angular DatePipe pattern used to render the selected date(s), e.g. 'MMM dd, y'",
        type: 'string',
        default: "'MMMM d, yyyy'",
      },
      {
        name: 'zMode',
        description:
          'Selection mode. `single` closes the popover on pick, `range` once both ends are set, `multiple` keeps it open',
        type: "'single' | 'multiple' | 'range'",
        default: "'single'",
      },
      {
        name: 'zCaptionLayout',
        description: 'How the calendar renders its month/year caption',
        type: "'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years'",
        default: "'label'",
      },
      {
        name: 'zNumberOfMonths',
        description: 'How many months the calendar renders side by side',
        type: 'number',
        default: '1',
      },
      {
        name: 'zDisabledDates',
        description: 'Individual days that cannot be selected, on top of the minDate/maxDate range',
        type: 'Date[]',
        default: '[]',
      },
      {
        name: 'zShowOutsideDays',
        description: 'Whether the days of the surrounding months are visible',
        type: 'boolean',
        default: 'true',
      },
      {
        name: 'zAlign',
        description: 'Which edge of the popover lines up with the trigger',
        type: "'start' | 'center' | 'end'",
        default: "'start'",
      },
      {
        name: 'minDate',
        description: 'Minimum selectable date. Also used to expand the year dropdown range',
        type: 'Date | null',
        default: 'null',
      },
      {
        name: 'maxDate',
        description: 'Maximum selectable date. Also used to expand the year dropdown range',
        type: 'Date | null',
        default: 'null',
      },
      { name: 'disabled', description: 'Whether the date picker is disabled', type: 'boolean', default: 'false' },
      {
        name: '(dateChange)',
        description: 'Emitted whenever the selection changes, including when a range is cleared',
        type: 'EventEmitter<CalendarValue>',
        default: '-',
      },
    ],
  },
];
