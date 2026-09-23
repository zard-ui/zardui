import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const CONTEXT_MENU_API: ApiSection[] = [
  {
    selector: 'z-context-menu',
    description: 'Trigger directive. Opens the linked menu at the pointer, replacing the browser menu.',
    props: [
      {
        name: '[zContextMenuTriggerFor]',
        description: 'Menu content opened at the pointer, exported as `zDropdownMenuContent`.',
        type: 'ZardDropdownMenuContentComponent | TemplateRef<void>',
        default: '-',
      },
      {
        name: '[zDisabled]',
        description: 'Disables the trigger and restores the native browser menu.',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '(zVisibleChange)',
        description: 'Emits when the menu opens or closes.',
        type: 'EventEmitter<boolean>',
        default: '-',
      },
    ],
  },
  {
    selector: 'ZardContextMenuService',
    description:
      'Opens a menu at a pointer event or a coordinate, for one shared menu serving many rows. Injected with `inject(ZardContextMenuService)`.',
    props: [
      {
        name: 'create()',
        description: 'Opens `menu` at the event or coordinate. Options take a `focusOrigin` and a `viewContainerRef`.',
        type: '(origin: MouseEvent | { x: number; y: number }, menu: ZardDropdownMenuContentComponent | TemplateRef<void>, options?: ZardContextMenuOptions) => void',
        default: '-',
      },
      { name: 'close()', description: 'Closes the open context menu.', type: '() => void', default: '-' },
      {
        name: 'isOpen',
        description: 'Whether a menu is currently on screen.',
        type: 'Signal<boolean>',
        default: 'false',
      },
    ],
  },
  {
    selector: 'z-dropdown-menu-content',
    description: 'The menu surface. Every item primitive below is declared inside it.',
    props: [{ name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-dropdown-menu-item',
    description: 'Clickable menu row that closes the menu after selection.',
    props: [
      {
        name: '[zType]',
        description: 'Visual type of the item.',
        type: "'default' | 'destructive'",
        default: "'default'",
      },
      { name: '[zInset]', description: 'Adds left padding for alignment.', type: 'boolean', default: 'false' },
      { name: '[zDisabled]', description: 'Disables the item.', type: 'boolean', default: 'false' },
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-dropdown-menu-sub-trigger',
    description: 'Menu row that opens a nested menu to its side, on hover, click or `ArrowRight`.',
    props: [
      {
        name: '[zSubMenu]',
        description: 'Submenu content, exported as `zDropdownMenuSubContent`.',
        type: 'ZardDropdownMenuSubContentComponent | TemplateRef<unknown>',
        default: '-',
      },
      { name: '[zInset]', description: 'Adds left padding for alignment.', type: 'boolean', default: 'false' },
      { name: '[zDisabled]', description: 'Disables the sub-trigger.', type: 'boolean', default: 'false' },
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-dropdown-menu-sub-content',
    description: 'Surface of a submenu. Declared next to its sub-trigger and referenced by it.',
    props: [{ name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-dropdown-menu-checkbox-item',
    description: 'Menu row with a checked state and `menuitemcheckbox` semantics.',
    props: [
      { name: '[(zChecked)]', description: 'Checked state for the item.', type: 'boolean', default: 'false' },
      { name: '[zDisabled]', description: 'Disables the item.', type: 'boolean', default: 'false' },
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-dropdown-menu-radio-group',
    description: 'Radio group wrapper for menu radio items.',
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
    description: 'Menu row with `menuitemradio` semantics.',
    props: [
      { name: '[zValue]', description: 'Value represented by this radio item.', type: 'string', default: '-' },
      { name: '[zDisabled]', description: 'Disables the item.', type: 'boolean', default: 'false' },
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-dropdown-menu-group',
    description: 'Groups related rows under a shared label.',
    props: [{ name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-dropdown-menu-label',
    description: 'Label naming a group of rows.',
    props: [
      { name: '[inset]', description: 'Adds left padding for alignment.', type: 'boolean', default: 'false' },
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-dropdown-menu-separator',
    description: 'Divider between menu sections.',
    props: [{ name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-dropdown-menu-shortcut',
    description: 'Right-aligned keyboard hint inside a menu row.',
    props: [{ name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
];
