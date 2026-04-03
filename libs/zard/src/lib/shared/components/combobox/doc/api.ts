import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const COMBOBOX_API: ApiSection[] = [
  {
    selector: 'z-combobox',
    description: 'Autocomplete input and command palette with a list of suggestions.',
    props: [
      { name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      {
        name: 'buttonVariant',
        description: 'Button variant style',
        type: "'default' | 'outline' | 'secondary' | 'ghost'",
        default: "'outline'",
      },
      {
        name: 'zWidth',
        description: 'Width of the combobox',
        type: "'default' | 'sm' | 'md' | 'lg' | 'full'",
        default: "'default'",
      },
      {
        name: 'placeholder',
        description: 'Placeholder text when no value is selected',
        type: 'string',
        default: "'Select...'",
      },
      {
        name: 'searchPlaceholder',
        description: 'Placeholder for the search input',
        type: 'string',
        default: "'Search...'",
      },
      {
        name: 'emptyText',
        description: 'Text shown when no options match the search',
        type: 'string',
        default: "'No results found.'",
      },
      { name: 'zDisabled', description: 'Whether the combobox is disabled', type: 'boolean', default: 'false' },
      { name: 'searchable', description: 'Whether to show the search input', type: 'boolean', default: 'true' },
      { name: 'value', description: 'The selected value', type: 'string | null', default: 'null' },
      { name: 'options', description: 'Array of options (for flat list)', type: 'ZardComboboxOption[]', default: '[]' },
      { name: 'groups', description: 'Array of grouped options', type: 'ZardComboboxGroup[]', default: '[]' },
      { name: 'ariaLabel', description: 'ARIA label for accessibility', type: 'string', default: "''" },
      { name: 'ariaDescribedBy', description: 'ARIA described-by for accessibility', type: 'string', default: "''" },
      {
        name: '(zValueChange)',
        description: 'Emitted when the value changes',
        type: 'output<string | null>',
        default: '-',
      },
      {
        name: '(zComboSelected)',
        description: 'Emitted when an option is selected',
        type: 'output<ZardComboboxOption>',
        default: '-',
      },
    ],
  },
];
