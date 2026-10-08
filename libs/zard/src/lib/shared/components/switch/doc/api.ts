import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const SWITCH_API: ApiSection[] = [
  {
    selector: 'z-switch',
    description: 'A control that toggles between checked and unchecked, built on a native button with role="switch".',
    props: [
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      { name: '[zChecked]', description: 'Checked state, two-way bindable', type: 'boolean', default: 'false' },
      { name: '[(zChecked)]', description: 'Checked state (two-way binding)', type: 'boolean', default: 'false' },
      { name: '[zId]', description: 'Id applied to the underlying button', type: 'string', default: '-' },
      { name: '[zSize]', description: 'Switch size', type: "'default' | 'sm'", default: "'default'" },
      { name: '[zDisabled]', description: 'Disables the switch', type: 'boolean', default: 'false' },
      { name: '[zInvalid]', description: 'Invalid state (sets aria-invalid)', type: 'boolean', default: 'false' },
    ],
  },
];
