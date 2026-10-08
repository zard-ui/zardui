import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const EMPTY_API: ApiSection[] = [
  {
    selector: 'z-empty',
    description: 'Displays a placeholder when no data is available, commonly used in tables, lists, or search results.',
    props: [
      {
        name: '[zIcon]',
        description:
          'Icon name rendered in the media slot as the `icon` variant (`data-variant="icon"`). Ignored when `zImage` is set.',
        type: 'ZardIcon',
        default: '-',
      },
      {
        name: '[zImage]',
        description:
          'Image URL or custom template (e.g. a `z-avatar`/`z-avatar-group`) rendered in the media slot as the `default` variant (`data-variant="default"`). Takes priority over `zIcon`.',
        type: 'string | TemplateRef<void>',
        default: '-',
      },
      {
        name: '[zDescription]',
        description: 'Description text or custom template',
        type: 'string | TemplateRef<void>',
        default: '-',
      },
      {
        name: '[zTitle]',
        description: 'Title text or custom template',
        type: 'string | TemplateRef<void>',
        default: '-',
      },
      { name: '[zActions]', description: 'Array of action templates', type: 'TemplateRef<void>[]', default: '[]' },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
];
