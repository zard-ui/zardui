import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const CARD_API: ApiSection[] = [
  {
    selector: 'z-card',
    description:
      'A structured container for displaying content with body section and optional header and footer sections.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      { name: '[zAction]', description: 'Card action button (requires zTitle)', type: 'string', default: "''" },
      {
        name: '[zDescription]',
        description: 'Card description content (requires zTitle)',
        type: 'string | TemplateRef<void> | undefined',
        default: '-',
      },
      { name: '[zFooterBorder]', description: 'Card footer with border', type: 'boolean', default: 'false' },
      {
        name: '[zHeaderBorder]',
        description: 'Card header with border (requires zTitle)',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[zTitle]',
        description: 'Card title content. Required to have header',
        type: 'string | TemplateRef<void> | undefined',
        default: '-',
      },
      { name: '(zActionClick)', description: 'Emits action button click', type: 'void', default: '-' },
    ],
  },
];
