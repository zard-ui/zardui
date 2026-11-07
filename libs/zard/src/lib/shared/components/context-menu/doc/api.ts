import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const CONTEXT_MENU_API: ApiSection[] = [
  {
    selector: 'z-context-menu',
    description: 'Trigger directive that opens the menu at the pointer.',
    props: [
      {
        name: '[zContextMenuTriggerFor]',
        description: 'Menu content (`#ref="zDropdownMenuContent"`)',
        type: 'ZardDropdownMenuContentComponent | TemplateRef<void>',
        default: '-',
      },
      {
        name: '[zDisabled]',
        description: 'Disables it and restores the native menu',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '(zVisibleChange)',
        description: 'Emits when the menu opens or closes',
        type: 'EventEmitter<boolean>',
        default: '-',
      },
    ],
  },
  {
    selector: 'ZardContextMenuService',
    description: 'Opens one shared menu at a pointer event or coordinate.',
    props: [
      {
        name: 'create()',
        description: 'Opens `menu` at the event or coordinate',
        type: '(origin: MouseEvent | { x: number; y: number }, menu: ZardDropdownMenuContentComponent | TemplateRef<void>, options?: ZardContextMenuOptions) => void',
        default: '-',
      },
      { name: 'close()', description: 'Closes the open menu', type: '() => void', default: '-' },
      { name: 'isOpen', description: 'A menu is on screen', type: 'Signal<boolean>', default: 'false' },
    ],
  },
  {
    selector: 'z-dropdown-menu-content',
    description: 'Menu surface; placement is automatic, so `zSide`/`zAlign` have no effect.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
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
