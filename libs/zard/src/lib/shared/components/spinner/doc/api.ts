import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const SPINNER_API: ApiSection[] = [
  {
    selector: 'z-spinner',
    description: 'A simple loading indicator built on the Lucide loader-circle icon.',
    props: [
      {
        name: '[class]',
        description: 'Override or extend the default classes (size, color, animation duration).',
        type: 'ClassValue',
        default: 'size-4 animate-spin',
      },
      {
        name: '[zIcon]',
        description:
          'Custom icon template. Receives the merged classes via `$implicit` so the icon stays in sync with the spinner sizing/animation.',
        type: 'TemplateRef<{ $implicit: string }>',
        default: '-',
      },
    ],
  },
];
