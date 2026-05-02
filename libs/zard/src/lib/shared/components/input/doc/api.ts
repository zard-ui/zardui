import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const INPUT_API: ApiSection[] = [
  {
    selector: 'z-input, input[z-input]',
    description: 'A form input field. Usable as a component or as a directive on a native input.',
    props: [
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      { name: '[(value)]', description: 'Input value (two-way binding)', type: 'string', default: "''" },
      { name: '[zSize]', description: 'Input size', type: "'default' | 'sm' | 'lg'", default: "'default'" },
      { name: '[zStatus]', description: 'Validation status', type: "'error' | 'warning' | 'success'", default: 'null' },
      { name: '[zBorderless]', description: 'Render without border or focus ring', type: 'boolean', default: 'false' },
      {
        name: '[zType]',
        description: "Native input type, e.g. 'text' | 'email' | 'password' (z-input only)",
        type: 'string',
        default: "'text'",
      },
      { name: '[zDisabled]', description: 'Disabled state (z-input only)', type: 'boolean', default: 'false' },
      { name: '[zReadonly]', description: 'Readonly state (z-input only)', type: 'boolean', default: 'false' },
      {
        name: '[zInvalid]',
        description: 'Invalid state, sets aria-invalid (z-input only)',
        type: 'boolean',
        default: 'false',
      },
      { name: '[zPlaceholder]', description: 'Placeholder (z-input only)', type: 'string', default: "''" },
      { name: '[zName]', description: 'Form name (z-input only)', type: 'string', default: "''" },
    ],
  },
];
