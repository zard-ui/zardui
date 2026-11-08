import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const TEXTAREA_API: ApiSection[] = [
  {
    selector: 'textarea[z-textarea]',
    description: 'Styles a native `<textarea>` that grows with its content.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      { name: '[value]', description: 'Textarea value', type: 'string', default: "''" },
      { name: '[(value)]', description: 'Textarea value', type: 'string', default: "''" },
    ],
  },
];
