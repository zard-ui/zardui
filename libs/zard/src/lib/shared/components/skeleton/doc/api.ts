import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const SKELETON_API: ApiSection[] = [
  {
    selector: 'z-skeleton',
    description: 'Loading placeholder; size and shape it with `class`.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" }],
  },
];
