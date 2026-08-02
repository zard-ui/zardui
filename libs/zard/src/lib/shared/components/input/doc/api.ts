import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const INPUT_API: ApiSection[] = [
  {
    selector: 'z-input, input[z-input]',
    description:
      'A form input field. Usable as a component or as a directive on a native input. All native HTML input attributes (placeholder, name, disabled, readonly, aria-invalid, etc.) are supported on the directive form.',
    props: [
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      { name: '[(value)]', description: 'Input value (two-way binding)', type: 'string', default: "''" },
      { name: '[zType]', description: 'Native input type (z-input only)', type: 'string', default: "'text'" },
    ],
  },
];
