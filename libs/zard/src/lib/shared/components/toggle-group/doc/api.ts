import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const TOGGLE_GROUP_API: ApiSection[] = [
  {
    selector: 'z-toggle-group',
    description: 'A set of toggle buttons with single or multiple selection.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zDefaultValue]',
        description: 'Uncontrolled initial value, shaped by `zMode`',
        type: 'string | string[]',
        default: '-',
      },
      { name: '[zDisabled]', description: 'Disables the whole group', type: 'boolean', default: 'false' },
      { name: '[zItemClass]', description: 'CSS classes for each item', type: 'ClassValue', default: "''" },
      { name: '[zItems]', description: 'Toggle items to render', type: 'ZardToggleGroupItem[]', default: '[]' },
      {
        name: '[zMode]',
        description: 'One pressed item (string) or many (string[])',
        type: "'single' | 'multiple'",
        default: "'multiple'",
      },
      {
        name: '[zOrientation]',
        description: 'Layout direction',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
      },
      { name: '[zSize]', description: 'Item size', type: "'sm' | 'default' | 'lg'", default: "'default'" },
      { name: '[zSpacing]', description: 'Gap between items; `0` joins them', type: 'number', default: '2' },
      { name: '[zType]', description: 'Visual variant', type: "'default' | 'outline'", default: "'default'" },
      {
        name: '[zValue]',
        description: 'Controlled value, shaped by `zMode`',
        type: 'string | string[] | undefined',
        default: '-',
      },
      {
        name: '(valueChange)',
        description: 'Emitted with the new value',
        type: 'EventEmitter<string | string[]>',
        default: '-',
      },
    ],
  },
];
