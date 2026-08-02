import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const MENU_API: ApiSection[] = [
  {
    selector: 'z-menu-label',
    description: 'Label component for grouping menu items.',
    props: [
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      { name: '[inset]', description: 'Adds left padding for alignment', type: 'boolean', default: 'false' },
    ],
  },
  {
    selector: 'z-menu-shortcut',
    description: 'Component for displaying keyboard shortcuts in menu items.',
    props: [{ name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-menu',
    description: 'The trigger directive that opens the menu when interacted with.',
    props: [
      {
        name: '[zMenuTriggerFor]',
        description: 'Reference to the menu template',
        type: 'TemplateRef<void>',
        default: 'required',
      },
      { name: '[zDisabled]', description: 'Whether the trigger is disabled', type: 'boolean', default: 'false' },
      { name: '[zTrigger]', description: 'How the menu is triggered', type: "'click' | 'hover'", default: "'click'" },
      {
        name: '[zHoverDelay]',
        description: 'Delay in ms before closing on hover exit',
        type: 'number',
        default: '100',
      },
      {
        name: '[zPlacement]',
        description: 'Menu position relative to trigger',
        type: 'ZardMenuPlacement',
        default: "'bottomLeft'",
      },
    ],
  },
  {
    selector: 'z-context-menu',
    description: 'The trigger directive that opens context menu.',
    props: [
      {
        name: '[zContextMenuTriggerFor]',
        description: 'Reference to the context menu content',
        type: 'TemplateRef<void>',
        default: 'required',
      },
    ],
  },
  {
    selector: 'z-menu-content',
    description: 'Container directive for menu items.',
    props: [{ name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-menu-item',
    description: 'Individual menu item directive.',
    props: [
      { name: '[zDisabled]', description: 'Whether the item is disabled', type: 'boolean', default: 'false' },
      { name: '[zInset]', description: 'Add left padding for alignment', type: 'boolean', default: 'false' },
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      { name: '[menuItemTriggered]', description: 'Emits when item is clicked', type: 'EventEmitter', default: '' },
    ],
  },
];
