import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const CARD_API: ApiSection[] = [
  {
    selector: 'z-card, [z-card]',
    description: 'A structured container for displaying content with optional header and footer sections.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zSize]',
        description: 'Size variant of the card',
        type: "'default' | 'sm'",
        default: "'default'",
      },
    ],
  },
  {
    selector: 'z-card-header, [z-card-header]',
    description: 'Container for card title, description, and optional action.',
    props: [
      {
        name: '[zHeaderBorder]',
        description: 'Adds a bottom border to the header',
        type: 'boolean',
        default: 'false',
      },
    ],
  },
  {
    selector: 'z-card-title, [z-card-title]',
    description: 'Card title text or template.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zTitle]',
        description: 'Title content — string or template reference',
        type: 'string | TemplateRef<void> | undefined',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-card-description, [z-card-description]',
    description: 'Card description text or template.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zDescription]',
        description: 'Description content — string or template reference',
        type: 'string | TemplateRef<void> | undefined',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-card-action, [z-card-action]',
    description: 'Action button displayed in the card header.',
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
      {
        name: '[zFooterBorder]',
        description: 'Adds a top border to the footer',
        type: 'boolean',
        default: 'false',
      },
    ],
  },
];
