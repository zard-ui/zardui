import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const PROGRESS_API: ApiSection[] = [
  {
    selector: 'z-progress',
    description: 'Displays an indicator showing the completion progress of a task.',
    props: [
      {
        name: '[value]',
        description: 'Current progress value between 0 and 100. Values outside this range are clamped.',
        type: 'number',
        default: '0',
      },
      {
        name: '[class]',
        description: 'Override or extend the default classes (height, color, etc).',
        type: 'ClassValue',
        default: '-',
      },
    ],
  },
];
