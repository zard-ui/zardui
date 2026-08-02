import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const CHECKBOX_API: ApiSection[] = [
  {
    selector: 'z-checkbox',
    description: 'A control that allows the user to toggle between checked and not checked.',
    props: [
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      { name: '[zDisabled]', description: 'Checkbox disabled state', type: 'boolean', default: 'false' },
      {
        name: '[zInvalid]',
        description: 'Checkbox invalid state (sets aria-invalid)',
        type: 'boolean',
        default: 'false',
      },
      { name: '[zId]', description: 'Checkbox id', type: 'string', default: 'auto-generated' },
      {
        name: '(checkChange)',
        description: 'Emits when the checkbox value changes',
        type: 'EventEmitter<boolean>',
        default: '-',
      },
    ],
  },
];
