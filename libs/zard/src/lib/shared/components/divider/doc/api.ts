import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const DIVIDER_API: ApiSection[] = [
  {
    selector: 'z-divider',
    description: 'Used to visually separate content with a horizontal or vertical line.',
    props: [
      {
        name: 'zOrientation',
        description: 'Defines the divider direction',
        type: '"horizontal" | "vertical"',
        default: 'horizontal',
      },
    ],
  },
];
