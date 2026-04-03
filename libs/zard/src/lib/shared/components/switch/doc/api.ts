import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const SWITCH_API: ApiSection[] = [
  {
    selector: '[z-switch]',
    description: 'A customizable switch with minimal configuration.',
    props: [
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      { name: '[(zChecked)]', description: 'Switch state (two-way binding)', type: 'boolean', default: 'true' },
      { name: '[zDisabled]', description: 'Switch disabled state', type: 'boolean', default: 'false' },
      { name: '[zId]', description: 'Switch id', type: 'string', default: '-' },
      { name: '[zType]', description: 'Switch type', type: "'default' | 'destructive'", default: "'default'" },
      { name: '[zSize]', description: 'Switch size', type: "'default' | 'sm' | 'lg'", default: "'default'" },
    ],
  },
];
