import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const INPUT_GROUP_API: ApiSection[] = [
  {
    selector: 'z-input-group',
    description: 'Container that groups an input or textarea with addons (text, icons, buttons).',
    props: [{ name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-input-group-addon',
    description: 'A slot inside the group for prefix/suffix content. Clicking it focuses the inner input.',
    props: [
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zAlign]',
        description: 'Addon alignment',
        type: "'inline-start' | 'inline-end' | 'block-start' | 'block-end'",
        default: "'inline-start'",
      },
    ],
  },
  {
    selector: 'button[z-input-group-button]',
    description: 'Compact button styled to fit inside an InputGroup.',
    props: [
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zSize]',
        description: 'Button size',
        type: "'xs' | 'sm' | 'icon-xs' | 'icon-sm'",
        default: "'xs'",
      },
    ],
  },
  {
    selector: 'z-input-group-text',
    description: 'Inline text label inside an addon (e.g. currency symbol, unit suffix).',
    props: [{ name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
];
