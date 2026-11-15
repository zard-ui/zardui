import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const INPUT_GROUP_API: ApiSection[] = [
  {
    selector: 'z-input-group',
    description: 'Groups an input or textarea with addons.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-input-group-addon',
    description: 'Prefix or suffix slot; clicking it focuses the input.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zAlign]',
        description: 'Addon position',
        type: "'inline-start' | 'inline-end' | 'block-start' | 'block-end'",
        default: "'inline-start'",
      },
    ],
  },
  {
    selector: 'button[z-input-group-button]',
    description: 'Compact button sized to fit inside an addon.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zVariant]',
        description: 'Visual variant',
        type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'",
        default: "'ghost'",
      },
      { name: '[zSize]', description: 'Button size', type: "'xs' | 'sm' | 'icon-xs' | 'icon-sm'", default: "'xs'" },
    ],
  },
  {
    selector: 'z-input-group-text',
    description: 'Inline text inside an addon, e.g. a currency symbol.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
];
