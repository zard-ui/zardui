import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const TOGGLE_GROUP_API: ApiSection[] = [
  {
    selector: 'z-toggle-group',
    description: 'A set of two-state buttons that can be pressed or released, with multiple selections supported.',
    props: [
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zDefaultValue]',
        description: "Uncontrolled initial value — a string when zMode is 'single', a string[] when 'multiple'",
        type: 'string | string[]',
        default: '-',
      },
      {
        name: '[zDisabled]',
        description: 'Whether the entire group is disabled',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[zItemClass]',
        description: 'Additional CSS classes for group item',
        type: 'ClassValue',
        default: "''",
      },
      {
        name: '[zItems]',
        description: 'Array of toggle items to display',
        type: 'ZardToggleGroupItem[]',
        default: '[]',
      },
      {
        name: '[zMode]',
        description:
          "Selection mode: 'single' binds a string value and allows one pressed item at a time; 'multiple' binds a string[] value and allows any number pressed",
        type: "'single' | 'multiple'",
        default: "'multiple'",
      },
      {
        name: '[zOrientation]',
        description: 'Layout direction of the toggle group',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
      },
      {
        name: '[zSize]',
        description: 'Size variant of the toggle group',
        type: "'sm' | 'default' | 'lg'",
        default: "'default'",
      },
      {
        name: '[zSpacing]',
        description: 'Gap between items in spacing units. `0` joins them into a single bar',
        type: 'number',
        default: '2',
      },
      {
        name: '[zType]',
        description: 'Visual style variant',
        type: "'default' | 'outline'",
        default: "'default'",
      },
      {
        name: '[zValue]',
        description:
          "Controlled value of the toggle group — a string when zMode is 'single', a string[] when 'multiple'",
        type: 'string | string[] | undefined',
        default: '-',
      },
      {
        name: '(valueChange)',
        description: 'Emitted when toggle state changes, returns the updated value in the shape matching zMode',
        type: 'EventEmitter<string | string[]>',
        default: '-',
      },
    ],
  },
];
