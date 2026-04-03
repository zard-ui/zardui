import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const CHECKBOX_API: ApiSection[] = [
  {
    selector: 'z-checkbox',
    description: 'A customizable checkbox directive with minimal configuration.',
    props: [
      { name: 'zType', description: 'Checkbox type', type: "'default' | 'destructive'", default: "'default'" },
      { name: 'zSize', description: 'Checkbox size', type: "'default' | 'lg'", default: "'default'" },
      { name: 'zShape', description: 'Checkbox shape', type: "'default' | 'circle' | 'square'", default: "'default'" },
      { name: 'zDisabled', description: 'Checkbox disabled state', type: 'boolean', default: 'false' },
    ],
  },
];
