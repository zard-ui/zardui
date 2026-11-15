import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const DROPDOWN_API: ApiSection[] = [
  {
    selector: '[z-dropdown]',
    description: 'Trigger directive that opens a `z-dropdown-menu-content`.',
    props: [
      {
        name: '[zDropdownMenu]',
        description: 'Menu content to open (`#ref="zDropdownMenuContent"`)',
        type: 'ZardDropdownMenuContentComponent',
        default: '-',
      },
      {
        name: '[zTrigger]',
        description: 'Interaction that opens the menu',
        type: "'click' | 'hover'",
        default: "'click'",
      },
      { name: '[zDisabled]', description: 'Disables the trigger', type: 'boolean', default: 'false' },
    ],
  },
  {
    selector: 'z-dropdown-menu',
    description: 'All-in-one trigger and menu, with the trigger projected via `[dropdown-trigger]`.',
    props: [
      { name: '(openChange)', description: 'Emits when the menu opens or closes', type: 'boolean', default: '—' },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      { name: '[disabled]', description: 'Disables the dropdown', type: 'boolean', default: 'false' },
      { name: '[zDisabled]', description: 'Alias of `disabled`', type: 'boolean', default: 'false' },
    ],
  },
  {
    selector: 'z-dropdown-menu-content',
    description: 'Menu surface opened by `[z-dropdown]`.',
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
    selector: 'z-dropdown-menu-group',
    description: 'Groups related rows.',
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
    selector: 'z-dropdown-menu-item',
    description: 'Clickable row that closes the menu on select.',
    props: [
      { name: '[zType]', description: 'Visual style', type: "'default' | 'destructive'", default: "'default'" },
      { name: '[zInset]', description: 'Adds start padding for alignment', type: 'boolean', default: 'false' },
      { name: '[inset]', description: 'Alias of `zInset`', type: 'boolean', default: 'false' },
      { name: '[zDisabled]', description: 'Disables the item', type: 'boolean', default: 'false' },
      { name: '[disabled]', description: 'Alias of `zDisabled`', type: 'boolean', default: 'false' },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
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
  {
    selector: 'z-dropdown-menu-checkbox-item',
    description: 'Row with a checked state.',
    props: [
      { name: '[zChecked]', description: 'Checked state', type: 'boolean', default: 'false' },
      { name: '[(zChecked)]', description: 'Two-way bound checked state', type: 'boolean', default: 'false' },
      { name: '[zDisabled]', description: 'Disables the item', type: 'boolean', default: 'false' },
      { name: '[disabled]', description: 'Alias of `zDisabled`', type: 'boolean', default: 'false' },
      { name: '[zType]', description: 'Visual style', type: "'default' | 'destructive'", default: "'default'" },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-dropdown-menu-radio-group',
    description: 'Wrapper for radio items.',
    props: [
      { name: '[zValue]', description: 'Selected value', type: 'string | undefined', default: 'undefined' },
      {
        name: '[(zValue)]',
        description: 'Two-way bound selected value',
        type: 'string | undefined',
        default: 'undefined',
      },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-dropdown-menu-radio-item',
    description: 'Row with radio semantics.',
    props: [
      { name: '[zValue]', description: 'Item value', type: 'string', default: '-' },
      { name: '[zDisabled]', description: 'Disables the item', type: 'boolean', default: 'false' },
      { name: '[disabled]', description: 'Alias of `zDisabled`', type: 'boolean', default: 'false' },
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
];
