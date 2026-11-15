import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const SPINNER_API: ApiSection[] = [
  {
    selector: 'z-spinner',
    description: 'Loading indicator.',
    props: [
      { name: '[zAriaLabel]', description: 'Text announced by screen readers', type: 'string', default: "'Loading'" },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: 'size-4 animate-spin' },
      {
        name: '[zIcon]',
        description: 'Custom icon template; receives the classes as `$implicit`',
        type: 'TemplateRef<{ $implicit: string }>',
        default: '-',
      },
    ],
  },
];
