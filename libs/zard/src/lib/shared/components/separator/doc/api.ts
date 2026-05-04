import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const SEPARATOR_API: ApiSection[] = [
  {
    selector: 'z-separator',
    description: 'Used to visually separate content with a horizontal or vertical line.',
    props: [
      {
        name: 'zOrientation',
        description: 'Defines the separator direction',
        type: '"horizontal" | "vertical"',
        default: 'horizontal',
      },
    ],
  },
];
