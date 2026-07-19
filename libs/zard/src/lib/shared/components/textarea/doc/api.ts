import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const TEXTAREA_API: ApiSection[] = [
  {
    selector: 'textarea[z-textarea]',
    description:
      'A multi-line text input directive applied to a native textarea. All native HTML textarea attributes (placeholder, name, disabled, readonly, aria-invalid, etc.) are supported.',
    props: [
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      { name: '[(value)]', description: 'Textarea value (two-way binding)', type: 'string', default: "''" },
    ],
  },
];
