import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const SLIDER_API: ApiSection[] = [
  {
    selector: 'z-slider',
    description: 'Picks values in a range; one ascending array entry per thumb.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      { name: '[zMin]', description: 'Minimum value', type: 'number', default: '0' },
      { name: '[zMax]', description: 'Maximum value', type: 'number', default: '100' },
      {
        name: '[zDefault]',
        description: 'Uncontrolled initial value; ignored when `zValue` is bound',
        type: 'number[]',
        default: '[0]',
      },
      { name: '[zValue]', description: 'Controlled value, one number per thumb', type: 'number[]', default: '[]' },
      { name: '[zStep]', description: 'Step increment', type: 'number', default: '1' },
      { name: '[zDisabled]', description: 'Disables slider interaction', type: 'boolean', default: 'false' },
      {
        name: '[zOrientation]',
        description: 'Slider orientation',
        type: 'horizontal | vertical',
        default: "'horizontal'",
      },
      {
        name: '(zSlideIndexChange)',
        description: 'Emitted with all values when a thumb moves',
        type: 'EventEmitter<number[]>',
        default: '-',
      },
    ],
  },
];
