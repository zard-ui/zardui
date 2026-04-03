import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const SEGMENTED_API: ApiSection[] = [
  {
    selector: 'z-segmented',
    description: 'A set of mutually exclusive segments functioning as toggle buttons.',
    props: [
      { name: 'class', description: 'Additional CSS classes to apply', type: 'ClassValue', default: "''" },
      {
        name: 'zSize',
        description: 'Size of the segmented control',
        type: "'sm' | 'default' | 'lg'",
        default: "'default'",
      },
      { name: 'zOptions', description: 'Array of options to display', type: 'SegmentedOption[]', default: '[]' },
      { name: 'zDefaultValue', description: 'Default selected value', type: 'string', default: "''" },
      { name: 'zDisabled', description: 'Whether the entire control is disabled', type: 'boolean', default: 'false' },
      {
        name: 'zAriaLabel',
        description: 'ARIA label for accessibility',
        type: 'string',
        default: "'Segmented control'",
      },
      { name: 'zChange', description: 'Emitted when selection changes', type: 'string', default: '-' },
    ],
  },
];
