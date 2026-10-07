import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const INPUT_API: ApiSection[] = [
  {
    selector: 'input[z-input]',
    description:
      'A directive that styles a native `<input>` element. All native HTML input attributes (`type`, `placeholder`, `disabled`, `required`, `readonly`, `aria-invalid`, etc.) keep working as-is.',
    props: [
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[value]',
        description: 'Input value, two-way bindable',
        type: 'string | number | null',
        default: 'null',
      },
      {
        name: '[(value)]',
        description: 'Input value (two-way binding)',
        type: 'string | number | null',
        default: 'null',
      },
    ],
  },
];
