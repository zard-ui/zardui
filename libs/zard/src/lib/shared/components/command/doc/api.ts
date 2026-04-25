import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const COMMAND_API: ApiSection[] = [
  {
    selector: 'z-command',
    description:
      'The main command palette container that handles search input and keyboard navigation with debounced search, ARIA accessibility, and comprehensive keyboard navigation.',
    props: [
      {
        name: 'size',
        description: 'Size of the command palette',
        type: "'sm' | 'default' | 'lg' | 'xl'",
        default: "'default'",
      },
      { name: 'class', description: 'Additional CSS classes', type: 'string', default: "''" },
      {
        name: '(zCommandChange)',
        description: 'Fired when the selected option changes',
        type: 'output<ZardCommandOption>',
        default: '-',
      },
      {
        name: '(zCommandSelected)',
        description: 'Fired when an option is selected',
        type: 'output<ZardCommandOption>',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-command-input',
    description: 'Search input component with debounced input handling and accessibility features.',
    props: [
      {
        name: 'placeholder',
        description: 'Placeholder text for input',
        type: 'string',
        default: "'Type a command or search...'",
      },
      { name: 'class', description: 'Additional CSS classes', type: 'string', default: "''" },
      {
        name: '(valueChange)',
        description: 'Fired when input value changes',
        type: 'EventEmitter<string>',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-command-list',
    description: 'Container for command options with proper ARIA listbox semantics.',
    props: [{ name: 'class', description: 'Additional CSS classes', type: 'string', default: "''" }],
  },
  {
    selector: 'z-command-option',
    description:
      'Individual selectable option within the command palette with enhanced accessibility and interaction features.',
    props: [
      { name: 'zValue', description: 'Value of the option (required)', type: 'any', default: '-' },
      { name: 'zLabel', description: 'Label text (required)', type: 'string', default: '-' },
      { name: 'zIcon', description: 'Icon HTML content', type: 'string', default: "''" },
      { name: 'zCommand', description: 'Command identifier', type: 'string', default: "''" },
      { name: 'zShortcut', description: 'Keyboard shortcut display', type: 'string', default: "''" },
      { name: 'zDisabled', description: 'Disabled state', type: 'boolean', default: 'false' },
      { name: 'variant', description: 'Visual variant', type: "'default' | 'destructive'", default: "'default'" },
      { name: 'class', description: 'Additional CSS classes', type: 'string', default: "''" },
    ],
  },
  {
    selector: 'z-command-option-group',
    description: 'Groups related command options together with semantic grouping and accessibility.',
    props: [
      { name: 'zLabel', description: 'Group label (required)', type: 'string', default: '-' },
      { name: 'class', description: 'Additional CSS classes', type: 'string', default: "''" },
    ],
  },
  {
    selector: 'z-command-divider',
    description: 'Visual separator between command groups with semantic role.',
    props: [{ name: 'class', description: 'Additional CSS classes', type: 'string', default: "''" }],
  },
];
