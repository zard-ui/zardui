import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const BADGE_API: ApiSection[] = [
  {
    selector: 'z-badge',
    description: 'Displays a badge or a component that looks like a badge.',
    props: [
      {
        name: 'zType',
        description: 'Badge type',
        type: "'default' | 'secondary' | 'destructive' | 'outline'",
        default: "'default'",
      },
      { name: 'zShape', description: 'Badge shape', type: "'default' | 'square' | 'pill'", default: "'default'" },
    ],
  },
];
