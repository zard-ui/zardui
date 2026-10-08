import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const SKELETON_API: ApiSection[] = [
  {
    selector: 'z-skeleton',
    description:
      'Renders a customizable placeholder during data loading to improve perceived performance and prevent layout shifts. `class` is the only input — size and shape the placeholder yourself with utility classes (`size-12 rounded-full`, `h-4 w-full`, ...) to match the content it stands in for.',
    props: [
      {
        name: '[class]',
        description: 'Custom CSS classes sizing and shaping the placeholder',
        type: 'string',
        default: "''",
      },
    ],
  },
];
