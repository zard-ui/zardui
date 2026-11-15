import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const MENUBAR_API: ApiSection[] = [
  {
    selector: 'z-menubar',
    description:
      'The bar. Keeps a single tab stop over its triggers, moves between them with `←`/`→` and switches the open menu on hover.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: '[z-menubar-trigger]',
    description: 'One menu of the bar: put it on a button inside `z-menubar`.',
    props: [
      {
        name: '[zMenubarMenu]',
        description:
          'Menu content opened by this trigger (`#ref="zDropdownMenuContent"`). Opens 4px further than its `zSideOffset`, as in shadcn',
        type: 'ZardDropdownMenuContentComponent',
        default: '-',
      },
      {
        name: '[zDisabled]',
        description: 'Disables the trigger; arrow navigation skips it',
        type: 'boolean',
        default: 'false',
      },
      { name: '[zVisible]', description: 'Opens or closes this menu', type: 'boolean', default: 'false' },
      {
        name: '[(zVisible)]',
        description: 'Open state of this menu, two-way bound',
        type: 'boolean',
        default: 'false',
      },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-dropdown-menu-content',
    description: 'Menu surface; the rows are the same `z-dropdown-menu-*` primitives the dropdown uses.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zSide]',
        description: 'Trigger edge the menu opens from',
        type: "'top' | 'right' | 'bottom' | 'left'",
        default: "'bottom'",
      },
      {
        name: '[zAlign]',
        description: 'Alignment along that edge',
        type: "'start' | 'center' | 'end'",
        default: "'start'",
      },
      { name: '[zSideOffset]', description: 'Gap from the trigger in px', type: 'number', default: '4' },
    ],
  },
  {
    selector: 'z-dropdown-menu-item',
    description: 'Clickable row that closes the menu on select.',
    props: [
      { name: '[zType]', description: 'Visual style', type: "'default' | 'destructive'", default: "'default'" },
      { name: '[zInset]', description: 'Adds start padding for alignment', type: 'boolean', default: 'false' },
      { name: '[zDisabled]', description: 'Disables the item', type: 'boolean', default: 'false' },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-dropdown-menu-checkbox-item',
    description: 'Row with a checked state.',
    props: [
      { name: '[(zChecked)]', description: 'Checked state', type: 'boolean', default: 'false' },
      { name: '[zDisabled]', description: 'Disables the item', type: 'boolean', default: 'false' },
      { name: '[zType]', description: 'Visual style', type: "'default' | 'destructive'", default: "'default'" },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-dropdown-menu-radio-group',
    description: 'Wrapper for radio items.',
    props: [
      { name: '[(zValue)]', description: 'Selected value', type: 'string | undefined', default: 'undefined' },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-dropdown-menu-radio-item',
    description: 'Row with radio semantics.',
    props: [
      { name: '[zValue]', description: 'Item value', type: 'string', default: '-' },
      { name: '[zDisabled]', description: 'Disables the item', type: 'boolean', default: 'false' },
      { name: '[zType]', description: 'Visual style', type: "'default' | 'destructive'", default: "'default'" },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-dropdown-menu-sub-trigger',
    description: 'Row that opens a nested menu.',
    props: [
      {
        name: '[zSubMenu]',
        description: 'Submenu content (`#ref="zDropdownMenuSubContent"`)',
        type: 'ZardDropdownMenuSubContentComponent | TemplateRef<unknown>',
        default: '-',
      },
      { name: '[zInset]', description: 'Adds start padding for alignment', type: 'boolean', default: 'false' },
      { name: '[zDisabled]', description: 'Disables the sub-trigger', type: 'boolean', default: 'false' },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-dropdown-menu-sub-content',
    description: 'Submenu surface; opens beside its trigger and flips when needed.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-dropdown-menu-label',
    description: 'Group label.',
    props: [
      { name: '[inset]', description: 'Adds start padding for alignment', type: 'boolean', default: 'false' },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-dropdown-menu-group',
    description: 'Groups related rows.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-dropdown-menu-separator',
    description: 'Divider between sections.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-dropdown-menu-shortcut',
    description: 'Keyboard hint inside a row.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
];
