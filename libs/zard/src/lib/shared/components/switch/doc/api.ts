import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const SWITCH_API: ApiSection[] = [
  {
    selector: 'z-switch',
    description: 'Toggles between checked and unchecked.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      { name: '[zChecked]', description: 'Checked state', type: 'boolean', default: 'false' },
      { name: '[(zChecked)]', description: 'Checked state', type: 'boolean', default: 'false' },
      { name: '[zId]', description: 'Id of the inner button', type: 'string', default: '-' },
      { name: '[zSize]', description: 'Switch size', type: "'default' | 'sm'", default: "'default'" },
      { name: '[zDisabled]', description: 'Disables the switch', type: 'boolean', default: 'false' },
      { name: '[zInvalid]', description: 'Sets `aria-invalid`', type: 'boolean', default: 'false' },
    ],
  },
];
