import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const COMMAND_API: ApiSection[] = [
  {
    selector: 'z-command',
    description:
      'The command palette root. Filters its `z-command-option`s as `z-command-input` is typed, and owns the arrow-key / Enter / Escape navigation. Exported as `zCommand` for a template reference (`#cmd="zCommand"`) — every example on this page uses it to read `isEmpty()` and call `focus()`. Has no trigger or open state of its own; see the `basic` example for opening it from a `⌘K` shortcut inside a `ZardDialogService` dialog.',
    props: [
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '(zCommandChange)',
        description: 'Fired when the highlighted/committed option changes.',
        type: 'EventEmitter<ZardCommandOption>',
        default: '-',
      },
      {
        name: '(zCommandSelected)',
        description: 'Fired when an option is chosen (click or Enter).',
        type: 'EventEmitter<ZardCommandOption>',
        default: '-',
      },
      {
        name: 'isEmpty()',
        description:
          'Template-reference-only: `true` once a search term is typed and no option matches it. Zard ships no `z-command-empty`; use this to render the empty state yourself, as every example on this page does.',
        type: 'Signal<boolean>',
        default: '-',
      },
      {
        name: 'focus()',
        description:
          'Template-reference-only: focuses `z-command-input`. Called after opening a dialog-hosted command so typing works immediately.',
        type: '() => void',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-command-input',
    description:
      'The search box. Debounced by the app-wide input event manager, forwards arrow/Enter/Escape to the parent `z-command`, and exposes `focus()` via `exportAs="zCommandInput"`. Declares no `[class]` input of its own — a `class` attribute on the tag lands on its host element (not merged through `mergeClasses()`), which is enough to reach descendants with `**:` arbitrary-variant selectors.',
    props: [
      {
        name: '[placeholder]',
        description: 'Placeholder text for the input.',
        type: 'string',
        default: "'Type a command or search...'",
      },
      {
        name: '(valueChange)',
        description: 'Fired on every keystroke, alongside the `ControlValueAccessor` value.',
        type: 'EventEmitter<string>',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-command-list',
    description: 'The `role="listbox"` container for options and groups. Scrolls internally past `max-h-72`.',
    props: [{ name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-command-option',
    description:
      'A single selectable, filterable entry (`role="option"`). Projects `[data-slot=command-option-leading]` before the label and `[data-slot=command-option-trailing]` after it — the `shortcuts` example projects a `z-kbd-group` into the trailing slot instead of using `zShortcut`, for a styled per-key hint.',
    props: [
      { name: '[zValue]', description: 'Value reported on selection (required).', type: 'unknown', default: '-' },
      {
        name: '[zLabel]',
        description: 'Label text, and what the search filters against (required).',
        type: 'string',
        default: '-',
      },
      { name: '[zIcon]', description: 'Leading icon name.', type: 'IconName', default: 'undefined' },
      {
        name: '[zCommand]',
        description: 'Extra text the search also matches against, in addition to `zLabel`.',
        type: 'string',
        default: "''",
      },
      {
        name: '[zShortcut]',
        description:
          'Plain-text shortcut hint rendered at the trailing edge. For a styled hint built from `z-kbd`, project into `[data-slot=command-option-trailing]` instead (see `shortcuts`).',
        type: 'string',
        default: "''",
      },
      {
        name: '[zDisabled]',
        description: 'Disables the option: skipped by keyboard navigation and clicks.',
        type: 'boolean',
        default: 'false',
      },
      { name: '[variant]', description: 'Visual variant.', type: "'default' | 'destructive'", default: "'default'" },
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-command-option-group',
    description:
      'Groups related `z-command-option`s under a heading. Hides itself once every option inside it is filtered out by the current search.',
    props: [
      { name: '[zLabel]', description: 'Group heading (required).', type: 'string', default: '-' },
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-command-divider',
    description:
      'A `role="separator"` line between groups. Hides itself while a search is active, rather than sit next to a group that filtered down to nothing.',
    props: [{ name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
];
