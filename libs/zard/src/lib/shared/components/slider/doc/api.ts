import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const SLIDER_API: ApiSection[] = [
  {
    selector: '[z-slider]',
    description:
      'A flexible and accessible component that allows users to select a numeric value from within a configurable range using pointer or keyboard interaction. Supports single value or range (two thumbs) by passing an array with two values.',
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
        description: 'Default value(s) when zValue is absent. Single thumb: [value]. Range: [lower, upper]',
        type: 'number[]',
        default: '[0]',
      },
      {
        name: '[zValue]',
        description: 'Controlled value input. Single thumb: [value]. Range: [lower, upper]',
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
        type: 'number[]',
        default: '-',
      },
    ],
  },
];
