import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const COMBOBOX_API: ApiSection[] = [
  {
    selector: 'z-combobox',
    description: 'Root of the combobox. Owns the value, the query, the open state and the keyboard navigation.',
    props: [
      { name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      {
        name: 'zValue',
        description: 'Selected value. `string` in single mode, `string[]` when `zMultiple` is set. Two-way bindable',
        type: 'model<string | string[] | null>',
        default: 'null',
      },
      {
        name: 'zOpen',
        description: 'Open state of the popup. Two-way bindable',
        type: 'model<boolean>',
        default: 'false',
      },
      { name: 'zMultiple', description: 'Enables multiple selection with chips', type: 'boolean', default: 'false' },
      {
        name: 'zFilter',
        description: 'Built-in filter strategy applied to the item labels',
        type: "'contains' | 'startsWith' | 'none'",
        default: "'contains'",
      },
      {
        name: 'zFilterFn',
        description: 'Custom filter predicate. Takes precedence over `zFilter`',
        type: '((label: string, query: string) => boolean) | null',
        default: 'null',
      },
      { name: 'zSide', description: 'Preferred side of the popup', type: "'top' | 'bottom'", default: "'bottom'" },
      {
        name: 'zAlign',
        description: 'Alignment of the popup against the anchor',
        type: "'start' | 'center' | 'end'",
        default: "'start'",
      },
      { name: 'zSideOffset', description: 'Distance in px between anchor and popup', type: 'number', default: '6' },
      { name: 'zAlignOffset', description: 'Offset in px along the alignment axis', type: 'number', default: '0' },
      {
        name: 'zAutoHighlight',
        description:
          'Highlights the first selectable item while typing, so `Enter` selects it without navigating first',
        type: 'boolean',
        default: 'false',
      },
      {
        name: 'zInvalid',
        description:
          'Marks the combobox as invalid. Adds `data-invalid` to the host and `aria-invalid` to the input and the chips input',
        type: 'boolean',
        default: 'false',
      },
      {
        name: 'zWidth',
        description: 'Width of the combobox',
        type: "'default' | 'sm' | 'md' | 'lg' | 'full'",
        default: "'default'",
      },
      { name: 'zDisabled', description: 'Whether the combobox is disabled', type: 'boolean', default: 'false' },
      {
        name: 'searchable',
        description: 'Whether the input filters the list while typing. When false the input is read-only',
        type: 'boolean',
        default: 'true',
      },
      {
        name: 'placeholder',
        description: 'Placeholder shown when the popup is closed',
        type: 'string',
        default: "'Select...'",
      },
      {
        name: 'searchPlaceholder',
        description: 'Placeholder shown while the popup is open',
        type: 'string',
        default: "'Search...'",
      },
      {
        name: 'emptyText',
        description: 'Empty state text rendered by the shorthand mode',
        type: 'string',
        default: "'No results found.'",
      },
      {
        name: 'options',
        description: 'Shorthand mode only — flat list of options rendered by the root',
        type: 'ZardComboboxOption[]',
        default: '[]',
      },
      {
        name: 'groups',
        description: 'Shorthand mode only — grouped options rendered by the root',
        type: 'ZardComboboxGroup[]',
        default: '[]',
      },
      { name: 'ariaLabel', description: 'ARIA label forwarded to the input', type: 'string', default: "''" },
      {
        name: 'ariaDescribedBy',
        description: 'ARIA described-by forwarded to the input',
        type: 'string',
        default: "''",
      },
      {
        name: 'value',
        description: '@deprecated Legacy value input, synchronised into `zValue`. Use `[(zValue)]`',
        type: 'string | null',
        default: 'null',
      },
      {
        name: 'buttonVariant',
        description: '@deprecated The trigger is no longer a button, this input has no visual effect',
        type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'",
        default: "'outline'",
      },
      {
        name: '(zValueChange)',
        description: 'Emitted whenever the selection changes',
        type: 'output<string | string[] | null>',
        default: '-',
      },
      {
        name: '(zOpenChange)',
        description: 'Emitted when the popup opens or closes',
        type: 'output<boolean>',
        default: '-',
      },
      {
        name: '(zQueryChange)',
        description: 'Emitted when the search query changes',
        type: 'output<string>',
        default: '-',
      },
      {
        name: '(zComboSelected)',
        description: 'Emitted with the option that has just been selected',
        type: 'output<ZardComboboxOption>',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-combobox-input',
    description: 'Input group that hosts the editable combobox input, the trigger and the clear button.',
    props: [
      { name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      {
        name: 'placeholder',
        description: 'Overrides the placeholder inherited from the root',
        type: 'string',
        default: "''",
      },
      { name: 'zShowTrigger', description: 'Renders the chevron trigger button', type: 'boolean', default: 'true' },
      {
        name: 'zShowClear',
        description: 'Renders the clear button whenever there is a value',
        type: 'boolean',
        default: 'false',
      },
      {
        name: 'zDisabled',
        description: 'Forces the input to be disabled. Inherits from the root when false',
        type: 'boolean',
        default: 'false',
      },
    ],
  },
  {
    selector: 'button[z-combobox-trigger]',
    description:
      'Toggles the popup. Inside a `z-input-group` it stays out of the tab order (`tabindex="-1"`) and hides itself when a clear button is visible. Applied to a standalone `button[z-button]` (popup mode, with the `z-combobox-input` moved inside the `z-combobox-content`) it becomes the popup anchor and receives `tabindex="0"`, and the focus returns to it when the popup closes.',
    props: [{ name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'button[z-combobox-clear]',
    description: 'Clears the current selection and the query.',
    props: [{ name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-combobox-content',
    description: 'Popup rendered through the CDK overlay and positioned against the anchor.',
    props: [
      { name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      {
        name: 'zAnchor',
        description: 'Element the popup is anchored to. Defaults to the input group (or the chips container)',
        type: 'ElementRef<HTMLElement> | HTMLElement | null',
        default: 'null',
      },
      { name: 'zSide', description: 'Overrides the root `zSide`', type: "'top' | 'bottom' | null", default: 'null' },
      {
        name: 'zAlign',
        description: 'Overrides the root `zAlign`',
        type: "'start' | 'center' | 'end' | null",
        default: 'null',
      },
      { name: 'zSideOffset', description: 'Overrides the root `zSideOffset`', type: 'number | null', default: 'null' },
      {
        name: 'zAlignOffset',
        description: 'Overrides the root `zAlignOffset`',
        type: 'number | null',
        default: 'null',
      },
    ],
  },
  {
    selector: 'z-combobox-list',
    description: 'Scrollable listbox holding the items.',
    props: [{ name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-combobox-item',
    description: 'Selectable option. Hidden automatically when it does not match the query.',
    props: [
      { name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      { name: 'zValue', description: 'Value of the option (required)', type: 'string', default: '-' },
      {
        name: 'zLabel',
        description: 'Label used for filtering. Falls back to the projected text content',
        type: 'string',
        default: "''",
      },
      { name: 'zDisabled', description: 'Whether the option can be selected', type: 'boolean', default: 'false' },
      {
        name: 'zVariant',
        description: 'Visual variant of the option',
        type: "'default' | 'destructive'",
        default: "'default'",
      },
    ],
  },
  {
    selector: 'z-combobox-group',
    description: 'Groups related items. Hides itself when every child item is filtered out.',
    props: [{ name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-combobox-label',
    description: 'Heading of a group.',
    props: [{ name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-combobox-empty',
    description: 'Empty state, visible only when no item matches the query.',
    props: [{ name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-combobox-separator',
    description: 'Horizontal rule between groups.',
    props: [{ name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-combobox-chips',
    description: 'Container used in multiple mode. Becomes the popup anchor and focuses the chips input on click.',
    props: [{ name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-combobox-chip',
    description: 'Single selected value rendered as a removable chip.',
    props: [
      { name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      { name: 'zValue', description: 'Value represented by the chip (required)', type: 'string', default: '-' },
      { name: 'zShowRemove', description: 'Renders the remove button', type: 'boolean', default: 'true' },
    ],
  },
  {
    selector: 'button[z-combobox-chip-remove]',
    description: 'Removes a value from the selection.',
    props: [
      { name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      { name: 'zValue', description: 'Value to remove', type: 'string', default: "''" },
    ],
  },
  {
    selector: 'input[z-combobox-chips-input]',
    description:
      'Editable input rendered inside the chips container. Backspace on an empty field removes the last chip.',
    props: [{ name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-combobox-value',
    description:
      'Renders the label of the current selection, typically inside a standalone trigger. Exposes `data-placeholder` while there is no selection, so the placeholder text can be styled.',
    props: [
      { name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      {
        name: 'placeholder',
        description: 'Text rendered when there is no selection. Falls back to the root `placeholder`',
        type: 'string',
        default: "''",
      },
    ],
  },
];
