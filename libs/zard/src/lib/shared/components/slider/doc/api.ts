import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const SLIDER_API: ApiSection[] = [
  {
    selector: 'z-slider',
    description:
      'A flexible and accessible component that allows users to select a numeric value from within a configurable range using pointer or keyboard interaction. The value is always an array of numbers, one entry per thumb: a single-element array renders one thumb, two elements render a range (see the `range` example), and three or more render that many independent thumbs (see the `multiple-thumbs` example) — values must be provided in ascending order. Implements Angular’s `ControlValueAccessor`, so `formControlName` and `[(ngModel)]` also work.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      { name: '[zMin]', description: 'Minimum selectable value', type: 'number', default: '0' },
      {
        name: '[zMax]',
        description:
          'Maximum selectable value. When zMax <= 1, values are automatically normalized to a 0-100% visual scale',
        type: 'number',
        default: '100',
      },
      {
        name: '[zDefault]',
        description:
          'Uncontrolled initial value, read once. One number per thumb, ascending: [value] for a single thumb, [lower, upper] for a range, or more entries for additional thumbs. Ignored once [zValue] is bound',
        type: 'number[]',
        default: '[0]',
      },
      {
        name: '[zValue]',
        description:
          'Controlled value — pair with (zSlideIndexChange) to own the value from the parent. Same shape as [zDefault]: one number per thumb, ascending',
        type: 'number[]',
        default: '[]',
      },
      { name: '[zStep]', description: 'Step increment for the value', type: 'number', default: '1' },
      { name: '[zDisabled]', description: 'Disables slider interaction', type: 'boolean', default: 'false' },
      {
        name: '[zOrientation]',
        description: 'Slider orientation',
        type: 'horizontal | vertical',
        default: "'horizontal'",
      },
      {
        name: '(zSlideIndexChange)',
        description: 'Emitted when a thumb value changes. Always emits the full array of current values',
        type: 'EventEmitter<number[]>',
        default: '-',
      },
    ],
  },
];
