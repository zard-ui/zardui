import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const TOGGLE_GROUP_API: ApiSection[] = [
  {
    selector: 'z-toggle-group',
    description: 'A set of two-state buttons that can be pressed or released, with multiple selections supported.',
    props: [
      { name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      {
        name: 'zDefaultValue',
        description: 'Default value',
        type: 'string | string[]',
        default: '-',
      },
      {
        name: 'zDisabled',
        description: 'Whether the entire group is disabled',
        type: 'boolean',
        default: 'false',
      },
      {
        name: 'zItems',
        description: 'Array of toggle items to display',
        type: 'ZardToggleGroupItem[]',
        default: '[]',
      },
      {
        name: 'zMode',
        description: 'Selection mode — single allows one active toggle, multiple allows many',
        type: "'single' | 'multiple'",
        default: "'multiple'",
      },
      {
        name: 'zOrientation',
        description: 'Layout direction of the toggle group',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
      },
      {
        name: 'zSize',
        description: 'Size variant of the toggle group',
        type: "'default' | 'sm' | 'lg'",
        default: "'default'",
      },
      {
        name: 'zSpacing',
        description: 'Gap spacing between toggle items',
        type: 'number',
        default: '0',
      },
      {
        name: 'zType',
        description: 'Visual style variant',
        type: "'default' | 'outline'",
        default: "'default'",
      },
      {
        name: 'zValue',
        description: 'Controlled value of the toggle group',
        type: 'string | string[] | undefined',
        default: '-',
      },
      {
        name: 'valueChange',
        description: 'Emitted when toggle state changes, returns updated value',
        type: 'output<string | string[]>',
        default: '-',
      },
    ],
  },
];
