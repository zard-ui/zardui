import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const COMMAND_API: ApiSection[] = [
  {
    selector: 'z-command',
    description: 'Command palette root that filters options; exported as `zCommand`.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '(zCommandChange)',
        description: 'Emitted when the highlighted option changes',
        type: 'EventEmitter<ZardCommandOption>',
        default: '-',
      },
      {
        name: '(zCommandSelected)',
        description: 'Emitted when an option is chosen',
        type: 'EventEmitter<ZardCommandOption>',
        default: '-',
      },
      {
        name: 'isEmpty()',
        description: '`true` when a search matches no option',
        type: 'Signal<boolean>',
        default: '-',
      },
      { name: 'focus()', description: 'Focuses the search input', type: '() => void', default: '-' },
    ],
  },
  {
    selector: 'z-command-input',
    description: 'The search box; exported as `zCommandInput`.',
    props: [
      {
        name: '[placeholder]',
        description: 'Placeholder text',
        type: 'string',
        default: "'Type a command or search...'",
      },
      { name: '(valueChange)', description: 'Emitted on every keystroke', type: 'EventEmitter<string>', default: '-' },
    ],
  },
  {
    selector: 'z-command-list',
    description: 'Scrollable listbox of options and groups.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-command-option',
    description: 'A selectable, filterable entry with leading and trailing slots.',
    props: [
      { name: '[zValue]', description: 'Value emitted on selection (required)', type: 'unknown', default: '-' },
      { name: '[zLabel]', description: 'Label, also used by search (required)', type: 'string', default: '-' },
      { name: '[zIcon]', description: 'Leading icon', type: 'IconName', default: 'undefined' },
      { name: '[zCommand]', description: 'Extra search keywords', type: 'string', default: "''" },
      { name: '[zShortcut]', description: 'Plain-text shortcut hint', type: 'string', default: "''" },
      { name: '[zDisabled]', description: 'Disables the option', type: 'boolean', default: 'false' },
      { name: '[variant]', description: 'Visual variant', type: "'default' | 'destructive'", default: "'default'" },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-command-option-group',
    description: 'Groups options under a heading; hides when all are filtered out.',
    props: [
      { name: '[zLabel]', description: 'Group heading (required)', type: 'string', default: '-' },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-command-divider',
    description: 'Separator between groups; hidden while searching.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
];
