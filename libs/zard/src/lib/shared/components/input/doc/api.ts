import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const INPUT_API: ApiSection[] = [
  {
    selector: 'input[z-input]',
    description: 'Styles a native `<input>`; native attributes work as usual.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      { name: '[value]', description: 'Input value', type: 'string | number | null', default: 'null' },
      { name: '[(value)]', description: 'Input value', type: 'string | number | null', default: 'null' },
    ],
  },
];
