import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const DROPDOWN_API: ApiSection[] = [
  {
    selector: '[z-dropdown]',
    description: 'Trigger directive. Opens the linked `z-dropdown-menu-content` next to the element it is set on.',
    props: [
      {
        name: '[zDropdownMenu]',
        description: 'The `z-dropdown-menu-content` to open, exported as `zDropdownMenuContent`.',
        type: 'ZardDropdownMenuContentComponent',
        default: '-',
      },
      {
        name: '[zTrigger]',
        description: 'Interaction that opens the dropdown.',
        type: "'click' | 'hover'",
        default: "'click'",
      },
      { name: '[zDisabled]', description: 'Disables the trigger.', type: 'boolean', default: 'false' },
    ],
  },
  {
    selector: 'z-dropdown-menu',
    description:
      'Self-contained alternative to `[z-dropdown]`: trigger and overlay in one element, with the trigger projected through `[dropdown-trigger]` and the rows as default content. Use it when the menu never needs to be opened from anywhere but its own trigger.',
    props: [
      { name: '(openChange)', description: 'Emitted when the menu opens or closes.', type: 'boolean', default: '—' },
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      { name: '[disabled]', description: 'Disables the dropdown.', type: 'boolean', default: 'false' },
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
    description:
      'The menu surface opened by `[z-dropdown]`. Every row primitive below is declared inside it. Placement follows `zSide`/`zAlign`/`zSideOffset` relative to the trigger — the same vocabulary Radix uses for `DropdownMenuContent` — because a dropdown, unlike a context menu, always has an anchor element to be a side or an alignment of.',
    props: [
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zSide]',
        description: "Edge of the trigger the menu opens from. Same meaning as Radix's `side`.",
        type: "'top' | 'right' | 'bottom' | 'left'",
        default: "'bottom'",
      },
      {
        name: '[zAlign]',
        description: "Alignment of the menu along that edge. Same meaning as Radix's `align`.",
        type: "'start' | 'center' | 'end'",
        default: "'start'",
      },
      {
        name: '[zSideOffset]',
        description: "Gap between trigger and menu, in pixels. Same meaning as Radix's `sideOffset`.",
        type: 'number',
        default: '4',
      },
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
    selector: 'z-dropdown-menu-item',
    description:
      'Clickable menu row that closes the dropdown after selection. `variant` and `zVariant` are also accepted, as shadcn-compatibility aliases for `zType` — `zType` is the documented, canonical name.',
    props: [
      {
        name: '[zType]',
        description: 'Visual type of the item.',
        type: "'default' | 'destructive'",
        default: "'default'",
      },
      { name: '[zInset]', description: 'Adds left padding for alignment.', type: 'boolean', default: 'false' },
      { name: '[inset]', description: 'Adds left padding for alignment.', type: 'boolean', default: 'false' },
      { name: '[zDisabled]', description: 'Disables the item.', type: 'boolean', default: 'false' },
      { name: '[disabled]', description: 'Disables the item.', type: 'boolean', default: 'false' },
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
  {
    selector: 'z-dropdown-menu-checkbox-item',
    description:
      'Menu row with a checked state and `menuitemcheckbox` semantics. `variant` and `zVariant` are also accepted, as shadcn-compatibility aliases for `zType` — `zType` is the documented, canonical name.',
    props: [
      { name: '[zChecked]', description: 'Checked state, two-way bindable.', type: 'boolean', default: 'false' },
      { name: '[(zChecked)]', description: 'Checked state (two-way binding).', type: 'boolean', default: 'false' },
      { name: '[zDisabled]', description: 'Disables the item.', type: 'boolean', default: 'false' },
      { name: '[disabled]', description: 'Disables the item.', type: 'boolean', default: 'false' },
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
    description: 'Radio group wrapper for menu radio items.',
    props: [
      {
        name: '[zValue]',
        description: 'Selected radio item value, two-way bindable.',
        type: 'string | undefined',
        default: 'undefined',
      },
      {
        name: '[(zValue)]',
        description: 'Selected radio item value (two-way binding).',
        type: 'string | undefined',
        default: 'undefined',
      },
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-dropdown-menu-radio-item',
    description:
      'Menu row with `menuitemradio` semantics. `variant` and `zVariant` are also accepted, as shadcn-compatibility aliases for `zType` — `zType` is the documented, canonical name.',
    props: [
      { name: '[zValue]', description: 'Value represented by this radio item.', type: 'string', default: '-' },
      { name: '[zDisabled]', description: 'Disables the item.', type: 'boolean', default: 'false' },
      { name: '[disabled]', description: 'Disables the item.', type: 'boolean', default: 'false' },
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
    description:
      'Surface of a submenu. Declared next to its sub-trigger and referenced by it. It has no `side`/`align` inputs — the submenu always opens beside its trigger and flips to the opposite side when the preferred one runs out of room, the same automatic behaviour a native OS submenu has.',
    props: [{ name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
];
