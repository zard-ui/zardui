import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const CHECKBOX_API: ApiSection[] = [
  {
    selector: 'z-checkbox',
    description: 'Toggles between checked and unchecked.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      { name: '[zDisabled]', description: 'Disables the checkbox', type: 'boolean', default: 'false' },
      { name: '[zInvalid]', description: 'Sets `aria-invalid`', type: 'boolean', default: 'false' },
      { name: '[zId]', description: 'Checkbox id', type: 'string', default: 'auto-generated' },
      {
        name: '(checkChange)',
        description: 'Emitted when the checked state changes',
        type: 'EventEmitter<boolean>',
        default: '-',
      },
    ],
  },
];
