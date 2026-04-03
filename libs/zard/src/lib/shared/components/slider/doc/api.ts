import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const SLIDER_API: ApiSection[] = [
  {
    selector: '[z-slider]',
    description:
      'A flexible and accessible component that allows users to select a numeric value from within a configurable range using pointer or keyboard interaction.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      { name: '[zMin]', description: 'Minimum selectable value', type: 'number', default: '0' },
      { name: '[zMax]', description: 'Maximum selectable value', type: 'number', default: '100' },
      { name: '[zDefault]', description: 'Default value when zValue is absent', type: 'number', default: '0' },
      { name: '[zValue]', description: 'Controlled value input', type: 'number | null', default: 'null' },
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
        description: 'Emitted when the slider value changes',
        type: 'number',
        default: '-',
      },
    ],
  },
];
