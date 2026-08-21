import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const ASPECT_RATIO_API: ApiSection[] = [
  {
    selector: 'z-aspect-ratio',
    description: 'Displays content within a desired ratio.',
    props: [
      {
        name: 'zRatio',
        description: "Desired ratio: 16 / 9 or '16 / 9'. Default 1 (square)",
        type: 'number | string',
        default: '1',
      },
      { name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
];
