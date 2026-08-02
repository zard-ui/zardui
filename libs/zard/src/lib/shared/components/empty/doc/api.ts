import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const EMPTY_API: ApiSection[] = [
  {
    selector: 'z-empty',
    description: 'Displays a placeholder when no data is available, commonly used in tables, lists, or search results.',
    props: [
      { name: 'zIcon', description: 'Icon to display', type: 'ZardIcon', default: '-' },
      { name: 'zImage', description: 'Image URL or custom template', type: 'string | TemplateRef<void>', default: '-' },
      {
        name: 'zDescription',
        description: 'Description text or custom template',
        type: 'string | TemplateRef<void>',
        default: '-',
      },
      {
        name: 'zTitle',
        description: 'Title text or custom template',
        type: 'string | TemplateRef<void>',
        default: '-',
      },
      { name: 'zActions', description: 'Array of action templates', type: 'TemplateRef<void>[]', default: '[]' },
      { name: 'class', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
];
