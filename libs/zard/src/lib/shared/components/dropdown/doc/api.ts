import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const DROPDOWN_API: ApiSection[] = [
  {
    selector: 'z-dropdown',
    description: 'A dropdown trigger directive that handles dropdown interactions.',
    props: [
      {
        name: '[zDropdownMenu]',
        description: 'Reference to dropdown menu content',
        type: 'ZardDropdownMenuContentComponent',
        default: '-',
      },
      { name: '[zTrigger]', description: 'Trigger type for dropdown', type: "'click' | 'hover'", default: "'click'" },
      { name: '[zDisabled]', description: 'Disables the dropdown trigger', type: 'boolean', default: 'false' },
    ],
  },
  {
    selector: 'z-dropdown-menu',
    description: 'Legacy dropdown component with built-in overlay management.',
    props: [
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      { name: '[disabled]', description: 'Disables the dropdown', type: 'boolean', default: 'false' },
    ],
  },
  {
    selector: 'z-dropdown-menu-content',
    description: 'Container for dropdown menu items with proper accessibility attributes.',
    props: [{ name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-dropdown-menu-item',
    description: 'Individual clickable items within the dropdown menu.',
    props: [
      {
        name: '[variant]',
        description: 'Visual variant of the item',
        type: "'default' | 'destructive'",
        default: "'default'",
      },
      { name: '[inset]', description: 'Adds left padding for alignment', type: 'boolean', default: 'false' },
      { name: '[disabled]', description: 'Disables the dropdown item', type: 'boolean', default: 'false' },
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
];
