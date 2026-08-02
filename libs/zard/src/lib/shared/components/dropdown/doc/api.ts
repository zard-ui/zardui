import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const DROPDOWN_API: ApiSection[] = [
  {
    selector: 'z-dropdown',
    description: 'Trigger directive that opens a linked dropdown menu content template.',
    props: [
      {
        name: '[zDropdownMenu]',
        description: 'Reference to the `z-dropdown-menu-content` template exported as `zDropdownMenuContent`.',
        type: 'ZardDropdownMenuContentComponent',
        default: '-',
      },
      {
        name: '[zTrigger]',
        description: 'Interaction used to open the dropdown.',
        type: "'click' | 'hover'",
        default: "'click'",
      },
      { name: '[zDisabled]', description: 'Disables the dropdown trigger', type: 'boolean', default: 'false' },
    ],
  },
  {
    selector: 'z-dropdown-menu',
    description: 'Projected dropdown component with built-in trigger and overlay management.',
    props: [
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      { name: '[disabled]', description: 'Disables the dropdown', type: 'boolean', default: 'false' },
      {
        name: '[zDisabled]',
        description: 'Disables the dropdown using the Zard-prefixed API.',
        type: 'boolean',
        default: 'false',
      },
    ],
  },
  {
    selector: 'z-dropdown-menu-content',
    description: 'Reusable content template displayed by a `z-dropdown` trigger.',
    props: [{ name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-dropdown-menu-item',
    description: 'Clickable menu item that closes the dropdown after selection.',
    props: [
      {
        name: '[zType]',
        description: 'Visual type of the item.',
        type: "'default' | 'destructive'",
        default: "'default'",
      },
      {
        name: '[variant]',
        description: 'Visual variant of the item',
        type: "'default' | 'destructive'",
        default: "'default'",
      },
      { name: '[zInset]', description: 'Adds left padding for alignment.', type: 'boolean', default: 'false' },
      { name: '[inset]', description: 'Adds left padding for alignment', type: 'boolean', default: 'false' },
      { name: '[zDisabled]', description: 'Disables the dropdown item.', type: 'boolean', default: 'false' },
      { name: '[disabled]', description: 'Disables the dropdown item', type: 'boolean', default: 'false' },
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-dropdown-menu-label',
    description: 'Label for grouping dropdown menu items.',
    props: [
      { name: '[zInset]', description: 'Adds left padding for alignment.', type: 'boolean', default: 'false' },
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-dropdown-menu-separator',
    description: 'Visual separator between dropdown menu sections.',
    props: [{ name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-dropdown-menu-shortcut',
    description: 'Right-aligned shortcut text inside a dropdown menu item.',
    props: [{ name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-dropdown-menu-checkbox-item',
    description: 'Checkbox-style dropdown menu item with checked state and menuitemcheckbox semantics.',
    props: [
      { name: '[(zChecked)]', description: 'Checked state for the checkbox item.', type: 'boolean', default: 'false' },
      { name: '[zDisabled]', description: 'Disables the checkbox item.', type: 'boolean', default: 'false' },
      {
        name: '[zType]',
        description: 'Visual type of the item.',
        type: "'default' | 'destructive'",
        default: "'default'",
      },
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-dropdown-menu-radio-group',
    description: 'Radio group wrapper for dropdown menu radio items.',
    props: [
      {
        name: '[(zValue)]',
        description: 'Selected radio item value.',
        type: 'string | undefined',
        default: 'undefined',
      },
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-dropdown-menu-radio-item',
    description: 'Radio-style dropdown menu item with menuitemradio semantics.',
    props: [
      { name: '[zValue]', description: 'Value represented by this radio item.', type: 'string', default: '-' },
      { name: '[zDisabled]', description: 'Disables the radio item.', type: 'boolean', default: 'false' },
      {
        name: '[zType]',
        description: 'Visual type of the item.',
        type: "'default' | 'destructive'",
        default: "'default'",
      },
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
];
