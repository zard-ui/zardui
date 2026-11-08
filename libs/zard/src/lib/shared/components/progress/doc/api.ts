import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const PROGRESS_API: ApiSection[] = [
  {
    selector: 'z-progress',
    description: 'Shows the completion progress of a task.',
    props: [
      { name: '[value]', description: 'Progress from 0 to 100, clamped', type: 'number', default: '0' },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' },
    ],
  },
];
