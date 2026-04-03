import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const SKELETON_API: ApiSection[] = [
  {
    selector: '[z-skeleton]',
    description:
      'Renders a customizable placeholder during data loading to improve perceived performance and prevent layout shifts.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" }],
  },
];
