import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const TEXTAREA_API: ApiSection[] = [
  {
    selector: 'z-textarea, textarea[z-textarea]',
    description: 'A multi-line text input field. Usable as a component or as a directive on a native textarea.',
    props: [
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      { name: '[(value)]', description: 'Textarea value (two-way binding)', type: 'string', default: "''" },
      { name: '[zStatus]', description: 'Validation status', type: "'error' | 'warning' | 'success'", default: 'null' },
      { name: '[zBorderless]', description: 'Render without border or focus ring', type: 'boolean', default: 'false' },
      { name: '[zDisabled]', description: 'Disabled state (z-textarea only)', type: 'boolean', default: 'false' },
      { name: '[zReadonly]', description: 'Readonly state (z-textarea only)', type: 'boolean', default: 'false' },
      {
        name: '[zInvalid]',
        description: 'Invalid state, sets aria-invalid (z-textarea only)',
        type: 'boolean',
        default: 'false',
      },
      { name: '[zPlaceholder]', description: 'Placeholder (z-textarea only)', type: 'string', default: "''" },
      { name: '[zName]', description: 'Form name (z-textarea only)', type: 'string', default: "''" },
      {
        name: '[zRows]',
        description: 'Number of visible text lines (z-textarea only)',
        type: 'number',
        default: 'null',
      },
    ],
  },
];
