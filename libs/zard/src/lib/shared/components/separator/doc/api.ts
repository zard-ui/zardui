import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const SEPARATOR_API: ApiSection[] = [
  {
    selector: 'z-separator',
    description: 'A horizontal or vertical dividing line.',
    props: [
      {
        name: '[zOrientation]',
        description: 'Line direction',
        type: '"horizontal" | "vertical"',
        default: 'horizontal',
      },
      { name: '[zDecorative]', description: 'Hides it from assistive tech', type: 'boolean', default: 'true' },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' },
    ],
  },
];
