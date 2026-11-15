import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const CARD_API: ApiSection[] = [
  {
    selector: 'z-card, [z-card]',
    description: 'Container with optional header and footer.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zSize]',
        description: 'Card size; `sm` tightens spacing',
        type: "'default' | 'sm'",
        default: "'default'",
      },
      {
        name: '[--card-spacing]',
        description: 'CSS variable for all card gaps and padding',
        type: 'length',
        default: '--spacing(4)',
      },
    ],
  },
  {
    selector: 'z-card-header, [z-card-header]',
    description: 'Holds the title, description and action.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      { name: '[zHeaderBorder]', description: 'Adds a bottom border', type: 'boolean', default: 'false' },
    ],
  },
  {
    selector: 'z-card-title, [z-card-title]',
    description: 'Card title text or template.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      { name: '[zTitle]', description: 'Title content', type: 'string | TemplateRef<void> | undefined', default: '-' },
    ],
  },
  {
    selector: 'z-card-description, [z-card-description]',
    description: 'Card description text or template.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zDescription]',
        description: 'Description content',
        type: 'string | TemplateRef<void> | undefined',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-card-action, [z-card-action]',
    description: 'Action in the card header.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-card-content, [z-card-content]',
    description: 'Main content area of the card.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-card-footer, [z-card-footer]',
    description: 'Footer section of the card.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      { name: '[zFooterBorder]', description: 'Adds a top border', type: 'boolean', default: 'false' },
    ],
  },
];
