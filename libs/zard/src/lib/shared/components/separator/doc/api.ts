import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const SEPARATOR_API: ApiSection[] = [
  {
    selector: 'z-separator',
    description: 'Visually or semantically separates content with a horizontal or vertical line.',
    props: [
      {
        name: '[zOrientation]',
        description: 'The orientation of the separator.',
        type: '"horizontal" | "vertical"',
        default: 'horizontal',
      },
      {
        name: '[zDecorative]',
        description:
          'When true, indicates that the separator is purely decorative and removes it from the accessibility tree.',
        type: 'boolean',
        default: 'true',
      },
      {
        name: '[class]',
        description: 'Override or extend the default classes (margin, color, etc).',
        type: 'ClassValue',
        default: '-',
      },
    ],
  },
];
