import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const TOGGLE_GROUP_API: ApiSection[] = [
  {
    selector: 'z-toggle-group',
    description: 'A set of two-state buttons that can be pressed or released, with multiple selections supported.',
    props: [
      { name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      {
        name: 'zDefault',
        description: 'Default value when using with forms',
        type: 'ToggleGroupValue[]',
        default: '[]',
      },
      { name: 'zDisabled', description: 'Whether the entire group is disabled', type: 'boolean', default: 'false' },
      { name: 'zSize', description: 'Size variant of the toggle group', type: "'sm' | 'md' | 'lg'", default: "'md'" },
      { name: 'zValue', description: 'Array of toggle items to display', type: 'ToggleGroupValue[]', default: '[]' },
      {
        name: 'onClick',
        description: 'Emitted when any toggle is clicked, returns current state',
        type: 'EventEmitter<ToggleGroupValue[]>',
        default: '-',
      },
      {
        name: 'onHover',
        description: 'Emitted when mouse hovers over any toggle',
        type: 'EventEmitter<void>',
        default: '-',
      },
      {
        name: 'onChange',
        description: 'Emitted when toggle state changes, returns updated array',
        type: 'EventEmitter<ToggleGroupValue[]>',
        default: '-',
      },
    ],
  },
];
