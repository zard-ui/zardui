import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const NATIVE_SELECT_API: ApiSection[] = [
  {
    selector: 'select[z-native-select]',
    description: 'Styles a native `<select>`; forms and native attributes work as usual.',
    props: [
      {
        name: '[zSize]',
        description: 'Size; `default` matches `z-input`',
        type: "'sm' | 'default' | 'lg'",
        default: "'default'",
      },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
];
