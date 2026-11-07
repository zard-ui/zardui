import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const ASPECT_RATIO_API: ApiSection[] = [
  {
    selector: 'z-aspect-ratio',
    description: 'Displays content within a desired ratio.',
    props: [
      { name: 'zRatio', description: 'Width-to-height ratio, e.g. `16 / 9`', type: 'number | string', default: '1' },
      { name: 'class', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
];
